# claude-skill-router

Roteador inteligente de skills e subagents para Claude Code.

Analisa projetos locais, detecta stack/framework/tipo e recomenda/apenas as skills necessárias.

## Estrutura

```
packages/
  core/          - Scanner, recommender, registry, installer, policy guard, reports
  cli/           - CLI (skill-router scan|recommend|apply|cleanup|audit|report)
  mcp-server/    - MCP Server para Claude Code
  vscode-extension/ - VS Code Extension MVP
registry/        - Skills, agents e packs locais
templates/       - Templates de CLAUDE.md e prompts
policyguard/     - Políticas de auditoria
reports/         - Relatórios por fase
fixtures/        - Projetos de teste
```

## Instalação

```bash
cd claude-skill-router
npm install
npm run build
```

## Uso (CLI)

```bash
npx tsx packages/cli/src/index.ts scan
npx tsx packages/cli/src/index.ts recommend
npx tsx packages/cli/src/index.ts apply --auto --dry-run
npx tsx packages/cli/src/index.ts audit
npx tsx packages/cli/src/index.ts report
```

## Testes

```bash
npm test
```

## Validação completa

```bash
npm run validate
```
