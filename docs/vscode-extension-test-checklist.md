# Checklist de Teste — VS Code Extension

## Extension Development Host (F5)

- [ ] Abrir projeto `claude-skill-router` no VS Code.
- [ ] Pressionar F5 para iniciar Extension Development Host.
- [ ] Confirmar que a nova janela abre sem erros.

### Command Palette

Abrir Command Palette (`Ctrl+Shift+P`) e verificar:

- [ ] `Claude Skill Router: Scan Workspace` aparece na lista.
- [ ] `Claude Skill Router: Recommend Skills` aparece na lista.
- [ ] `Claude Skill Router: Apply Recommended Pack` aparece na lista.
- [ ] `Claude Skill Router: Open Latest Report` aparece na lista.
- [ ] `Claude Skill Router: Run Policy Audit` aparece na lista.

### Executar comandos

- [ ] Rodar `Claude Skill Router: Scan Workspace` — Deve mostrar notificação com tipo de projeto detectado.
- [ ] Rodar `Claude Skill Router: Recommend Skills` — Deve mostrar notificação informativa.
- [ ] Rodar `Claude Skill Router: Apply Recommended Pack` — Deve mostrar notificação (dry-run esperado).
- [ ] Rodar `Claude Skill Router: Open Latest Report` — Deve mostrar notificação.
- [ ] Rodar `Claude Skill Router: Run Policy Audit` — Deve mostrar notificação.

### Verificar console

- [ ] Abrir Developer Tools (`Ctrl+Shift+I` na janela de extensão).
- [ ] Confirmar que não há erros no Console.
- [ ] Confirmar que a extensão ativou sem exceções.

## VSIX

### Gerar VSIX

- [ ] Rodar `npm run build -w packages/vscode-extension`.
- [ ] Rodar `npm run package -w packages/vscode-extension`.
- [ ] Confirmar que um arquivo `.vsix` foi gerado em `packages/vscode-extension/`.

### Instalar VSIX

- [ ] Abrir VS Code normal (não Extension Dev Host).
- [ ] Ir em Extensions (`Ctrl+Shift+X`).
- [ ] Menu `...` > `Install from VSIX...`.
- [ ] Selecionar o arquivo `.vsix` gerado.
- [ ] Confirmar que a extensão aparece como instalada.

### Testar VSIX instalado

- [ ] Abrir um projeto fixture (ex: `fixtures/react-vite-tailwind-lp`).
- [ ] Abrir Command Palette.
- [ ] Rodar `Claude Skill Router: Scan Workspace`.
- [ ] Confirmar que funciona sem erros.
- [ ] Rodar `Claude Skill Router: Run Policy Audit`.
- [ ] Confirmar que funciona sem erros.

### Desinstalar

- [ ] Ir em Extensions.
- [ ] Clicar na engrenagem da extensão.
- [ ] Uninstall.
- [ ] Confirmar remoção.

## Problemas comuns

### Extensão não aparece no Command Palette

- Verificar se `activationEvents` está correto no `package.json`.
- Verificar se `contributes.commands` está correto.
- Rebuildar: `npm run build -w packages/vscode-extension`.

### Erro "command not found"

- Verificar se o `main` no `package.json` aponta para o arquivo compilado correto.
- Verificar se o build gerou `dist/extension.js`.

### VSIX não gera

- Verificar se `vsce` está instalado.
- Rodar `npx vsce package --no-dependencies` diretamente.
- Verificar se `README.md` existe no pacote da extensão.
