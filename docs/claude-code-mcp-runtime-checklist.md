# Checklist Runtime — Claude Code MCP

## Pré-requisitos

- [ ] `npm install` executado em `claude-skill-router/`.
- [ ] `npm run build` aprovado (confirme `packages/mcp-server/dist/index.js` existe).
- [ ] Node.js 18+ instalado e no PATH.
- [ ] Config MCP adicionada ao Claude Code (`.mcp.json`).
- [ ] Claude Code reiniciado.

## Validação das tools

Abrir Claude Code e verificar se as 7 tools do `claude-skill-router` aparecem:

- [ ] `scan_project` — Escaneia projeto e detecta stack/tipo.
- [ ] `recommend_skills` — Recomenda skills e agents.
- [ ] `apply_skill_pack` — Aplica pack (dryRun por padrão).
- [ ] `cleanup_unused_skills` — Remove skills não usadas (dryRun por padrão).
- [ ] `generate_project_instructions` — Gera patch de instruções.
- [ ] `run_policy_audit` — Executa auditoria de políticas.
- [ ] `generate_report` — Gera relatório.

## Teste seguro (sem escrita em disco)

- [ ] Rodar `scan_project` em fixture (`fixtures/react-vite-tailwind-lp`).
- [ ] Confirmar que retorna `framework: "react"` e `projectType: "landing-page"`.
- [ ] Rodar `recommend_skills` com projectType "landing-page", framework "react", ui ["tailwind"].
- [ ] Confirmar que recomenda pack `landing-page`.
- [ ] Rodar `apply_skill_pack` com `dryRun: true`.
- [ ] Confirmar que `dryRun: true` no resultado.
- [ ] Confirmar que `filesCreated` lista os arquivos que seriam criados.
- [ ] Verificar que nenhum arquivo foi realmente criado no disco.
- [ ] Rodar `apply_skill_pack` com `dryRun: false` SEM `confirm`.
- [ ] Confirmar que retorna erro exigindo `confirm: true`.
- [ ] Rodar `run_policy_audit`.
- [ ] Confirmar que retorna `passed: true` (ou violações documentadas).

## Teste com escrita real (apenas em projeto temporário)

- [ ] Rodar `apply_skill_pack` com `dryRun: false` e `confirm: true` em `tmp/runtime-lp-project`.
- [ ] Confirmar que `.claude/` foi criado.
- [ ] Confirmar que `.claude/skill-router.json` existe.
- [ ] Confirmar que skills foram copiadas para `.claude/skills/`.
- [ ] Confirmar que agents foram copiados para `.claude/agents/`.
- [ ] Rodar `cleanup_unused_skills` com `dryRun: true`.
- [ ] Confirmar que lista arquivos gerenciados como preservados.
- [ ] Criar uma skill customizada manualmente em `.claude/skills/my-custom-skill/`.
- [ ] Rodar `cleanup_unused_skills` novamente.
- [ ] Confirmar que a skill customizada aparece como preservada (não gerenciada).

## Erros comuns

- [ ] Caminho incorreto para `dist/index.js` — usar caminho absoluto no Windows.
- [ ] Build não executado após mudanças — rodar `npm run build` novamente.
- [ ] Node não encontrado — verificar `node --version`.
- [ ] Config MCP em local errado — `.mcp.json` na raiz do projeto ou `~/.claude/.mcp.json`.
- [ ] Claude Code não reiniciado após config — reiniciar.
- [ ] ESM module error — Node.js 18+ required.
