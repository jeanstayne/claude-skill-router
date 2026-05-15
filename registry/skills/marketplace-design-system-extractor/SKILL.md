# Marketplace Design System Extractor

## Objetivo

Extrair design tokens e criar design system a partir de referências visuais, sites ou descrições de marca.

## Skills externas de referência

- `extract-design-system` — Extração de tokens de design
- `tailwind-design-system` — Config Tailwind e tokens
- `frontend-design` — Design system frontend
- `theme-factory` — Tema completo
- `stitch-design-taste` — Direção de design taste

## Processo

1. Analisar a referência visual (URL, descrição, ou imagem)
2. Extrair paleta de cores (primary, secondary, accent, bg, text)
3. Extrair tipografia (headings, body, font sizes, weights)
4. Extrair espaçamento (padding, margin, gap padrões)
5. Extrair border radius e sombras
6. Extrair estilo de botões (primary, secondary, ghost)
7. Extrair estilo de cards
8. Extrair grid e layout
9. Gerar DESIGN.md com todos os tokens
10. Gerar configuração Tailwind correspondente

## Regras importantes

- NUNCA copiar assets (imagens, logos, ícones) da referência
- NUNCA copiar conteúdo textual
- Extrair apenas conceitos visuais e tokens abstratos
- O resultado deve ser um sistema original, não uma cópia
- Respeitar propriedade intelectual da referência

## O que evitar

- Cópia pixel-perfect
- Extração de assets proprietários
- Violação de direitos autorais
- Tokens idênticos à referência (inspiração ≠ cópia)

## Formato de saída

```md
## DESIGN.md

### Design Tokens

#### Colors
- Primary: `#XXXXXX` → `hsl(x, y%, z%)`
- Secondary: `#XXXXXX`
- Accent: `#XXXXXX`
- Background: `#XXXXXX`
- Text: `#XXXXXX`

#### Typography
- Headings: [font] — weights: [list] — sizes: [list]
- Body: [font] — sizes: [list]

#### Spacing
- Section padding: [value]
- Card padding: [value]
- Gap: [value]

#### Border Radius
- Sm: [value]
- Md: [value]
- Lg: [value]

#### Shadows
- Card: [value]
- Elevated: [value]

### Tailwind Config
\`\`\`js
// tailwind.config.ts
\`\`\`
```
