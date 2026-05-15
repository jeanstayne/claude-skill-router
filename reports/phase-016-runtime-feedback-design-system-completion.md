# Phase 16 — Runtime Feedback, Design System First e Preview QA Loop

## Status: COMPLETO ✅

## Resumo

A Fase 16 expandiu o claude-skill-router com 5 novos módulos, totalizando **55 novos arquivos**:

- **Design System Enforcer** (6 arquivos): Análise de design system, detecção de classes hardcoded, geração de tokens, variantes shadcn/ui e checklist
- **SEO by Default** (5 arquivos): Plano de SEO, meta tags, JSON-LD, checklist de HTML semântico
- **Sandbox Template Registry** (7 arquivos): 5 templates JSON + 2 loaders
- **Runtime Feedback** (5 arquivos): Parse de console/network, classificação de issues, plano de correção
- **Preview QA Loop** (5 arquivos): Checklist visual, matriz de viewports, detecção de regressões, plano de iteração

## Validação

```
typecheck: ✅
lint: ✅ (0 errors, 2 pre-existing warnings)
test: ✅ 394 passed, 0 failed
build: ✅
policy: ✅ (0 high, 0 medium, 0 low)
```

## Módulos criados

### 16.2 — Design System Enforcer (6 arquivos)

| Arquivo | Descrição |
|---|---|
| `packages/core/src/design-system-enforcer/analyzeDesignSystem.ts` | Analisa projeto: Tailwind config, CSS variables, component variants, DESIGN.md. Confidence score 0-1. |
| `packages/core/src/design-system-enforcer/detectHardcodedVisualClasses.ts` | Detecta classes Tailwind hardcoded (9 patterns: text-white, bg-white, text-gray-*, etc.) com severidade e recomendação. |
| `packages/core/src/design-system-enforcer/generateDesignTokensPlan.ts` | Gera 6 grupos de tokens: colors, gradients, shadows, radius, motion, typography. Baseado no BrandTemplate. |
| `packages/core/src/design-system-enforcer/generateShadcnVariantPlan.ts` | Gera variantes shadcn/ui: Button (5), Card (4), Badge (3), Section (4), Hero (3). |
| `packages/core/src/design-system-enforcer/generateDesignSystemFirstChecklist.ts` | 15 itens em 4 categorias: tokens, components, consistency, a11y. |
| `packages/core/src/design-system-enforcer/runDesignSystemEnforcer.ts` | Orquestrador: analysis → issues → tokens → variants → checklist → summary. |

### 16.3 — SEO by Default (5 arquivos)

| Arquivo | Descrição |
|---|---|
| `packages/core/src/seo-by-default/generateSeoPlan.ts` | Gera title (max 60), meta description (max 160), OG tags, Twitter cards. |
| `packages/core/src/seo-by-default/generateMetadataPlan.ts` | Canonical, robots, viewport, charset, hreflang, favicon, theme-color. |
| `packages/core/src/seo-by-default/generateJsonLdPlan.ts` | 6 tipos: Organization, LocalBusiness, Product, FAQPage, SoftwareApplication, Article. |
| `packages/core/src/seo-by-default/generateSemanticHtmlChecklist.ts` | 15 itens em 7 categorias: structure, headings, images, links, forms, aria, performance. |
| `packages/core/src/seo-by-default/runSeoByDefault.ts` | Orquestrador com ProductMarketingContext. Detecta meta tags ausentes no index.html. |

### 16.4 — Sandbox Template Registry (7 arquivos)

| Arquivo | Descrição |
|---|---|
| `registry/sandbox-templates/nextjs-tailwind-shadcn.json` | Next.js + Tailwind + shadcn/ui (port 3000) |
| `registry/sandbox-templates/vite-react-tailwind.json` | Vite + React + Tailwind (port 5173) |
| `registry/sandbox-templates/nextjs-app-router.json` | Next.js App Router minimal (port 3000) |
| `registry/sandbox-templates/astro-landing.json` | Astro + Tailwind para landing pages (port 4321) |
| `registry/sandbox-templates/nextjs-api.json` | Next.js + Prisma + PostgreSQL (port 3000) |
| `packages/core/src/sandbox-template-registry/loadSandboxTemplates.ts` | Carrega templates do registry com cache. |
| `packages/core/src/sandbox-template-registry/recommendSandboxTemplate.ts` | Recomenda template por score: projectType (3pts), framework (3pts), language (2pts), UI (2pts), API (2pts), DB (3pts). |

### 16.5 — Runtime Feedback (5 arquivos)

| Arquivo | Descrição |
|---|---|
| `packages/core/src/runtime-feedback/parseConsoleLogs.ts` | Parse Chrome-style console lines (ERROR/WARN/INFO/LOG/DEBUG [source:line:col] message). |
| `packages/core/src/runtime-feedback/parseNetworkRequests.ts` | Classifica requests: failed (status >= 400), slow (>3000ms), ok. Total size/duration. |
| `packages/core/src/runtime-feedback/classifyRuntimeIssues.ts` | 10 categorias via regex: js-error, hydration-error, a11y-violation, network-error, image-error, font-error, perf-warning, seo-warning, deprecation, unknown. |
| `packages/core/src/runtime-feedback/generateFixPlan.ts` | Plano de correção com ações específicas por categoria. Prioridade ordenada. |
| `packages/core/src/runtime-feedback/runRuntimeFeedback.ts` | Orquestrador: parse → classify → fix plan → summary. |

### 16.6 — Preview QA Loop (5 arquivos)

| Arquivo | Descrição |
|---|---|
| `packages/core/src/preview-qa-loop/generatePreviewChecklist.ts` | 20 itens em 6 categorias: layout, visual, content, interaction, responsive, performance. |
| `packages/core/src/preview-qa-loop/responsiveViewportMatrix.ts` | 6 viewports: iPhone 14 Pro (390x844), iPhone 14 Pro Max (430x932), iPad Air (768x1024), iPad Pro (1024x1366), Laptop (1440x900), Full HD (1920x1080). 3 prioritários. |
| `packages/core/src/preview-qa-loop/detectVisualRegressions.ts` | Detecta regressões de checks falhos por viewport. Agrupa por severidade. |
| `packages/core/src/preview-qa-loop/generateIterationPlan.ts` | Ordena regressões (high → medium → low). Sugere fixes específicos por checkId. |
| `packages/core/src/preview-qa-loop/runPreviewQaLoop.ts` | Orquestrador: checklist → matrix → results → regressions → iteration plan. |

## Atualizações

### 16.7 — Lovable Pipeline + Schema
- Schema: 5 novos tipos (DesignSystemEnforcerResult, SeoByDefaultResult, RuntimeFeedbackResult, PreviewQaLoopResult, SandboxTemplateRecommendation)
- Pipeline: Steps 9-13 adicionados (Design System Enforcer, SEO, Sandbox, Preview QA, Runtime Feedback)

### 16.8 — MCP Tools (8 novas)
- `design_system_enforcer`, `seo_by_default`, `sandbox_template_recommend`, `sandbox_template_load`
- `runtime_feedback_analyze`, `preview_qa_loop`, `design_tokens_plan`, `shadcn_variant_plan`
- Total: 30 tools (22 Phase 15 + 8 Phase 16)

### 16.9 — CLI Commands (6 novos)
- `design-system`, `seo`, `sandbox-template`, `runtime-feedback`, `preview-qa`, `design-tokens`
- Total: 26 comandos (20 Phase 15 + 6 Phase 16)

### 16.10 — VS Code Extension
- 8 novos stubs: designSystemEnforcer, seoByDefault, sandboxTemplate, runtimeFeedback, previewQaLoop, designTokensPlan, shadcnVariantPlan

### 16.11 — Autopilot
- SKILL.md atualizado com triggers Phase 16 (Design System First, SEO, Runtime Feedback, Preview QA, Sandbox)

### 16.12 — Skill + Pack
- Nova skill: `design-system-first` (com SKILL.md + metadata.json)
- Novo pack: `design-system-first` (design system + SEO + preview QA)

### 16.13 — Policy Guard
- 9 novas regras: design-system-enforcer-no-external-api, seo-by-default-meta-tags-required, design-system-tokens-before-components, seo-jsonld-organization-required, sandbox-template-local-only, runtime-feedback-no-browser-auto, preview-qa-viewport-matrix-required, preview-qa-high-priority-first, phase-16-modules-tested
- Total: 46 regras (37 + 9)

### 16.14 — Testes
- 7 novos arquivos de teste: design-system-enforcer (17 tests), seo-by-default (19), sandbox-template-registry (8), runtime-feedback (13), preview-qa-loop (15), phase16-tools (9), phase16-cli (6)
- Total: 87 novos testes

## Arquivos criados/modificados

```
Novos: 55 arquivos

packages/core/src/design-system-enforcer/    6 arquivos
packages/core/src/seo-by-default/            5 arquivos
packages/core/src/sandbox-template-registry/ 2 arquivos
packages/core/src/runtime-feedback/          5 arquivos
packages/core/src/preview-qa-loop/           5 arquivos
registry/sandbox-templates/                  5 JSON templates
registry/skills/design-system-first/         2 arquivos (SKILL.md + metadata.json)
registry/packs/                               1 arquivo (design-system-first.json)
packages/mcp-server/src/tools/               8 tools
packages/cli/src/commands/                   6 comandos
packages/core/tests/                         5 testes
packages/mcp-server/tests/                   1 teste
packages/cli/tests/                          1 teste

Modificados: 8 arquivos

packages/core/src/schemas/lovablePipelineSchema.ts
packages/core/src/lovable-pipeline/runLovableStylePipeline.ts
packages/mcp-server/src/index.ts
packages/cli/src/index.ts
packages/vscode-extension/src/extension.ts
registry/skills/skill-router-autopilot/SKILL.md
policyguard/policies/project-policies.md
packages/core/src/runtime-feedback/parseConsoleLogs.ts (bug fix)
```

## Métricas finais

| Métrica | Antes (Phase 15) | Depois (Phase 16) |
|---|---|---|
| Testes | 307 | 394 (+87) |
| MCP Tools | 22 | 30 (+8) |
| CLI Commands | 20 | 26 (+6) |
| Policy Rules | 37 | 46 (+9) |
| Skills | 15 | 16 (+1) |
| Packs | 19 | 20 (+1) |
| VS Code Commands | 17 | 25 (+8) |
| Sandbox Templates | 0 | 5 (+5) |
