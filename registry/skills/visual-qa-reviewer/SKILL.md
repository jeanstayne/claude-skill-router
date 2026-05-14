# Visual QA Reviewer

## Objetivo

Revisar visualmente páginas e componentes em desktop, tablet e mobile, gerando relatório de problemas com severidade e sugestão de correção.

## Quando usar

- Após implementação de landing page
- Após mudanças visuais significativas
- Antes de publicar página
- Revisão de responsividade

## Quando não usar

- Durante implementação inicial (atrapalha o fluxo)
- Projetos sem interface visual

## Processo

1. Revisão desktop (1440px)
2. Revisão tablet (768px)
3. Revisão mobile (375px)
4. Verificar hero acima da dobra
5. Verificar CTA visível
6. Verificar contraste de texto
7. Verificar responsividade
8. Verificar overflow horizontal
9. Verificar alinhamentos
10. Verificar hierarquia visual
11. Verificar espaçamentos
12. Gerar relatório

## Checklist de verificação

### Hero
- Headline visível sem scroll em todos os breakpoints
- CTA visível sem scroll
- Imagem de fundo não corta em mobile
- Altura adequada (nem muito alto, nem muito baixo)

### CTA
- Cor contrastante com fundo
- Tamanho adequado para toque (min 44px)
- Texto claro e específico
- Estados: hover, focus, active

### Contraste
- Texto sobre fundo: mínimo 4.5:1 (normal), 3:1 (large)
- Links identificáveis (não só cor)
- Estados de foco visíveis

### Responsividade
- Sem overflow horizontal
- Imagens responsivas
- Texto legível sem zoom
- Grid adapta corretamente
- Navegação funcional em mobile

### Alinhamento
- Consistência de padding/margin
- Grid alinhado
- Sem elementos "flutuando"

### Hierarquia
- Headings em ordem (h1 > h2 > h3)
- Elementos importantes visualmente proeminentes
- Densidade de informação adequada

## Relatório de problemas

```md
## Relatório de QA Visual

### Problemas críticos
- [ ] [Problema] — Severidade: alta — [Sugestão]

### Problemas médios
- [ ] [Problema] — Severidade: média — [Sugestão]

### Problemas leves
- [ ] [Problema] — Severidade: baixa — [Sugestão]

### Resumo
[Total de problemas por severidade]
```
