# Policy Guard — claude-skill-router

Políticas de auditoria local para garantir segurança e qualidade.

## Regras

### [high] no-direct-fs-outside-workspace
Nenhuma operação de escrita pode ocorrer fora do diretório alvo definido.

### [high] no-secret-hardcode
Nenhum token, API key ou secret pode ser hardcoded no código fonte.

### [high] no-remote-script-execution
Nenhum script remoto pode ser executado automaticamente sem aprovação explícita.

### [high] no-unreviewed-external-skill-install
Nenhuma skill externa pode ser instalada sem auditoria prévia.

### [medium] require-dry-run-for-project-mutations
Toda mutação em projeto alvo deve ter modo dry-run e confirmação explícita.

### [medium] require-report-after-phase
Toda fase de implementação deve gerar relatório.

### [medium] separate-core-cli-mcp-vscode
Manter separação clara entre core, CLI, MCP e VS Code Extension.

### [medium] no-unused-skill-pack-copy
Não copiar skills não recomendadas para o projeto alvo.

### [low] require-tests-for-new-tools
Toda nova tool ou módulo deve ter cobertura de testes.

### [high] autopilot-install-requires-confirm
A instalação do autopilot (scope=project) requer `confirm: true` para escrita real. Dry-run não pode alterar disco.

### [high] global-autopilot-install-requires-explicit-confirm
A instalação do autopilot com scope=global requer confirmação explícita adicional, pois afeta `~/.claude/skills/`.

### [medium] autopilot-skill-must-require-route-request-first
A skill autopilot deve instruir a chamar `route_request` como primeiro passo, antes de qualquer outro tool MCP.

### [medium] autopilot-skill-must-require-dry-run-before-apply
A skill autopilot deve exigir `dryRun: true` antes de qualquer `prepare_project_for_request` com `dryRun: false`.

### [medium] claude-md-autopilot-block-must-use-managed-markers
O snippet de CLAUDE.md gerado pelo autopilot deve usar markers `<!-- SKILL_ROUTER_AUTOPILOT_START -->` e `<!-- SKILL_ROUTER_AUTOPILOT_END -->`.

### [medium] autopilot-must-not-call-external-engines
A skill autopilot não deve instruir chamada automática a engines externas (Lovable, Stitch, v0, Framer, Relume, Figma, Webflow, etc.).

### [low] autopilot-cli-json-output-valid
O CLI `install-autopilot` deve produzir JSON válido com `--json`.
