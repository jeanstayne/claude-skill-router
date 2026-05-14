# Claude Skill Router - VS Code Extension

Extensão para VS Code que integra o Claude Skill Router ao editor.

## Comandos disponíveis

- **Claude Skill Router: Scan Workspace** — Escaneia o workspace atual e detecta stack/tipo de projeto.
- **Claude Skill Router: Recommend Skills** — Recomenda skills e agents para o projeto atual.
- **Claude Skill Router: Apply Recommended Pack** — Aplica o pack recomendado no projeto atual.
- **Claude Skill Router: Open Latest Report** — Abre o relatório mais recente.
- **Claude Skill Router: Run Policy Audit** — Executa auditoria de políticas.

## Desenvolvimento (F5)

1. Build:
   ```bash
   cd claude-skill-router
   npm install
   npm run build
   ```

2. Pressionar F5 no VS Code para iniciar Extension Development Host.
   A configuração de launch está em `.vscode/launch.json`.

## Gerar VSIX

```bash
npm run build -w packages/vscode-extension
npm run package -w packages/vscode-extension
```

O arquivo `.vsix` será gerado em `packages/vscode-extension/`.

## Instalar VSIX

1. Abrir VS Code.
2. Ir em Extensions (`Ctrl+Shift+X`).
3. Clicar no menu `...` (três pontos).
4. Selecionar `Install from VSIX...`.
5. Escolher o arquivo `claude-skill-router-extension-1.0.0.vsix`.
6. Reiniciar VS Code se solicitado.

## Testar

1. Abrir um projeto (ex: `fixtures/react-vite-tailwind-lp`).
2. Abrir Command Palette (`Ctrl+Shift+P`).
3. Rodar `Claude Skill Router: Scan Workspace`.
4. Verificar notificação com tipo de projeto detectado.

Ver checklist completo em [docs/vscode-extension-test-checklist.md](../../docs/vscode-extension-test-checklist.md).

## MVP

Esta é uma versão MVP. O painel lateral (SkillRouterPanel) será implementado em versões futuras.
