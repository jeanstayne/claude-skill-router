# Lovable-Style Design Pipeline

## Objetivo

Pipeline de design inspirado no Lovable.dev que gera contexto de marketing de produto, direções visuais, templates de marca, DESIGN.md, plano component-first e checklist de QA visual — tudo local, sem chamadas externas.

## Quando usar

- Criar landing page premium com direção visual definida
- Refatorar LP existente com novo direcionamento visual
- Extrair design system de site existente
- Gerar DESIGN.md para documentar decisões de design
- Planejar componentes antes de implementar
- Auditoria visual de página existente

## Quando não usar

- Para gerar imagens (use image-brief + ferramenta externa)
- Para copywriting (use lp-conversion-architect + generate-copy-variants)
- Para SEO/CRO audit (use cro-seo-plan)
- Para dashboards simples (use dashboard-saas pack)

## Processo

1. Product Marketing Context: detectar marca, audiência, dores, desejos, oferta, tom de voz
2. Visual Directions: gerar 3 direções (Premium Comercial, Editorial Clean, Conversão de Impacto)
3. Brand Template: selecionar template de marca por heurística
4. DESIGN.md: gerar documento de especificação de design (15 seções)
5. Component-First Plan: especificar componentes com props, notas visuais, copy e acessibilidade
6. Visual QA Plan: gerar checklist de QA priorizado por severidade
7. Iteration Report: sumarizar todos os outputs com próximos passos e riscos

## Segurança

- Dry-run é o padrão (nunca escreve arquivos sem confirm)
- DESIGN.md faz backup antes de sobrescrever
- Nenhuma chamada de API externa
- Nenhuma geração de imagem
- Nenhum download de templates
- Templates de marca são JSONs locais no registry

## Formato de saída

```json
{
  "success": true,
  "productMarketingContext": { "brand": "...", "audience": "...", ... },
  "visualDirections": [{ "id": "premium-commercial", "name": "Premium Comercial", ... }, ...],
  "selectedVisualDirection": { ... },
  "designMd": { "path": ".claude/design/DESIGN.md", "wouldCreate": true, ... },
  "selectedBrandTemplate": { "id": "...", "name": "...", ... },
  "componentFirstPlan": { "components": [...], "recommendedFileStructure": [...] },
  "visualQaPlan": { "checks": [...], "recommendedTools": [...] },
  "iterationReport": { "nextSteps": [...], "risks": [...], "warnings": [...] }
}
```

## CLI

```bash
skill-router lovable-pipeline --project ./my-project --request "LP premium para Destaque Agro" --dry-run
skill-router lovable-pipeline --project ./my-project --request "LP do OptoScreen" --confirm
skill-router product-marketing-context --project ./my-project --request "LP da Samar"
skill-router visual-directions --project ./my-project --request "LP SaaS" --style editorial
skill-router brand-template --project ./my-project --request "LP de IA" --brand "NanoAI"
skill-router component-first-plan --project ./my-project --request "dashboard de vendas"
```

## MCP Tools

- `run_lovable_pipeline` — pipeline completa
- `generate_product_marketing_context` — contexto de marketing
- `generate_visual_directions` — 3 direções visuais
- `select_brand_template` — seleção de template
- `generate_design_md` — geração de DESIGN.md
- `generate_component_first_plan` — plano component-first
