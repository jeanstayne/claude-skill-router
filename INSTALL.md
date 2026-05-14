# Copie tudo abaixo e cole no Claude da máquina destino

---

Instale o Claude Skill Router neste computador. Execute os passos em ordem.

**1. Clonar e build**

No PowerShell:
```powershell
git clone https://github.com/jeanstayne/claude-skill-router.git c:/claude-skill-router
cd c:/claude-skill-router
npm install
npm run build
```

**2. Registrar no MCP global**

Leia o arquivo `C:\Users\<seu_usuario>\.mcp.json`. Se não existir, crie. Se existir, edite e adicione este servidor mantendo os outros:
```json
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
```

**3. Auto-aprovar MCP servers**

Leia `C:\Users\<seu_usuario>\.claude\settings.json`. Adicione ou atualize:
```json
"enableAllProjectMcpServers": true
```

**4. Reiniciar VS Code**

10 ferramentas MCP disponíveis globalmente:
- `scan_project` — analisar projeto e detectar stack
- `recommend_skills` — recomendar skills baseado no tipo de projeto
- `route_request` — rotear pedido do usuário para o subagent certo
- `prepare_project_for_request` — preparar CLAUDE.md antes de cada request
- `apply_skill_pack` — instalar conjunto de skills
- `cleanup_unused_skills` — limpar skills não usadas
- `generate_project_instructions` — gerar instruções para o projeto
- `run_policy_audit` — auditoria de políticas
- `generate_report` — relatório de uso de skills
- `install_autopilot_skill` — instalar skill de piloto automático
