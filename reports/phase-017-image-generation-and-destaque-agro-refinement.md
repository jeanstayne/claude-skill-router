# Relatório da Fase 17 — Image Generation Orchestrator + Refinamento LP Destaque Agro

## Sumário

A Fase 17 implementa o módulo de orquestração de geração de imagem (Image Provider Registry + Core + MCP Tools + CLI) e refina a landing page do Destaque Agro com correções de SEO, copy, formulário, contraste e seção de problemas.

## Módulos criados

### 1. Image Provider Registry
- `registry/image-providers/gpt-image-2.json` — Provider OpenAI/DALL-E
- `registry/image-providers/nano-banana.json` — Provider Google/Gemini

### 2. Core Image Generation (`packages/core/src/image-generation/`)
- `loadImageProviders.ts` — Carrega providers do registry com fallback multi-path (Windows-safe)
- `recommendImageProvider.ts` — Heurística: nano-banana para fotorealista/agro, gpt-image-2 para texto/mockup
- `generateImageBrief.ts` — Brief brand-aware com 14 campos (objective, scene, composition, mustInclude, mustAvoid, etc.)
- `generateImagePrompts.ts` — Gera prompts provider-specific para 5 formatos (16:9, 9:16, 4:3, 1:1)
- `generateProviderCommandPreview.ts` — Command preview com API key mascarada
- `runImageGenerationPlan.ts` — Orquestrador: providers → recommend → brief → prompts → command preview
- `index.ts` — Barrel export

### 3. Schemas (`packages/core/src/schemas/imageGenerationSchema.ts`)
- `ImageProviderSchema` — Zod validation do provider registry
- `ImageBriefSchemaV2` — 14 campos (5 required, 9 opcionais com defaults)
- `ImagePromptSchema` — Prompt com provider, aspectRatio, negativePrompt
- `ImageGenerationInputSchema` — Input com dryRun default true, confirm default false
- `ImageGenerationPlanSchema` — Output do plano (brief + prompts + commandPreview)
- `ImageGenerationResultSchema` — Resultado da geração

### 4. MCP Tools (5 novas)
- `list_image_providers` — Lista providers com capabilities e risk levels
- `recommend_image_provider` — Recomenda melhor provider para request
- `generate_image_brief_v2` — Brief detalhado brand-aware
- `generate_image_prompts` — Prompts provider-specific para todos os formatos
- `plan_image_generation` — Plano completo, bloqueia execução sem confirm

### 5. CLI Commands (5 novos)
- `image-providers` — Lista providers
- `image-provider-recommend` — Recomenda provider
- `image-brief-v2` — Gera brief
- `image-prompts` — Gera prompts
- `image-plan` — Plano completo

### 6. Skill e Pack
- `registry/skills/site-image-generation-orchestrator/SKILL.md` — Definição da skill
- `registry/skills/site-image-generation-orchestrator/metadata.json` — Metadados v1.0.0
- `registry/packs/site-image-generation-stack.json` — Pack com 4 skills, 2 agents

### 7. Autopilot update
- Adicionados triggers Phase 17: imagem hero, background hero, banner, visual da LP, imagem agro, imagem realista, gerar imagem com nano banana, gerar imagem com gpt image 2
- Fluxo image-specific: plan_image_generation → show brief → never auto-execute → confirm → local file

### 8. Policy Guard (10 novas regras)
- `[high] image-generation-never-auto-executes`
- `[high] image-provider-api-keys-never-hardcoded`
- `[high] nano-banana-execution-requires-confirm`
- `[high] gpt-image-2-execution-requires-confirm`
- `[medium] image-provider-registry-schema-required`
- `[medium] lp-destaque-agro-seo-must-not-reference-destaque-system`
- `[medium] lp-destaque-agro-must-use-contrast-safe-sections`
- `[medium] image-brief-required-before-provider-execution`
- `[low] image-cli-json-valid`

### 9. Refinamento LP Destaque Agro
- **SEO:** index.html + useEffect para meta tags dinâmicas (Destaque System → Destaque Agro)
- **Headline:** "Leve sua empresa agro para um novo nível de gestão e resultado"
- **ProblemSection:** Nova seção com 4 cards de dor (Processos, Decisões, Crescimento, Equipe)
- **Formulário:** Removido "Não, obrigado", adicionado "Principal desafio hoje" (Gestão/Processos/Equipe/Crescimento)
- **Backgrounds:** Alternados entre seções (escuro/claro)
- **Depoimentos:** Contraste melhorado (bg-white/[0.07] + border)
- **FAQ:** Headline "Tire suas dúvidas sobre a consultoria"
- **CTA:** "Sua operação merece uma gestão à altura"

### 10. Testes
- `packages/core/tests/image-generation.test.ts` — 12 testes (schemas, validation)
- `packages/mcp-server/tests/phase17-tools.test.ts` — 13 testes (5 tools)
- `packages/cli/tests/phase17-cli.test.ts` — 7 testes (5 commands + schema validation)
- Registro corrigido: `site-image-generation-stack.json` atualizado com maxSkills: 4 e projectTypes

### 11. Runtime Check
- Adicionados checks 20-25: list_image_providers, recommend_image_provider, generate_image_brief_v2, generate_image_prompts, plan_image_generation (dryRun + blocked)
- `loadImageProviders.ts` corrigido com fallback multi-path para Windows
- Resultado: 102/102 passando

## Validação

| Check | Resultado |
|-------|-----------|
| `npx vitest run` | 28 test files, 426 tests, 0 failures |
| `npm run typecheck` | A executar na validação final |
| `npm run lint` | A executar na validação final |
| `npm run build` | A executar na validação final |
| `runtime:check` | 102/102 passando |
| `policy:check` | A executar na validação final |

## Arquivos alterados/criados

**Novos (24 arquivos):**
- `registry/image-providers/gpt-image-2.json`
- `registry/image-providers/nano-banana.json`
- `packages/core/src/schemas/imageGenerationSchema.ts`
- `packages/core/src/image-generation/loadImageProviders.ts`
- `packages/core/src/image-generation/recommendImageProvider.ts`
- `packages/core/src/image-generation/generateImageBrief.ts`
- `packages/core/src/image-generation/generateImagePrompts.ts`
- `packages/core/src/image-generation/generateProviderCommandPreview.ts`
- `packages/core/src/image-generation/runImageGenerationPlan.ts`
- `packages/core/src/image-generation/index.ts`
- `packages/mcp-server/src/tools/listImageProvidersTool.ts`
- `packages/mcp-server/src/tools/recommendImageProviderTool.ts`
- `packages/mcp-server/src/tools/generateImageBriefToolV2.ts`
- `packages/mcp-server/src/tools/generateImagePromptsTool.ts`
- `packages/mcp-server/src/tools/planImageGenerationTool.ts`
- `packages/cli/src/commands/imageProvidersList.ts`
- `packages/cli/src/commands/imageProviderRecommend.ts`
- `packages/cli/src/commands/imageBriefV2.ts`
- `packages/cli/src/commands/imagePrompts.ts`
- `packages/cli/src/commands/imagePlan.ts`
- `registry/skills/site-image-generation-orchestrator/SKILL.md`
- `registry/skills/site-image-generation-orchestrator/metadata.json`
- `registry/packs/site-image-generation-stack.json`
- `.claude/image-briefs/destaque-agro-hero.md`

**Modificados (15+):**
- `packages/core/src/schemas/index.ts`
- `packages/core/src/index.ts`
- `packages/mcp-server/src/tools/index.ts`
- `packages/mcp-server/src/index.ts`
- `packages/cli/src/index.ts`
- `registry/skills/skill-router-autopilot/SKILL.md`
- `registry/external-skills/gpt-image-2.json`
- `registry/external-skills/ai-image-generation.json`
- `policyguard/policies/project-policies.md`
- `packages/mcp-server/scripts/runtime-check.ts`
- `index.html` (Destaque Agro)
- `src/pages/LandingPageDestaqueAgro.tsx` (Destaque Agro)
- `src/components/landing/LeadFormDestaqueAgro.tsx` (Destaque Agro)
- `src/hooks/useSubmitLeadPublico.ts` (Destaque Agro)
- `src/components/landing/ProblemSection.tsx` (Destaque Agro)
- `src/components/landing/BenefitsSection.tsx` (Destaque Agro)
- `src/components/landing/TestimonialsSection.tsx` (Destaque Agro)
- `src/components/landing/FAQSection.tsx` (Destaque Agro)
- `src/components/landing/CTASection.tsx` (Destaque Agro)

**Docs (5 novos):**
- `docs/image-providers.md`
- `docs/gpt-image-2-provider.md`
- `docs/nano-banana-provider.md`
- `docs/site-image-generation-orchestrator.md`
- `docs/destaque-agro-lp-refinement.md`

## Próximo passo

Fase 17.19 — Validação final (typecheck, lint, test, build, policy:check, validate).
