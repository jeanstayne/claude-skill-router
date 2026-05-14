# Skill Router Autopilot

## Objetivo

Ativar automaticamente o `claude-skill-router` quando o usuário pedir tarefas relacionadas a sites, landing pages, dashboards, UI, design system, design visual, copy de conversão, revisão visual ou transformação de referência em código.

## Quando usar automaticamente

Use esta skill quando o pedido do usuário envolver:

- Criar landing page.
- Melhorar landing page.
- Criar site institucional.
- Criar página de oferta.
- Criar dashboard.
- Melhorar dashboard.
- Criar sistema SaaS com interface.
- Criar ou melhorar UI.
- Criar design system.
- Melhorar visual.
- Criar interface inspirada em Lovable, Stitch, v0, Framer, Webflow, Relume, Figma, Magic Patterns, Builder ou Uizard.
- Transformar print, imagem ou referência visual em layout.
- Revisar responsividade.
- Revisar qualidade visual.
- Melhorar copy de página.
- Criar hero section.
- Criar estrutura de página.
- Criar sitemap ou wireframe.

## Quando não usar

Não use esta skill quando o pedido for:

- Apenas backend sem interface.
- Apenas banco de dados.
- Apenas DevOps.
- Apenas correção de bug sem impacto visual.
- Apenas pergunta conceitual.
- Apenas texto ou copy sem relação com página, LP, site ou UI.
- Tarefa que não envolva projeto local.

## Fluxo obrigatório

Antes de implementar qualquer alteração visual, estrutural ou de página:

1. Chame a tool MCP `route_request` com:
   - `projectPath` do projeto atual.
   - `userRequest` bruto do usuário.
   - `dryRun: true`.

2. Leia:
   - intent.
   - selectedPack.
   - skills.
   - agents.
   - suggestedDesignEngines.
   - executionPlan.
   - warnings.

3. Se a confiança for baixa ou intent for `unknown`, pergunte somente o mínimo necessário.

4. Se a intenção for clara, chame `prepare_project_for_request` com:
   - `dryRun: true`.
   - `confirm: false`.

5. Mostre ao usuário:
   - intenção detectada;
   - pack recomendado;
   - skills/agents;
   - design engines sugeridas;
   - plano de execução;
   - arquivos que seriam alterados.

6. Só chame `prepare_project_for_request` com `dryRun: false` se o usuário confirmar explicitamente.

7. Após preparar o projeto, implemente a tarefa usando as skills recomendadas.

8. Rode validações.

9. Gere relatório final.

## Regras de segurança

- Nunca aplique pack sem confirmação explícita.
- Nunca ignore dry-run.
- Nunca execute engines externas automaticamente.
- Nunca baixe arquivos externos.
- Nunca instale dependências sem justificar.
- Nunca altere arquivos fora do workspace.
- Nunca remova skills customizadas do usuário.
- Nunca oculte erro de build, lint, test ou Policy Guard.

## Formato de resposta ao usuário

Sempre que ativar o router, responda com:

```txt
Intenção detectada:
Pack recomendado:
Skills:
Agents:
Design engines sugeridas:
Modo:
Próximo passo:
```

## Exemplo

Pedido do usuário:

```txt
Crie uma LP premium para a Samar com visual Lovable.
```

Ação esperada:

1. Chamar `route_request`.
2. Chamar `prepare_project_for_request` em dry-run.
3. Mostrar plano.
4. Aguardar confirmação para aplicar.
