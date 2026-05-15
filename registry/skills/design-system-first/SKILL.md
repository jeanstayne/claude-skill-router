# Design System First

## Objetivo

Garantir que todo projeto use design tokens semânticos (CSS custom properties) antes de componentes visuais. Detectar e substituir classes Tailwind hardcoded por tokens. Gerar planos de tokens, variantes shadcn/ui, e checklist de design system.

## Quando usar automaticamente

Use esta skill quando o pedido do usuário envolver:

- Auditar design system.
- Criar tokens de design.
- Substituir classes hardcoded por tokens.
- Gerar variantes shadcn/ui.
- Criar DESIGN.md com tokens.
- Verificar consistência visual.
- Definir paleta de cores como tokens.
- Definir tipografia como tokens.
- Definir shadows, radius, motion como tokens.
- Referências a "design system first", "design tokens", "css custom properties", "variantes de componente".

## Ferramentas disponíveis

- `design_system_enforcer` — Analisa projeto e detecta classes hardcoded, gaps de design system.
- `design_tokens_plan` — Gera plano de tokens semânticos (cores, gradientes, sombras, radius, motion, tipografia).
- `shadcn_variant_plan` — Gera plano de variantes shadcn/ui (Button, Card, Badge, Section, Hero).

## Fluxo obrigatório

1. Chamar `design_system_enforcer` com `projectPath` do projeto.
2. Analisar resultado: `hasDesignSystem`, `confidence`, `gaps`, `hardcodedIssues`.
3. Se `hasDesignSystem === false` ou `confidence < 0.5`:
   - Recomendar geração de tokens via `design_tokens_plan`.
   - Recomendar geração de variantes via `shadcn_variant_plan`.
4. Para cada `hardcodedIssue` com severidade `high`:
   - Sugerir substituição pela recomendação.
   - Priorizar: text-white, text-black, bg-white, bg-black, text-gray-*, bg-gray-*.
5. Apresentar `checklist` com itens de alta prioridade.

## Regra principal

**Design system primeiro, componentes depois. Tokens semânticos antes de variantes visuais.**

## Exemplo

Pedido do usuário:

```
Analise o design system do meu projeto e me diga o que está faltando.
```

Ação esperada:

1. Chamar `design_system_enforcer`.
2. Apresentar gaps e issues.
3. Recomendar próximos passos (tokens, variantes, checklist).
