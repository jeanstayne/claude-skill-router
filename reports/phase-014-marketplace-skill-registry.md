# Relatório da Fase 14 — Marketplace Skill Registry

## Diagnóstico inicial

### Registry atual
- **Skills locais**: 9 (lp-conversion-architect, brand-visual-director, visual-qa-reviewer, lovable-style-director, stitch-design-director, v0-shadcn-ui-generator, framer-marketing-site-director, relume-site-architect, skill-router-autopilot)
- **Agents**: 5 (ui-designer, frontend-developer, conversion-copywriter, code-reviewer, test-runner)
- **Packs**: 12 (landing-page, lovable-premium-lp, dashboard-saas, v0-dashboard-ui, institutional-site, visual-reference-to-code, relume-website-planning, stitch-visual-system, framer-marketing-site, autopilot-workflow, etc.)
- **Design Engines**: 10 (Lovable, Google Stitch, v0, Framer, Relume, Figma, Webflow, Magic Patterns, Builder Visual Copilot, Uizard)

### Router atual
- **Intents**: 12 (create-landing-page, improve-landing-page, create-dashboard, improve-dashboard, create-institutional-site, plan-website-structure, convert-visual-reference-to-code, review-visual-quality, improve-copy, create-design-system, prepare-project, unknown)
- **routeRequest**: Scan → Signals → Intent → Pack → Recommend → Plan → Apply (dry-run primeiro)
- **MCP tools**: 10

### Lacunas para imagens
- Nenhuma skill para geração de briefs de imagem
- Nenhuma skill para prompts de hero visual/banner
- Nenhum registro de `gpt-image-2`, `ai-image-generation`, `canvas-design`

### Lacunas para copy/headlines
- Intent `improve-copy` existe mas mapeia para pack genérico `landing-page`
- Sem skills de copywriting, marketing psychology, ou page-cro
- Sem geração de variantes de headline/CTA

### Lacunas para marketing/CRO/SEO
- Nenhuma skill de SEO (seo-audit, schema-markup, programmatic-seo)
- Nenhuma skill de CRO (page-cro, form-cro, popup-cro)
- Nenhuma skill de campanha (ad-creative, paid-ads, social-content, email-sequence, launch-strategy)

### Lacunas para design system extraction
- Nenhuma skill de extração de design system de referências
- Nenhuma skill de tailwind-design-system

### Riscos de skills externas
1. Skills de imagem (`gpt-image-2`, `ai-image-generation`) exigem CLI externo e API keys
2. `canvas-design` pode gerar código que precisa de revisão
3. Skills de marketing podem sugerir copy enganosa se mal aplicadas
4. `audit-website` pode fazer chamadas de rede para auditar sites
5. Skills de SEO devem respeitar diretrizes do Google (white-hat apenas)
6. Risco de instalação automática sem revisão humana

---

## Arquivos criados

### External Skill Registry (34 JSONs)
- `registry/external-skills/` — 34 arquivos JSON (um para cada skill externa)

### Schemas (1 arquivo)
- `packages/core/src/schemas/externalSkillSchema.ts` — ExternalSkill, ImageBrief, CopyVariants, MarketingPlan, CROSEOPlan schemas

### Registry Loaders (3 arquivos)
- `packages/core/src/registry/loadExternalSkills.ts` — Carrega skills do registry externo
- `packages/core/src/registry/validateExternalSkills.ts` — Valida skills externas
- `packages/core/src/registry/recommendExternalSkills.ts` — Recomenda skills externas por intent

### Packs (7 arquivos)
- `registry/packs/premium-lp-marketing-stack.json`
- `registry/packs/visual-asset-generation-stack.json`
- `registry/packs/marketing-copy-optimization-stack.json`
- `registry/packs/seo-cro-growth-stack.json`
- `registry/packs/paid-campaign-stack.json`
- `registry/packs/design-system-extraction-stack.json`
- `registry/packs/social-launch-stack.json`

### Adapters (10 arquivos)
- `registry/skills/marketplace-copy-director/SKILL.md` + `metadata.json`
- `registry/skills/marketplace-visual-asset-director/SKILL.md` + `metadata.json`
- `registry/skills/marketplace-cro-seo-auditor/SKILL.md` + `metadata.json`
- `registry/skills/marketplace-campaign-director/SKILL.md` + `metadata.json`
- `registry/skills/marketplace-design-system-extractor/SKILL.md` + `metadata.json`

### MCP Tools (6 arquivos)
- `packages/mcp-server/src/tools/recommendExternalSkillsTool.ts`
- `packages/mcp-server/src/tools/listExternalSkillsTool.ts`
- `packages/mcp-server/src/tools/generateImageBriefTool.ts`
- `packages/mcp-server/src/tools/generateCopyVariantsTool.ts`
- `packages/mcp-server/src/tools/generateMarketingPlanTool.ts`
- `packages/mcp-server/src/tools/generateCROSEOPlanTool.ts`

### Script
- `scripts/create-external-skills.mjs` — Script de criação em lote dos JSONs

## Arquivos alterados

- `packages/core/src/schemas/index.ts` — Adicionados exports dos novos schemas
- `packages/core/src/schemas/requestRouterSchema.ts` — IntentSchema com 21 novas intents + ExternalSkillRecommendationResult
- `packages/core/src/registry/index.ts` — Adicionados exports dos novos loaders
- `packages/core/src/router/classifyIntent.ts` — 17 novos patterns de intent
- `packages/core/src/router/selectPackForIntent.ts` — 21 novos mapeamentos intent→pack
- `packages/core/src/router/routeRequest.ts` — Integração com recommendExternalSkills
- `packages/mcp-server/src/index.ts` — 16 tools (eram 10) + novos imports
- `packages/mcp-server/src/tools/index.ts` — Exports das 6 novas tools
- `registry/skills/skill-router-autopilot/SKILL.md` — Novos triggers de marketing/imagem/CRO/SEO
- `policyguard/policies/project-policies.md` — 10 novas regras (28 total)

## External Skill Registry

| Categoria | Skills | Total |
|---|---|---|
| Design/UI/Visual | frontend-design, canvas-design, theme-factory, web-design-guidelines, ui-ux-pro-max, high-end-visual-design, design-taste-frontend, redesign-existing-projects, stitch-design-taste, extract-design-system, tailwind-design-system | 11 |
| Stitch/Design Gen | enhance-prompt, stitch-loop | 2 |
| Image/Visual Asset | ai-image-generation, gpt-image-2 | 2 |
| Copy/Marketing/CRO | product-marketing-context, copywriting, page-cro, marketing-psychology, form-cro, popup-cro, pricing-strategy | 7 |
| SEO/Content/Growth | seo-audit, schema-markup, content-strategy, programmatic-seo, competitor-alternatives, marketing-ideas, launch-strategy | 7 |
| Ads | ad-creative, paid-ads | 2 |
| Social/Email | social-content, email-sequence | 2 |
| Audit | audit-website | 1 |
| **TOTAL** | | **34** |

## Novas Intents (21)

| Intent | Pack |
|---|---|
| generate-site-images | visual-asset-generation-stack |
| create-hero-visual | visual-asset-generation-stack |
| create-image-prompts | visual-asset-generation-stack |
| improve-headlines | marketing-copy-optimization-stack |
| improve-marketing-copy | marketing-copy-optimization-stack |
| audit-page-cro | seo-cro-growth-stack |
| optimize-form-cro | seo-cro-growth-stack |
| optimize-popup-cro | seo-cro-growth-stack |
| optimize-seo | seo-cro-growth-stack |
| add-schema-markup | seo-cro-growth-stack |
| create-content-strategy | seo-cro-growth-stack |
| create-programmatic-seo-pages | seo-cro-growth-stack |
| create-ad-creative | paid-campaign-stack |
| create-paid-ads | paid-campaign-stack |
| create-social-content | social-launch-stack |
| create-email-sequence | social-launch-stack |
| create-launch-strategy | social-launch-stack |
| create-product-marketing-context | marketing-copy-optimization-stack |
| extract-design-system | design-system-extraction-stack |
| audit-website | seo-cro-growth-stack |

## MCP Tools (16 total, 6 novas)

- `recommend_external_skills` — Recomenda skills externas para uma intent
- `list_external_skills` — Lista skills externas com filtros
- `generate_image_brief` — Gera brief/prompt de imagem (nunca gera imagem)
- `generate_copy_variants` — Gera variantes de headline/CTA/copy
- `generate_marketing_plan` — Gera plano de campanha/lançamento
- `generate_cro_seo_audit_plan` — Gera checklist de auditoria CRO/SEO

## Policy Guard (28 regras, +10)

Novas regras Phase 14:
- external-skills-never-auto-install (high)
- external-skills-never-auto-execute (high)
- image-generation-requires-confirm (high)
- high-risk-external-skills-require-warning (high)
- external-skill-registry-schema-required (medium)
- external-skills-risk-level-required (medium)
- marketplace-adapters-must-not-clone-full-external-content (medium)
- autopilot-must-route-image-copy-marketing-intents (medium)
- external-skills-cli-json-valid (low)

## Pendências

*Nenhuma — todas as fases concluídas.*

## Validação final

```
npm run validate
  typecheck: ✅ (core, cli, mcp-server, vscode-extension)
  lint:      ✅ (0 errors, 2 pre-existing warnings)
  test:      ✅ (239 tests: 170 core + 11 cli + 58 mcp-server)
  build:     ✅ (core, cli, mcp-server, vscode-extension)
  policy:    ✅ (0 high, 0 medium, 0 low)
```

### Resumo de arquivos Phase 14.10-14.16

**Phase 14.10 — CLI (6 new files)**
- `packages/cli/src/commands/externalSkillsList.ts`
- `packages/cli/src/commands/externalSkillsRecommend.ts`
- `packages/cli/src/commands/generateImageBrief.ts`
- `packages/cli/src/commands/generateCopyVariants.ts`
- `packages/cli/src/commands/generateMarketingPlan.ts`
- `packages/cli/src/commands/generateCROSEOPlan.ts`

**Phase 14.11 — VS Code Extension (5 new commands)**
- Comandos: listExternalSkills, recommendExternalSkills, generateImageBrief, generateCopyVariants, generateCROSEOPlan
- Atualizados: `package.json`, `extension.ts`

**Phase 14.14 — Tests (3 new files, 79 tests)**
- `packages/core/tests/external-skills.test.ts` — 33 tests
- `packages/core/tests/marketplace-router.test.ts` — 26 tests
- `packages/mcp-server/tests/external-skill-tools.test.ts` — 20 tests

**Phase 14.15 — Runtime Check (+7 checks)**
- `packages/mcp-server/scripts/runtime-check.ts` — items 13-19 added

**Phase 14.16 — Documentation (5 files)**
- `docs/external-skills-registry.md`
- `docs/image-generation-workflow.md`
- `docs/marketing-copy-workflow.md`
- `docs/seo-cro-workflow.md`
- `docs/campaign-workflow.md`

**ClassifyIntent fixes**
- `packages/core/src/router/classifyIntent.ts` — +4 novos patterns (optimize-popup-cro, create-content-strategy, create-programmatic-seo-pages, create-paid-ads), correções de regex para pt-BR (gere, otimize), priorities ajustadas

## Status final
**Completo** — Phase 14 implementada com 239 testes passando, 0 erros de lint, build limpo, policy guard aprovado.
