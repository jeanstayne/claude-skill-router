# Skill Router

Use este comando quando o usuário pedir para criar, melhorar, revisar ou preparar um projeto de site, landing page, dashboard, sistema, design system ou UI.

## Instrução

Antes de implementar qualquer alteração visual ou estrutural, use o MCP `claude-skill-router`.

Fluxo obrigatório:

1. Chame `route_request` com o pedido bruto do usuário e o caminho do projeto atual.
2. Leia a intenção, pack, skills, agents e design engines sugeridas.
3. Se o resultado indicar baixa confiança, pergunte apenas o mínimo necessário.
4. Se o resultado for confiável, chame `prepare_project_for_request` em `dryRun: true`.
5. Mostre ao usuário o plano de aplicação.
6. Só aplique com `dryRun: false` se houver confirmação explícita.
7. Depois de preparar o projeto, implemente usando as skills recomendadas.
8. Rode validações e gere relatório.

## Regras

- Nunca aplicar pack sem confirmação.
- Nunca ignorar dry-run.
- Nunca alterar projeto fora do workspace.
- Nunca chamar engines externas automaticamente.
- Nunca instalar dependências sem justificar.
- Sempre usar `route_request` primeiro para análise.
- Sempre usar `prepare_project_for_request` com `dryRun: true` antes de aplicar.
- Sempre exigir `confirm: true` para escrita real.
