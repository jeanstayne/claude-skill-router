# Relatório da Fase 12 — Natural Language Request Router e Plugin Workflow

## Objetivo da fase

Implementar roteamento por linguagem natural: o Skill Router entende pedidos feitos no chat e escolhe automaticamente a skill, pack, agents e design engines corretos para aquele pedido.

## Diagnóstico inicial

### Recommender atual
- Baseado em projectType, framework, ui — não considerava o pedido do usuário
- Sem classificação de intenção
- Sem detecção de palavras-chave

### MCP atual
- 7 tools (scan_project, recommend_skills, apply_skill_pack, cleanup_unused_skills, generate_project_instructions, run_policy_audit, generate_report)
- Sem tools de roteamento por pedido natural

### CLI atual
- Comandos scan, recommend, apply, cleanup, audit, report
- Sem suporte a pedidos em linguagem natural

### Lacunas
- Sem análise de intenção
- Sem extração de sinais (brand, estilo visual, design engine mencionada)
- Sem plano de execução automático
- Sem seleção de pack por contexto do pedido

## Arquivos criados

### Core Router
- `packages/core/src/router/index.ts` — Barrel export
- `packages/core/src/router/routeRequest.ts` — Função principal de roteamento
- `packages/core/src/router/extractRequestSignals.ts` — Extração heurística de sinais
- `packages/core/src/router/classifyIntent.ts` — Classificador de intenção (11 intents)
- `packages/core/src/router/selectPackForIntent.ts` — Seleção de pack por intenção
- `packages/core/src/router/generateExecutionPlan.ts` — Geração de plano de execução
- `packages/core/src/schemas/requestRouterSchema.ts` — Schemas Zod

### MCP Tools
- `packages/mcp-server/src/tools/routeRequestTool.ts` — Tool `route_request`
- `packages/mcp-server/src/tools/prepareProjectForRequestTool.ts` — Tool `prepare_project_for_request`

### CLI Commands
- `packages/cli/src/commands/route.ts` — Comando `route`
- `packages/cli/src/commands/prepare.ts` — Comando `prepare`

### Slash Command / Prompt Workflow
- `.claude/commands/skill-router.md` — Slash command para Claude Code
- `.claude/prompts/auto-skill-router-workflow.md` — Prompt de workflow automático

### Testes
- `packages/core/tests/router.test.ts` — 27 testes

## Arquivos alterados

- `packages/core/src/index.ts` — Export do módulo router
- `packages/core/package.json` — Adicionado `./router` nos exports
- `packages/core/src/schemas/requestRouterSchema.ts` — Zod schemas
- `packages/mcp-server/src/index.ts` — Registro de 2 novas tools (9 total)
- `packages/cli/src/index.ts` — Comandos route e prepare
- `packages/vscode-extension/package.json` — Novo comando prepareFromPrompt
- `packages/vscode-extension/src/extension.ts` — Implementação do prepareFromPrompt com input box
- `eslint.config.js` — Adicionado `**/dist/` nos ignores
- `packages/core/src/router/classifyIntent.ts` — Correção de regex para "esse"/"aquele"
- `packages/core/src/router/routeRequest.ts` — Tipo flexível para confirm/dryRun

## Intent Router

### classificarIntents (11 tipos)

| Intent | Exemplo de pedido |
|--------|------------------|
| `create-landing-page` | "crie uma LP premium" |
| `improve-landing-page` | "melhore essa landing page" |
| `create-dashboard` | "crie um dashboard novo" |
| `improve-dashboard` | "melhore esse dashboard" |
| `plan-website-structure` | "crie sitemap do site" |
| `convert-visual-reference-to-code` | "transforme esse print em layout" |
| `review-visual-quality` | "faça QA visual" |
| `improve-copy` | "melhore a copy da oferta" |
| `create-design-system` | "crie um design system" |
| `create-institutional-site` | "crie site institucional" |
| `prepare-project` | "prepare o projeto" |
| `unknown` | "melhore isso aqui" |

### extractRequestSignals

Extrai heurísticamente:
- **Brand**: palavras capitalizadas após "para a/para o"
- **VisualStyle**: premium, modern, bold, minimal, tech, lovable-style
- **BusinessGoal**: conversion, lead-generation, branding, engagement
- **DesignEngine**: lovable, stitch, v0, framer, relume, figma
- **RequestedOutput**: landing-page, dashboard, institutional-site, design-system
- **Stack**: react, next, vite, vue, tailwind, shadcn, typescript

### selectPackForIntent

| Condição | Pack |
|----------|------|
| create-landing-page + premium/lovable | `lovable-premium-lp` |
| create-landing-page padrão | `landing-page` |
| create-dashboard + v0/shadcn | `v0-dashboard-ui` |
| create-dashboard padrão | `dashboard-saas` |
| create-institutional-site | `institutional-site` |
| plan-website-structure | `relume-website-planning` |
| convert-visual-reference-to-code | `visual-reference-to-code` |
| create-design-system | `stitch-visual-system` |
| unknown | `none` (não aplicar) |

## MCP Tools novas

**route_request**: Análise + recomendação sem mutação. Sempre dry-run.
**prepare_project_for_request**: Análise + preparação. Dry-run por padrão, requer `confirm: true` para escrita.

Total de tools MCP: 9 (eram 7).

## CLI

```bash
skill-router route --project ./my-project --request "crie LP premium"
skill-router prepare --project ./my-project --request "crie LP premium" --dry-run
skill-router prepare --project ./my-project --request "crie LP premium" --confirm
```

## VS Code Extension

Novo comando: `Claude Skill Router: Prepare Project From Prompt` — abre input box para pedido natural, mostra resultado.

## Slash Command

- `.claude/commands/skill-router.md` — Fluxo obrigatório para Claude Code
- `.claude/prompts/auto-skill-router-workflow.md` — Gatilhos automáticos

## Testes executados

| Pacote | Testes | Status |
|--------|--------|--------|
| core (incl. 27 router) | 97 | Aprovado |
| cli | 6 | Aprovado |
| mcp-server | 29 | Aprovado |
| vscode-extension | placeholder | ok |
| **Total** | **132** | **Todos passando** |

### Router tests (27)
- classifyIntent: 7 (LP, dashboard, improve, visual-ref, QA, sitemap, unknown)
- extractRequestSignals: 6 (Lovable, v0, premium, conversion, LP output, dashboard output)
- selectPackForIntent: 5 (lovable-premium, standard LP, v0-dashboard, relume, unknown)
- generateExecutionPlan: 3 (scan first, apply-confirmed, minimal)
- routeRequest: 6 (intent+pack, dry-run default, block mutation, explicit pack, execution plan, unknown)

## Typecheck

4/4 pacotes aprovados.

## Lint

0 erros, 0 warnings.

## Build

4/4 pacotes aprovados.

## Policy Guard

0 violações (11 regras verificadas).

## Validação final

```
npm run validate
```

- typecheck: OK
- lint: OK (0 erros)
- test: OK (132/132)
- build: OK
- policy:check: OK (0 violações)

## Problemas encontrados

1. **`RouteRequestInput` exigia `confirm`**: Zod default não torna opcional. Corrigido com tipo flexível.
2. **Regex "melhore esse dashboard"**: Não capturava "esse"/"aquele". Corrigido com `(?:\w+\s+)?`.
3. **`/router` não exportado**: package.json do core sem subpath. Adicionado.
4. **Lint em `dist/`**: Adicionado `**/dist/` nos ignores do ESLint.

## Correções aplicadas

1. Tipo flexível em routeRequest (Omit + Partial)
2. Regex melhorado para capturar determinantes entre verbo e objeto
3. Subpath `./router` nos exports do core
4. ESLint ignora `**/dist/`
5. `selectedPack` → `const`

## Pendências reais

1. Testar `route_request` e `prepare_project_for_request` no Claude Code real
2. Melhorar detecção de brand (nomes compostos, marcas sem capitalização)
3. Adicionar mais palavras-chave de intenção para melhorar acurácia

## Erros existentes antes da fase

Nenhum erro crítico.

## Erros introduzidos nesta fase

Nenhum erro remanescente. Todos encontrados e corrigidos.

## Status final

**Concluído**
