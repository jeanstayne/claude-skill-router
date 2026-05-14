# Relatório da Fase 9 — Hardening e Integração Real

## Objetivo da fase

Resolver todas as pendências reais do MVP: integrar MCP Server com funções reais do core, implementar cleanup seguro, configurar ESLint, melhorar UX da CLI, criar testes de integração e atualizar o Policy Guard.

## Diagnóstico inicial

### MCP
- 7 tools com handlers stub (`return { status: 'not_implemented' }`)
- `applySkillPackTool` e `cleanupUnusedSkillsTool` com `dryRun: true` default, mas sem `confirm` para escrita real
- Nenhuma integração com funções do core

### CLI
- `index.ts` não despachava para comandos reais (só imprimia "Phase 5")
- Arquivos de comando individuais já implementados corretamente

### VS Code Extension
- package.json sem `activationEvents` e `contributes.commands`

### Cleanup
- MVP conservador que nunca removia arquivos de fato
- Sem suporte a preservação de arquivos não gerenciados

### ESLint
- Não configurado (placeholder `echo 'lint: ok'`)

### Policy Guard
- Apenas 5 regras básicas
- Sem verificações reais de código

## Arquivos criados

- `eslint.config.js` — Configuração ESLint com typescript-eslint
- `packages/core/tests/e2e.test.ts` — 7 testes E2E de integração

## Arquivos alterados

### MCP Server (integração real)
- `packages/mcp-server/src/index.ts` — Server MCP completo com registro de 7 tools e wrapHandler
- `packages/mcp-server/src/tools/scanProjectTool.ts` — Chama `scanProject()` real
- `packages/mcp-server/src/tools/recommendSkillsTool.ts` — Chama `recommendSkills()` real
- `packages/mcp-server/src/tools/applySkillPackTool.ts` — Chama `installSkillPack()` real + confirm gate + Zod parse
- `packages/mcp-server/src/tools/cleanupUnusedSkillsTool.ts` — Chama `cleanupUnusedSkills()` real + confirm gate + Zod parse
- `packages/mcp-server/src/tools/generateInstructionsTool.ts` — Chama `loadRegistry()` + `generateClaudeMdPatch()` reais
- `packages/mcp-server/src/tools/runAuditTool.ts` — Chama `runPolicyGuard()` + `parsePolicyResults()` reais
- `packages/mcp-server/src/tools/generateReportTool.ts` — Chama `scanProject()` + `runPolicyGuard()` reais

### CLI
- `packages/cli/src/index.ts` — CLI reescrita: argument parsing, dispatch real, --help, --json, --auto, --dry-run
- `packages/cli/src/commands/report.ts` — Parâmetro unused renomeado
- `packages/cli/package.json` — Script audit com path para raiz do projeto

### Core
- `packages/core/src/installer/cleanupUnusedSkills.ts` — Implementação real: remove skills/agents removidos do pack, preserva não gerenciados, backup antes de remover
- `packages/core/src/installer/generateClaudeMdPatch.ts` — Removidos unused imports/vars
- `packages/core/src/installer/installSkillPack.ts` — Removido unused import
- `packages/core/src/policy/runPolicyGuard.ts` — Implementação real com 11 regras, scanners de código
- `packages/core/src/recommender/recommendSkills.ts` — Removido cachedRegistry não usado
- `packages/core/tests/installer.test.ts` — Removido unused import

### VS Code Extension
- `packages/vscode-extension/package.json` — Adicionados `activationEvents`, `contributes.commands`, `engines`, `displayName`

### Root
- `package.json` — Adicionado `"type": "module"`, script `lint` com `eslint packages/`, ESLint deps

## Implementação realizada

### MCP Server (9.2)
- Todos os 7 handlers chamam funções reais do `@claude-skill-router/core`
- `scan_project` → scanner real com resultado completo
- `recommend_skills` → recommender real com registry
- `apply_skill_pack` → installer real; requer `confirm: true` para dryRun=false
- `cleanup_unused_skills` → cleanup real; requer `confirm: true` para dryRun=false
- `generate_project_instructions` → loadRegistry + generateClaudeMdPatch
- `run_policy_audit` → Policy Guard real com parse
- `generate_report` → scan + audit reais
- Server MCP funcional com `StdioServerTransport`

### CLI (9.7)
- Parse de argumentos completo (`--project`, `--pack`, `--json`, `--dry-run`, `--auto`, `--help`)
- Comando `scan` funcional (texto e JSON)
- Comando `recommend` funcional (auto-detecta tipo via scan)
- Comando `apply --auto` funcional (scan → recommend → apply)
- Comando `apply --dry-run` funcional
- Comando `cleanup --dry-run` funcional
- Comando `audit` funcional
- Comando `report` funcional
- Help com exemplos
- Códigos de saída corretos
- Tratamento de erros

### Cleanup seguro (9.4)
- Remove skills/agents que eram gerenciados mas não estão mais no pack ativo
- Preserva arquivos não gerenciados (custom skills do usuário)
- Backup automático antes de remover
- Suporte a dry-run
- Lista arquivos preservados

### ESLint (9.5)
- Configurado com `typescript-eslint` (flat config)
- Regras: `no-unused-vars`, `no-explicit-any` (warn)
- Ignora `node_modules/`, `dist/`, fixtures, reports, registry
- `npm run lint` passa com 0 erros

### VS Code Extension (9.6)
- `activationEvents` configurados para 5 comandos
- `contributes.commands` com 5 comandos registrados
- `engines.vscode` >= 1.90.0
- `displayName` definido
- Script `package` configurado para `vsce package`

### Policy Guard (9.9)
- 11 regras (eram 5)
- Novas regras: `mcp-mutating-tools-require-dry-run-default`, `mcp-mutating-tools-require-confirm-for-write`, `cleanup-must-preserve-unmanaged-files`, `vscode-extension-package-metadata-required`, `eslint-config-required`, `cli-json-output-should-be-valid`
- Verificações reais: scan de código MCP tools, package.json da extensão, eslint.config.js, secrets hardcoded

### Testes (9.3, 9.8)
- MCP: 20 testes (7 schemas + 13 integração real)
- E2E: 7 testes de fluxo completo (scan → recommend → apply dry-run → apply real → cleanup → preserve unmanaged → audit)

## Testes executados

| Pacote | Testes | Status |
|--------|--------|--------|
| core | 66 (59 + 7 E2E) | Aprovado |
| cli | 6 | Aprovado |
| mcp-server | 20 (7 + 13 integration) | Aprovado |
| vscode-extension | placeholder | ok |
| **Total** | **92** | **Todos passando** |

## Resultado dos testes

92/92 testes passando, 0 falhas.

## Typecheck

4/4 pacotes aprovados.

## Lint

0 erros, 0 warnings.

## Build

4/4 pacotes aprovados.

## Validação final

```bash
npm run validate
```

- typecheck: OK
- lint: OK (0 errors)
- test: OK (92/92)
- build: OK
- policy:check: OK (0 violações)

## Problemas encontrados

1. **MCP handlers retornavam objeto sem `content`**: MCP SDK exige `{ content: [{ type: "text", text: "..." }] }`. Corrigido com `wrapHandler()`.
2. **Zod defaults não aplicados sem `.parse()`**: Handlers chamados diretamente nos testes não tinham defaults. Corrigido com `.parse()` explícito.
3. **Policy Guard rodando do diretório errado**: Script `audit` rodava de `packages/cli/`, não da raiz. Corrigido passando `../..` como argumento.
4. **Unused vars/impports (7)**: Detectados pelo ESLint, todos corrigidos.

## Correções aplicadas

1. `wrapHandler()` no server MCP para formato de resposta MCP
2. Zod `.parse()` nos handlers de mutação para aplicar defaults
3. Path relativo corrigido no script `audit`
4. 7 erros de lint corrigidos (unused vars/imports)
5. `"type": "module"` no root package.json
6. `activationEvents` e `contributes` no package.json da extensão

## Riscos

- MCP server não testado com Claude Code real (apenas testes unitários/integração)
- VS Code Extension não testada em runtime real (apenas typecheck)
- Build .vsix requer `vsce` instalado globalmente

## Pendências reais

1. Testar MCP server no Claude Code real
2. Build .vsix da extensão (requer `vsce` instalado)
3. Mais skills para outros tipos de projeto
4. Testes da extensão VS Code em runtime real

## Erros existentes antes da fase

Nenhum erro crítico. Pendências eram as listadas no final-report.md.

## Erros introduzidos nesta fase

Nenhum erro remanescente. Todos os problemas encontrados foram corrigidos.

## Status final

**Concluído**
