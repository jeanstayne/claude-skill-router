# claude-skill-router

Roteador inteligente de skills e subagents para Claude Code.

Analisa projetos locais, detecta stack/framework/tipo e recomenda/apenas as skills necessárias.

## 🚀 Instalação rápida — Copie e cole no Claude

```text
Instale o Claude Skill Router neste computador. Execute em ordem:

1. Clonar e build
git clone https://github.com/jeanstayne/claude-skill-router.git c:/claude-skill-router
cd c:/claude-skill-router
npm install && npm run build

2. Adicionar ao C:\Users\<seu_usuario>\.mcp.json (global, mantendo servidores existentes)
{
  "mcpServers": {
    "claude-skill-router": {
      "type": "stdio",
      "command": "node",
      "args": ["c:/claude-skill-router/packages/mcp-server/dist/mcp-server/src/index.js"],
      "env": {}
    }
  }
}

3. Reiniciar VS Code. 10 ferramentas MCP disponíveis: scan_project, recommend_skills, route_request, apply_skill_pack, install_autopilot_skill e mais.
```

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
