# Relatório da Fase 15 — Lovable-Style Design Pipeline

## Diagnóstico inicial

### Router atual (pós-Fase 14)
- **Intents**: 33 valores no IntentSchema (12 originais + 21 marketplace)
- **classifyIntent**: 27 blocos de patterns com regex + fallback por signals
- **selectPackForIntent**: 33 mapeamentos intent→pack
- **routeRequest**: Scan → Signals → Intent → Pack → Recommend → ExternalSkills → Plan
- **MCP tools**: 16 (10 base + 6 marketplace)

### Autopilot atual
- `skill-router-autopilot/SKILL.md` com triggers para LP, site, dashboard, UI + 17 triggers Phase 14 (imagem, copy, marketing, SEO, CRO, ads, social)
- Fluxo: route_request → dry-run → preview → confirmação → apply
- **Lacuna**: Autopilot não tem trigger para pipeline de design. Não menciona DESIGN.md, visual directions ou component-first plan.

### Marketplace Skill Registry atual
- 34 skills externas registradas
- 7 categorias: design, image, marketing, seo, social, ads, audit
- 5 marketplace adapters (marketplace-*-director)
- 6 MCP tools de marketplace

### Design Engines atuais
- 10 engines registradas como JSON: Lovable, Google Stitch, v0, Framer, Relume, Figma, Webflow, Magic Patterns, Builder Visual Copilot, Uizard
- Nenhuma engine executada automaticamente
- **Lacuna**: Nenhuma engine tem pipeline local equivalente. Lovable é apenas referência abstrata.

### Skills locais atuais
- 14 skills (9 originais + 5 marketplace adapters)
- `lovable-style-director` existe mas é apenas um adapter de direção visual — não um pipeline completo
- **Lacuna**: Nenhuma skill de pipeline de design (product marketing → visual directions → DESIGN.md → component plan → QA)

### Packs atuais
- 19 packs (12 originais + 7 marketplace)
- `lovable-premium-lp` existe mas não inclui pipeline de design
- **Lacuna**: Nenhum pack de pipeline de design (brand template → DESIGN.md → component-first)

### Lacunas para pipeline estilo Lovable

1. **Product Marketing Context**: Inexistente. Nenhum módulo gera contexto de produto/marca/audiência/dores/desejos/oferta.

2. **Visual Directions**: Inexistente. O `lovable-style-director` é um adapter de skill externa, não gera direções visuais locais.

3. **Brand Templates**: Inexistente. Nenhum registry de templates de marca por segmento.

4. **DESIGN.md**: Inexistente. Nenhum gerador de DESIGN.md com seções obrigatórias.

5. **Component-First Plan**: Inexistente. Nenhum planejador de componentização.

6. **Visual QA Plan**: Inexistente. O `visual-qa-reviewer` revisa mas não gera plano estruturado de QA.

7. **Iteration Report**: Inexistente. Nenhum sumário completo de iteração com todos os outputs do pipeline.

8. **Pipeline Orchestrator**: Inexistente. Nenhum orquestrador que encadeia todas as etapas.

### Riscos de segurança

1. DESIGN.md sobrescrever arquivo existente sem backup
2. Pipeline executar automaticamente sem dry-run
3. Templates de marca baixados de fonte externa
4. Geração de imagem ou chamada de API externa disfarçada
5. DESIGN.md escrito fora do workspace do projeto
6. Pipeline pular validação de schema Zod

---

## Arquivos criados

### Schemas (1 arquivo)
- `packages/core/src/schemas/lovablePipelineSchema.ts` — 13 Zod schemas (160 linhas): ProductMarketingContext, VisualDirection, BrandTemplate, DesignMd, DesignMdSection, ComponentSpec, ComponentFirstPlan, VisualQaCheck, VisualQaPlan, IterationReport, LovableStylePipelineInput, LovableStylePipelineResult

### Pipeline Modules (8 arquivos)
- `packages/core/src/lovable-pipeline/createProductMarketingContext.ts` (171 linhas) — Detecção de 9 marcas conhecidas (Samar, Ativaagro, OptoScreen, Destaque Agro, Destaque System, NanoAI, Ellegance, JK Perfumes, ELIZÊ) com heurística de fallback
- `packages/core/src/lovable-pipeline/generateVisualDirections.ts` (87 linhas) — 3 direções visuais: Premium Comercial, Editorial Clean, Conversão de Impacto com 11 campos cada
- `packages/core/src/lovable-pipeline/selectBrandTemplate.ts` (138 linhas) — Seleção em 5 níveis: brand match → request match → project type → keyword → fallback
- `packages/core/src/lovable-pipeline/generateDesignMd.ts` (178 linhas) — Geração de DESIGN.md com 15 seções, backup automático, dry-run/confirm gate
- `packages/core/src/lovable-pipeline/generateComponentFirstPlan.ts` (183 linhas) — 3 tipos de plano: LP (7 componentes), Dashboard (5), Institucional (5). Cada componente com props, visual notes, copy notes, acessibilidade
- `packages/core/src/lovable-pipeline/generateVisualQaPlan.ts` (172 linhas) — 12 checks base + checks específicos por direção visual + checks por template + checks por componente
- `packages/core/src/lovable-pipeline/generateIterationReport.ts` (101 linhas) — Sumário com todos os outputs, próximos passos, riscos e warnings
- `packages/core/src/lovable-pipeline/runLovableStylePipeline.ts` (119 linhas) — Orquestrador que encadeia todas as 8 etapas com validação Zod do input
- `packages/core/src/lovable-pipeline/index.ts` — Barrel exports

### Brand Templates (9 JSONs)
- `registry/brand-templates/automotive-premium.json`
- `registry/brand-templates/agro-institutional.json`
- `registry/brand-templates/tech-product-lp.json`
- `registry/brand-templates/hr-consulting-saas.json`
- `registry/brand-templates/ai-consulting.json`
- `registry/brand-templates/health-beauty-premium.json`
- `registry/brand-templates/perfume-luxury.json`
- `registry/brand-templates/fashion-lifestyle.json`
- `registry/brand-templates/b2b-saas.json`

### MCP Tools (6 arquivos)
- `packages/mcp-server/src/tools/runLovablePipelineTool.ts`
- `packages/mcp-server/src/tools/generateProductMarketingContextTool.ts`
- `packages/mcp-server/src/tools/generateVisualDirectionsTool.ts`
- `packages/mcp-server/src/tools/selectBrandTemplateTool.ts`
- `packages/mcp-server/src/tools/generateDesignMdTool.ts`
- `packages/mcp-server/src/tools/generateComponentFirstPlanTool.ts`

### CLI Commands (5 arquivos)
- `packages/cli/src/commands/lovablePipeline.ts`
- `packages/cli/src/commands/productMarketingContext.ts`
- `packages/cli/src/commands/visualDirections.ts`
- `packages/cli/src/commands/brandTemplate.ts`
- `packages/cli/src/commands/componentFirstPlan.ts`

### Skill + Pack (3 arquivos)
- `registry/skills/lovable-style-pipeline/SKILL.md` — Documentação completa da skill
- `registry/skills/lovable-style-pipeline/metadata.json` — Metadata da skill
- `registry/packs/lovable-style-design-pipeline.json` — Pack com 4 skills + 3 agents

### Tests (2 arquivos, 68 testes)
- `packages/core/tests/lovable-pipeline.test.ts` — 55 testes: createProductMarketingContext (10), generateVisualDirections (8), selectBrandTemplate (10), generateDesignMd (3), generateComponentFirstPlan (6), generateVisualQaPlan (9), generateIterationReport (4), runLovableStylePipeline (5)
- `packages/mcp-server/tests/lovable-pipeline-tools.test.ts` — 13 testes: runLovablePipelineTool (3), generateProductMarketingContextTool (2), generateVisualDirectionsTool (2), selectBrandTemplateTool (2), generateDesignMdTool (2), generateComponentFirstPlanTool (2)

## Arquivos alterados

- `packages/core/src/schemas/index.ts` — Adicionados exports dos schemas do pipeline (bloco Phase 15)
- `packages/core/src/index.ts` — Adicionado `export * from './lovable-pipeline/index.js'`
- `packages/mcp-server/src/tools/index.ts` — Adicionados exports dos 6 novos tools
- `packages/mcp-server/src/index.ts` — Comentário de header atualizado (22 tools), importados e registrados 6 novos tools
- `packages/cli/src/index.ts` — Adicionados imports, CLI options (stylePreference, projectType, intent), help text, exemplos e switch cases para 5 novos comandos
- `packages/vscode-extension/package.json` — Adicionados 5 activation events + 5 contributes.commands
- `packages/vscode-extension/src/extension.ts` — Adicionados 5 stub commands + header atualizado (Phase 15)
- `registry/skills/skill-router-autopilot/SKILL.md` — Adicionados triggers Phase 15 (direção visual, DESIGN.md, brand template, component-first plan, QA visual, pipeline completa)
- `policyguard/policies/project-policies.md` — Adicionadas 10 novas regras (38 total)

## MCP Tools (22 total, 6 novas)

- `run_lovable_pipeline` — Pipeline completa com todas as etapas
- `generate_product_marketing_context` — Gera Product Marketing Context
- `generate_visual_directions` — Gera 3 direções visuais
- `select_brand_template` — Seleciona template de marca
- `generate_design_md` — Gera DESIGN.md (dry-run por padrão)
- `generate_component_first_plan` — Gera Component-First UI Plan

## CLI Commands (20 total, 5 novas)

```bash
skill-router lovable-pipeline --project ./my-project --request "LP premium para Destaque Agro" --dry-run
skill-router lovable-pipeline --project ./my-project --request "LP do OptoScreen" --confirm
skill-router product-marketing-context --project ./my-project --request "LP da Samar Veículos"
skill-router visual-directions --project ./my-project --request "LP SaaS" --style editorial
skill-router brand-template --project ./my-project --request "LP de IA" --brand "NanoAI"
skill-router component-first-plan --project ./my-project --request "dashboard de vendas"
```

## Policy Guard (38 regras, +10)

Novas regras Phase 15:
- lovable-pipeline-design-md-backup-before-write (high)
- lovable-pipeline-dry-run-is-default (high)
- lovable-pipeline-no-external-api (high)
- lovable-pipeline-brand-template-local-only (medium)
- lovable-pipeline-design-md-confirm-required (medium)
- lovable-pipeline-visual-qa-before-delivery (medium)
- lovable-pipeline-component-plan-before-implementation (medium)
- lovable-pipeline-outputs-must-pass-zod (medium)
- lovable-pipeline-never-auto-execute-without-route-request (low)

## Pipeline Flow

```
User Request → classifyIntent
  → createProductMarketingContext (brand, audience, pains, desires, offer, tone)
  → generateVisualDirections (3 variants: Premium, Editorial, Impact)
  → selectBrandTemplate (5-tier algorithm from registry/brand-templates/)
  → generateDesignMd (15-section markdown to .claude/design/DESIGN.md)
  → generateComponentFirstPlan (component specs with props, visual, copy, a11y notes)
  → generateVisualQaPlan (base + direction-specific + template-specific + component checks)
  → generateIterationReport (summary with next steps, risks, warnings)
  → LovableStylePipelineResult
```

## Brand Templates Registry

| Template | Segmentos | Marcas |
|---|---|---|
| automotive-premium | Automotivo | Samar Veículos |
| agro-institutional | Agronegócio | Ativaagro, Destaque Agro |
| tech-product-lp | Tecnologia/SaaS | OptoScreen, startups |
| hr-consulting-saas | RH/Recrutamento | Destaque System |
| ai-consulting | IA/Consultoria | NanoAI |
| health-beauty-premium | Beleza/Saúde | Ellegance |
| perfume-luxury | Perfumaria/Luxo | JK Perfumes |
| fashion-lifestyle | Moda/Lifestyle | ELIZÊ |
| b2b-saas | SaaS B2B | Empresas SaaS |

## Visual Directions

| Direção | ID | Melhor Para |
|---|---|---|
| Premium Comercial | premium-commercial | LPs de conversão, sites institucionais premium, marcas de confiança |
| Editorial Clean | editorial-clean | Sites de marca/portfolio, LPs de produto premium, marcas de luxo |
| Conversão de Impacto | conversao-impacto | LPs de venda direta, páginas de captura, lançamentos |

## Pendências

*Nenhuma — todas as fases concluídas.*

## Validação final

```
npm run validate
  typecheck: ✅ (core, cli, mcp-server, vscode-extension)
  lint:      ✅ (0 errors, 2 pre-existing warnings)
  test:      ✅ (307 tests: 170 core + 11 cli + 58 mcp-server + 68 new)
  build:     ✅ (core, cli, mcp-server, vscode-extension)
  policy:    ✅ (0 high, 0 medium, 0 low)
```

## Status final
**Completo** — Phase 15 implementada com 307 testes passando, 0 erros de lint, build limpo, policy guard aprovado.
