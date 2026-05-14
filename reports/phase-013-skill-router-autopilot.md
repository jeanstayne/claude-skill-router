# Relatório da Fase 13 — Skill Router Autopilot

## Objetivo da fase

Criar a camada Skill Router Autopilot que permite ao Claude Code usar o `claude-skill-router` de forma automática, sem depender do comando manual `/skill-router`.

## Diagnóstico inicial

### Slash command atual

O arquivo `.claude/commands/skill-router.md` define um slash command que o Claude Code pode ativar manualmente (`/skill-router`). **Limitação**: depende de ativação manual.

### Prompt workflow atual

`.claude/prompts/auto-skill-router-workflow.md` define gatilhos automáticos. **Limitação**: Claude Code não carrega prompts automaticamente sem skill registrada em `.claude/skills/`.

### MCP atual (pré-Fase 13)

9 tools. `route_request` sempre dry-run, `prepare_project_for_request` dry-run por padrão.

### CLI atual

8 comandos. Sem `install-autopilot`. Sem mecanismo de instalação de skills em projetos alvo.

### VS Code Extension atual

6 comandos. Sem suporte a instalação de autopilot.

### Lacuna de uso automático

- Sem skill no registry para ativação automática
- Sem installer de skills de automação
- Slash command manual
- Sem snippet gerenciado para `CLAUDE.md`

### Riscos

1. Instalação global sem dry-run pode sobrescrever skills do usuário
2. Autopilot sem dry-run pode aplicar packs sem confirmação
3. Snippet de CLAUDE.md sem markers pode corromper configurações existentes
4. Skill autopilot mal escrita pode chamar engines externas

## Arquivos criados

### Registry
- `registry/skills/skill-router-autopilot/SKILL.md` — Skill autopilot
- `registry/skills/skill-router-autopilot/metadata.json` — Metadata com autonomousTrigger
- `registry/packs/autopilot-workflow.json` — Pack workflow do autopilot

### Templates
- `templates/claude-skills/skill-router-autopilot/SKILL.md` — Template instalável
- `templates/claude-skills/skill-router-autopilot/README.md` — Instruções de instalação

### Core
- `packages/core/src/installer/installAutopilot.ts` — Instalador core com dry-run, backup e bloqueio
- `packages/core/src/installer/generateAutopilotClaudeMdSnippet.ts` — Gerador de snippet para CLAUDE.md

### CLI
- `packages/cli/src/commands/installAutopilot.ts` — Comando CLI install-autopilot

### MCP
- `packages/mcp-server/src/tools/installAutopilotSkillTool.ts` — Tool MCP install_autopilot_skill

### Testes
- `packages/core/tests/autopilot.test.ts` — 14 testes
- `packages/cli/tests/install-autopilot.test.ts` — 5 testes
- `packages/mcp-server/tests/install-autopilot-tool.test.ts` — 9 testes

### Documentação
- `docs/autopilot-skill.md` — Documentação completa do autopilot

## Arquivos alterados

- `packages/core/src/installer/index.ts` — Export do installAutopilot, buildClaudeMdSnippet, checkClaudeMdSnippet
- `packages/cli/src/index.ts` — Comando install-autopilot, --scope, --with-claude-md
- `packages/vscode-extension/package.json` — Novo comando installAutopilotSkill
- `packages/vscode-extension/src/extension.ts` — Implementação do comando installAutopilotSkill
- `packages/mcp-server/src/index.ts` — Registro da tool install_autopilot_skill (10 tools)
- `packages/mcp-server/src/tools/index.ts` — Barrel export da nova tool
- `packages/mcp-server/scripts/runtime-check.ts` — Checks para install_autopilot_skill
- `packages/mcp-server/tests/mcp-smoke.test.ts` — Atualizado para 10 tools + mutation checks
- `policyguard/policies/project-policies.md` — 7 novas regras

## Skill Autopilot

### SKILL.md

Contém:
- Objetivo claro
- Lista de quando usar/não usar
- Fluxo obrigatório: route_request → prepare_project_for_request(dryRun) → mostrar plano → confirm → aplicar
- Regras de segurança: nunca aplicar sem confirmação, nunca ignorar dry-run, nunca chamar engines externas
- Formato de resposta padronizado

### Metadata

```json
{
  "id": "skill-router-autopilot",
  "autonomousTrigger": true,
  "maxDefaultUse": false,
  "category": "automation"
}
```

## Pack Autopilot

`autopilot-workflow`: type=workflow, advanced=true, skills=["skill-router-autopilot"]

## CLI install-autopilot

Comandos suportados:
```bash
skill-router install-autopilot --project ./meu-projeto --dry-run
skill-router install-autopilot --project ./meu-projeto --confirm
skill-router install-autopilot --project ./meu-projeto --with-claude-md --dry-run
skill-router install-autopilot --project ./meu-projeto --with-claude-md --confirm
skill-router install-autopilot --scope global --dry-run
skill-router install-autopilot --scope global --confirm
```

Comportamento:
- `--dry-run` (default): não altera disco, mostra preview
- `--confirm`: dispatch real, dryRun=false implícito
- `--scope global`: exige confirmação explícita extra
- `--with-claude-md`: insere snippet gerenciado com markers
- Backup automático antes de sobrescrever
- Não sobrescreve skills existentes sem backup

## CLAUDE.md snippet

Snippet gerenciado com markers:
```
<!-- SKILL_ROUTER_AUTOPILOT_START -->
## Skill Router Autopilot
...
<!-- SKILL_ROUTER_AUTOPILOT_END -->
```

Funções core:
- `buildClaudeMdSnippet()` — Gera o snippet
- `checkClaudeMdSnippet()` — Verifica se bloco gerenciado existe
- `installAutopilot({ withClaudeMd: true })` — Instala snippet junto com a skill

## VS Code Extension

Novo comando: `Claude Skill Router: Install Autopilot Skill`
- QuickPick para selecionar scope (Project/Global)
- Dry-run primeiro com preview em modal
- Confirmação antes de aplicar
- Mostra caminho instalado ao final

## MCP install_autopilot_skill

Tool MCP nº 10. Schema:
```json
{
  "projectPath": "./meu-projeto",
  "scope": "project",
  "withClaudeMd": false,
  "dryRun": true,
  "confirm": false
}
```

Regras:
- Dry-run por padrão
- Escrita real exige `confirm: true`
- Scope global exige confirmação adicional
- Retorna lista de arquivos criados/alterados
- Backup automático antes de sobrescrever

## Policy Guard

7 novas regras:
- `[high] autopilot-install-requires-confirm`
- `[high] global-autopilot-install-requires-explicit-confirm`
- `[medium] autopilot-skill-must-require-route-request-first`
- `[medium] autopilot-skill-must-require-dry-run-before-apply`
- `[medium] claude-md-autopilot-block-must-use-managed-markers`
- `[medium] autopilot-must-not-call-external-engines`
- `[low] autopilot-cli-json-output-valid`

Total: 18 regras (eram 11).

## Runtime Check

Adicionados 4 checks para `install_autopilot_skill`:
- Dry-run sem alterar disco
- Bloqueio sem confirm
- Instalação real com confirm (verifica SKILL.md no disco)
- Verifica conteúdo: route_request, prepare_project_for_request, dryRun: true
- Verifica que não chama engines externas
- Bloqueio global sem confirm

Resultado: 39/39 passando (eram 31).

## Testes executados

| Pacote | Testes | Status |
|--------|--------|--------|
| core (incl. 14 autopilot) | 111 | Aprovado |
| cli (incl. 5 install-autopilot) | 11 | Aprovado |
| mcp-server (incl. 9 install-autopilot-tool) | 38 | Aprovado |
| vscode-extension | placeholder | ok |
| **Total** | **160** | **Todos passando** |

Testes novos:
- Core autopilot: 14 (dry-run não altera disco, confirm instala, backup de skill existente, bloqueio sem confirm, bloqueio global, geração de snippet, detecção de markers, CLAUDE.md dry-run não altera, etc.)
- CLI install-autopilot: 5 (comando exportado, dry-run, bloqueio sem confirm, scope, withClaudeMd)
- MCP install_autopilot_skill: 9 (schema, tool metadata, dry-run, bloqueio sem confirm, bloqueio global, instalação com confirm, verificação de conteúdo em disco)

## Typecheck

4/4 pacotes aprovados.

## Lint

0 erros, 0 warnings.

## Build

4/4 pacotes aprovados.

## Validação final

```
npm run validate
```

- typecheck: OK (4/4)
- lint: OK (0 erros)
- test: OK (160/160)
- build: OK (4/4)
- policy:check: OK (0 violações)

Runtime check: 39/39 passando.

## Problemas encontrados

1. **Variável unused no teste**: `originalContent` lida mas nunca usada. Removida.
2. **--confirm não implicava dryRun=false**: Corrigido — `confirm` agora faz `dryRun = false`.
3. **VS Code Extension typecheck**: Precisava de rebuild do core para novas exports no dist.

## Correções aplicadas

1. Removida variável unused no teste autopilot
2. CLI `--confirm` agora implica `dryRun: false` para escrita real
3. Type annotations nos callbacks do VS Code Extension

## Pendências reais

1. Testar MCP server no Claude Code real
2. Testar VS Code Extension com F5
3. Melhorar detecção de brand (nomes compostos, marcas sem capitalização)
4. Verificar se o Claude Code carrega skills com `autonomousTrigger: true` automaticamente

## Erros existentes antes da fase

Nenhum erro crítico. Pendências da Fase 12:
1. Testar MCP server no Claude Code real
2. Testar VS Code Extension com F5
3. Melhorar detecção de brand

## Erros introduzidos nesta fase

Nenhum erro remanescente. Todos encontrados e corrigidos durante a implementação.

## Publicação no GitHub

### Repositório

https://github.com/jeanstayne/claude-skill-router

### Comandos executados

```bash
git init
git checkout -B main
git remote add origin https://github.com/jeanstayne/claude-skill-router.git
git add .
git commit -m "feat: implement claude skill router with autopilot workflow"
git push -u origin main
```

### Branch

`main`

### Commit

`9a847e0` — 191 arquivos, 19,019 inserções

### Push

Concluído em 14/05/2026. Branch `main` configurada para track `origin/main`.

### .gitignore ativo

Protege: `node_modules/`, `dist/`, `.env`, `.env.*`, `*.log`, `.DS_Store`, `Thumbs.db`, `*.vsix`, `backups/`, `tmp/`

### Status

**Concluído**

### Erros encontrados

Nenhum erro durante a publicação.

### Pendências

1. Testar MCP server no Claude Code real
2. Testar VS Code Extension com F5
3. Melhorar detecção de brand (nomes compostos, marcas sem capitalização)
4. Verificar se o Claude Code carrega skills com `autonomousTrigger: true` automaticamente

## Status final

**Concluído**
