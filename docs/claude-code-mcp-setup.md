# Configurando o MCP do Claude Skill Router no Claude Code

## Pré-requisitos

- Node.js 18+
- Projeto `claude-skill-router` clonado e com dependências instaladas
- Claude Code ou Claude Desktop com suporte a MCP

## 1. Build do projeto

```bash
cd claude-skill-router
npm install
npm run build
```

O build gera os arquivos compilados em `packages/mcp-server/dist/index.js`.

## 2. Localizar o entry point

O entry point do MCP server é:

```
packages/mcp-server/dist/index.js
```

Verifique se o arquivo existe:

```bash
ls packages/mcp-server/dist/index.js
```

## 3. Configurar no Claude Code

Adicione ao arquivo `.mcp.json` na raiz do seu projeto (ou `~/.claude/.mcp.json` para configuração global):

```json
{
  "mcpServers": {
    "claude-skill-router": {
      "command": "node",
      "args": [
        "./packages/mcp-server/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

**Importante**: O caminho `./packages/mcp-server/dist/index.js` deve ser relativo ao diretório onde o Claude Code está rodando. Se o `claude-skill-router` estiver em outro local, use o caminho absoluto:

```json
{
  "mcpServers": {
    "claude-skill-router": {
      "command": "node",
      "args": [
        "/caminho/para/claude-skill-router/packages/mcp-server/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

### Exemplo para Windows

```json
{
  "mcpServers": {
    "claude-skill-router": {
      "command": "node",
      "args": [
        "C:/Users/seu-usuario/claude-skill-router/packages/mcp-server/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

## 4. Verificar se as tools aparecem

Após configurar e reiniciar o Claude Code, pergunte:

> "Quais tools MCP estão disponíveis?"

Ou use comandos para testar cada tool.

As 7 tools disponíveis são:

| Tool | Descrição |
|------|-----------|
| `scan_project` | Escaneia projeto e detecta stack/tipo |
| `recommend_skills` | Recomenda skills e agents |
| `apply_skill_pack` | Aplica pack (dry-run por padrão) |
| `cleanup_unused_skills` | Remove skills não usadas (dry-run por padrão) |
| `generate_project_instructions` | Gera patch de instruções |
| `run_policy_audit` | Executa auditoria de políticas |
| `generate_report` | Gera relatório |

## 5. Como chamar as tools

### Scan

```
Use scan_project para escanear o projeto atual em ./
```

### Recommend

```
Use recommend_skills com projectType "landing-page", framework "react", ui ["tailwind"]
```

### Apply (dry-run seguro)

```
Use apply_skill_pack com projectPath "./", packId "landing-page", dryRun true
```

### Apply (escrita real — requer confirmação)

```
Use apply_skill_pack com projectPath "./meu-projeto", packId "landing-page", dryRun false, confirm true
```

## 6. Validar dry-run

O dry-run é o padrão. Para verificar, chame `apply_skill_pack` sem especificar `dryRun`:

```
Use apply_skill_pack com projectPath "./meu-projeto", packId "landing-page"
```

O resultado deve mostrar `dryRun: true` e listar os arquivos que seriam criados sem realmente criá-los.

## 7. Erros comuns no Windows

### Erro: `node` não encontrado

Certifique-se de que o Node.js está instalado e no PATH:

```powershell
node --version
```

### Erro: caminho não encontrado

Use barras normais (`/`) ou escape as contrabarras (`\\`):

```json
{
  "args": [
    "C:/Users/seu-usuario/claude-skill-router/packages/mcp-server/dist/index.js"
  ]
}
```

### Erro: módulo não encontrado

Rode `npm install` e `npm run build` novamente:

```bash
cd claude-skill-router
npm install
npm run build
```

### Erro: permissão negada

No Windows, execute o terminal como administrador ou verifique as permissões da pasta.

### Erro: ESM module

O projeto usa módulos ES. Certifique-se de que a versão do Node.js é 18+.
