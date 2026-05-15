// Phase 15.12 — Lovable-Style Design Pipeline Orchestrator
// Chains all pipeline steps: Product Marketing Context → Visual Directions → Brand Template → DESIGN.md →
// Component-First Plan → Visual QA Plan → Iteration Report.
// Dry-run by default; requires confirm=true for real writes.

import type {
  LovableStylePipelineInput,
  LovableStylePipelineResult,
  ProductMarketingContext,
  VisualDirection,
  BrandTemplate,
  DesignMd,
  ComponentFirstPlan,
  VisualQaPlan,
  IterationReport,
  DesignSystemEnforcerResult,
  SeoByDefaultResult,
  RuntimeFeedbackResult,
  PreviewQaLoopResult,
  SandboxTemplateRecommendation,
} from '../schemas/lovablePipelineSchema.js';
import { LovableStylePipelineInputSchema } from '../schemas/lovablePipelineSchema.js';
import { createProductMarketingContext } from './createProductMarketingContext.js';
import { generateVisualDirections } from './generateVisualDirections.js';
import { selectBrandTemplate } from './selectBrandTemplate.js';
import { generateDesignMd } from './generateDesignMd.js';
import { generateComponentFirstPlan } from './generateComponentFirstPlan.js';
import { generateVisualQaPlan } from './generateVisualQaPlan.js';
import { generateIterationReport } from './generateIterationReport.js';
import { classifyIntent } from '../router/classifyIntent.js';
import { runDesignSystemEnforcer } from '../design-system-enforcer/runDesignSystemEnforcer.js';
import { runSeoByDefault } from '../seo-by-default/runSeoByDefault.js';
import { runPreviewQaLoop } from '../preview-qa-loop/runPreviewQaLoop.js';
import { recommendSandboxTemplate } from '../sandbox-template-registry/recommendSandboxTemplate.js';

function emptySig() {
  return {
    visualStyle: [] as string[],
    businessGoal: [] as string[],
    keywords: [] as string[],
    mentionsDesignEngine: [] as string[],
    mentionsStack: [] as string[],
    confidence: 0,
  };
}

export async function runLovableStylePipeline(rawInput: unknown): Promise<LovableStylePipelineResult> {
  const input = LovableStylePipelineInputSchema.parse(rawInput) as LovableStylePipelineInput;
  const { projectPath, userRequest, dryRun, confirm, stylePreference } = input;
  const warnings: string[] = [];
  const changes: Array<{ type: string; path: string; action: string }> = [];

  // Step 1: Classify intent
  const { intent } = classifyIntent({ userRequest, signals: emptySig() });

  // Step 2: Product Marketing Context
  const productMarketingContext: ProductMarketingContext = createProductMarketingContext({
    userRequest,
    routeResult: undefined,
    projectScan: undefined,
  });

  // Step 3: Visual Directions
  const { directions: visualDirections, recommended } = generateVisualDirections({
    userRequest,
    productMarketingContext,
    stylePreference,
  });

  const selectedVisualDirection: VisualDirection = recommended;

  // Step 4: Brand Template
  const { template, templateId, warnings: templateWarnings } = await selectBrandTemplate({
    brand: input.brand || productMarketingContext.brand,
    projectType: undefined,
    intent,
    userRequest,
  });

  warnings.push(...templateWarnings);

  const selectedBrandTemplate: BrandTemplate = template || {
    id: templateId,
    name: templateId,
    segments: [],
    bestForBrands: [],
    visualPersonality: ['profissional', 'clean'],
    recommendedPalette: { primary: '#2563eb', accent: '#f59e0b', background: '#ffffff' },
    typography: { headline: 'Inter', body: 'Inter' },
    componentStyle: { buttons: 'rounded-lg', cards: 'shadow-sm', sections: 'py-16' },
    recommendedSections: ['Hero', 'Benefícios', 'Prova Social', 'CTA'],
    avoid: [],
  };

  // Step 5: DESIGN.md
  const designMd: DesignMd = await generateDesignMd({
    projectPath,
    productMarketingContext,
    selectedVisualDirection,
    selectedBrandTemplate,
    dryRun,
    confirm,
  });

  if (designMd.wouldCreate && !dryRun && confirm) {
    changes.push({ type: 'file', path: designMd.path, action: 'created' });
  } else if (designMd.wouldCreate && dryRun) {
    changes.push({ type: 'file', path: designMd.path, action: 'would-create (dry-run)' });
  }

  // Step 6: Component-First Plan
  const componentFirstPlan: ComponentFirstPlan = generateComponentFirstPlan({
    userRequest,
    productMarketingContext,
    selectedVisualDirection,
    selectedBrandTemplate,
  });

  // Step 7: Visual QA Plan
  const visualQaPlan: VisualQaPlan = generateVisualQaPlan({
    selectedVisualDirection,
    selectedBrandTemplate,
    componentFirstPlan,
  });

  // Step 8: Iteration Report
  const iterationReport: IterationReport = generateIterationReport({
    userRequest,
    intent,
    productMarketingContext,
    visualDirections,
    selectedDirection: selectedVisualDirection,
    brandTemplate: selectedBrandTemplate,
    designMd,
    componentFirstPlan,
    visualQaPlan,
  });

  warnings.push(...iterationReport.warnings);

  // Step 9: Design System Enforcer
  let designSystemEnforcer: DesignSystemEnforcerResult | undefined;
  try {
    designSystemEnforcer = await runDesignSystemEnforcer(projectPath, selectedBrandTemplate, selectedVisualDirection);
    warnings.push(...(designSystemEnforcer?.analysis.gaps ?? []).map(g => `Design System: ${g}`));
  } catch {
    warnings.push('Design System Enforcer: falha na análise.');
  }

  // Step 10: SEO by Default
  let seoByDefault: SeoByDefaultResult | undefined;
  try {
    seoByDefault = await runSeoByDefault(projectPath, productMarketingContext);
    warnings.push(...seoByDefault.missingTags.map(t => `SEO: tag ausente — ${t}`));
  } catch {
    warnings.push('SEO by Default: falha na geração.');
  }

  // Step 11: Sandbox Template Recommendation
  let sandboxTemplate: SandboxTemplateRecommendation | undefined;
  try {
    const rec = await recommendSandboxTemplate({
      projectType: undefined,
      framework: 'nextjs',
      language: 'typescript',
      needsUi: true,
    });
    sandboxTemplate = {
      topPickId: rec.topPick?.template.id ?? null,
      recommendedIds: rec.recommendations.map(r => r.template.id),
    };
  } catch {
    warnings.push('Sandbox Template: falha na recomendação.');
  }

  // Step 12: Preview QA Loop
  let previewQaLoop: PreviewQaLoopResult | undefined;
  try {
    const qaResult = await runPreviewQaLoop();
    previewQaLoop = { viewportSummary: qaResult.viewportSummary, summary: qaResult.summary };
  } catch {
    warnings.push('Preview QA Loop: falha na configuração.');
  }

  // Step 13: Runtime Feedback (placeholder — requires real console/network data)
  // Runs only when fed with actual log/network data via MCP tool or CLI
  const runtimeFeedback: RuntimeFeedbackResult = { summary: 'Runtime Feedback aguardando dados de console/network. Use MCP tool runtime_feedback_analyze ou CLI runtime-feedback.' };

  return {
    success: true,
    productMarketingContext,
    visualDirections,
    selectedVisualDirection,
    designMd,
    selectedBrandTemplate,
    componentFirstPlan,
    visualQaPlan,
    iterationReport,
    designSystemEnforcer,
    seoByDefault,
    runtimeFeedback,
    previewQaLoop,
    sandboxTemplate,
    warnings: [...new Set(warnings)],
    dryRun,
    requiresConfirm: dryRun && !confirm,
    changes,
  };
}
