// Lovable-Style Design Pipeline — Zod schemas (Phase 15)
import { z } from 'zod';

// === Product Marketing Context ===
export const ProductMarketingContextSchema = z.object({
  brand: z.string().describe('Brand name detected or provided'),
  productOrService: z.string().describe('What is being offered'),
  audience: z.string().describe('Target audience description'),
  primaryPain: z.string().describe('Main pain point'),
  primaryDesire: z.string().describe('What the audience wants'),
  offer: z.string().describe('Value proposition or offer'),
  differentiators: z.array(z.string()).describe('Key differentiators'),
  objections: z.array(z.string()).describe('Common objections to address'),
  proofAssets: z.array(z.string()).describe('Social proof assets (testimonials, numbers, logos)'),
  toneOfVoice: z.string().describe('Recommended tone of voice'),
  conversionGoal: z.string().describe('Primary conversion goal'),
});
export type ProductMarketingContext = z.infer<typeof ProductMarketingContextSchema>;

// === Visual Direction ===
export const VisualDirectionSchema = z.object({
  id: z.string().describe('Unique direction ID'),
  name: z.string().describe('Direction name'),
  summary: z.string().describe('One-line summary of the visual direction'),
  mood: z.array(z.string()).describe('Mood keywords'),
  colorStrategy: z.string().describe('Color palette strategy'),
  typographyStrategy: z.string().describe('Typography approach'),
  layoutStrategy: z.string().describe('Layout and spacing strategy'),
  imageStyle: z.string().describe('Image and illustration style'),
  motionStyle: z.string().describe('Animation and motion approach'),
  componentStyle: z.string().describe('Component styling approach'),
  bestFor: z.array(z.string()).describe('Best scenarios for this direction'),
  avoid: z.array(z.string()).describe('What to avoid'),
});
export type VisualDirection = z.infer<typeof VisualDirectionSchema>;

// === Brand Template ===
export const BrandTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  segments: z.array(z.string()),
  bestForBrands: z.array(z.string()).default([]),
  visualPersonality: z.array(z.string()),
  recommendedPalette: z.object({
    primary: z.string(),
    accent: z.string(),
    background: z.string(),
  }),
  typography: z.object({
    headline: z.string(),
    body: z.string(),
  }),
  componentStyle: z.object({
    buttons: z.string(),
    cards: z.string(),
    sections: z.string(),
  }),
  recommendedSections: z.array(z.string()),
  avoid: z.array(z.string()),
});
export type BrandTemplate = z.infer<typeof BrandTemplateSchema>;

// === DESIGN.md ===
export const DesignMdSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
});
export type DesignMdSection = z.infer<typeof DesignMdSectionSchema>;

export const DesignMdSchema = z.object({
  path: z.string().describe('Target file path'),
  content: z.string().describe('Full markdown content'),
  wouldCreate: z.boolean().describe('Whether file would be created on disk'),
  sections: z.array(DesignMdSectionSchema).describe('Individual sections'),
});
export type DesignMd = z.infer<typeof DesignMdSchema>;

// === Component-First Plan ===
export const ComponentSpecSchema = z.object({
  name: z.string(),
  purpose: z.string(),
  props: z.array(z.string()),
  visualNotes: z.string().default(''),
  copyNotes: z.string().default(''),
  accessibilityNotes: z.string().default(''),
});
export type ComponentSpec = z.infer<typeof ComponentSpecSchema>;

export const ComponentFirstPlanSchema = z.object({
  components: z.array(ComponentSpecSchema),
  recommendedFileStructure: z.array(z.string()),
  implementationOrder: z.array(z.string()),
});
export type ComponentFirstPlan = z.infer<typeof ComponentFirstPlanSchema>;

// === Visual QA Plan ===
export const VisualQaCheckSchema = z.object({
  id: z.string(),
  severity: z.enum(['high', 'medium', 'low']),
  description: z.string(),
  howToCheck: z.string(),
});
export type VisualQaCheck = z.infer<typeof VisualQaCheckSchema>;

export const VisualQaPlanSchema = z.object({
  checks: z.array(VisualQaCheckSchema),
  recommendedTools: z.array(z.string()).default(['manual-review']),
  manualFallback: z.boolean().default(true),
});
export type VisualQaPlan = z.infer<typeof VisualQaPlanSchema>;

// === Iteration Report ===
export const IterationReportSchema = z.object({
  userRequest: z.string(),
  intent: z.string(),
  productMarketingContext: ProductMarketingContextSchema,
  visualDirections: z.array(VisualDirectionSchema),
  selectedDirection: VisualDirectionSchema,
  brandTemplate: BrandTemplateSchema,
  designMd: DesignMdSchema,
  componentFirstPlan: ComponentFirstPlanSchema,
  visualQaPlan: VisualQaPlanSchema,
  nextSteps: z.array(z.string()),
  risks: z.array(z.string()),
  warnings: z.array(z.string()),
});
export type IterationReport = z.infer<typeof IterationReportSchema>;

// === Pipeline Input ===
export const LovableStylePipelineInputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the target project'),
  userRequest: z.string().min(1).describe('Natural language request from user'),
  brand: z.string().optional().describe('Brand name (auto-detected if omitted)'),
  audience: z.string().optional().describe('Target audience (auto-detected if omitted)'),
  offer: z.string().optional().describe('Value proposition (auto-detected if omitted)'),
  goal: z.string().optional().describe('Conversion goal (auto-detected if omitted)'),
  stylePreference: z.string().optional().describe('Style preference hint (e.g. Lovable, Framer, v0)'),
  dryRun: z.boolean().default(true).describe('Preview mode (default: true)'),
  confirm: z.boolean().default(false).describe('Required for real writes (default: false)'),
});
export type LovableStylePipelineInput = z.infer<typeof LovableStylePipelineInputSchema>;

// === Design System Enforcer (Phase 16.2) ===
export const HardcodedClassIssueSchema = z.object({
  file: z.string(),
  className: z.string(),
  line: z.number().optional(),
  severity: z.enum(['high', 'medium', 'low']),
  recommendation: z.string(),
});
export type HardcodedClassIssue = z.infer<typeof HardcodedClassIssueSchema>;

export const DesignSystemAnalysisSchema = z.object({
  hasDesignSystem: z.boolean(),
  hasCssVariables: z.boolean(),
  hasTailwindConfig: z.boolean(),
  hasComponentVariants: z.boolean(),
  hasDesignTokens: z.boolean(),
  files: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  gaps: z.array(z.string()),
});

export const DesignSystemEnforcerResultSchema = z.object({
  analysis: DesignSystemAnalysisSchema,
  hardcodedIssues: z.array(HardcodedClassIssueSchema),
  summary: z.string(),
});
export type DesignSystemEnforcerResult = z.infer<typeof DesignSystemEnforcerResultSchema>;

// === SEO by Default (Phase 16.3) ===
export const SeoByDefaultResultSchema = z.object({
  summary: z.string(),
  missingTags: z.array(z.string()),
});
export type SeoByDefaultResult = z.infer<typeof SeoByDefaultResultSchema>;

// === Runtime Feedback (Phase 16.5) ===
export const RuntimeFeedbackResultSchema = z.object({
  summary: z.string(),
});
export type RuntimeFeedbackResult = z.infer<typeof RuntimeFeedbackResultSchema>;

// === Preview QA Loop (Phase 16.6) ===
export const PreviewQaLoopResultSchema = z.object({
  viewportSummary: z.string(),
  summary: z.string(),
});
export type PreviewQaLoopResult = z.infer<typeof PreviewQaLoopResultSchema>;

// === Sandbox Template (Phase 16.4) ===
export const SandboxTemplateRecommendationSchema = z.object({
  topPickId: z.string().nullable(),
  recommendedIds: z.array(z.string()),
});
export type SandboxTemplateRecommendation = z.infer<typeof SandboxTemplateRecommendationSchema>;

// === Pipeline Output ===
export const LovableStylePipelineResultSchema = z.object({
  success: z.boolean(),
  productMarketingContext: ProductMarketingContextSchema,
  visualDirections: z.array(VisualDirectionSchema),
  selectedVisualDirection: VisualDirectionSchema,
  designMd: DesignMdSchema,
  selectedBrandTemplate: BrandTemplateSchema,
  componentFirstPlan: ComponentFirstPlanSchema,
  visualQaPlan: VisualQaPlanSchema,
  iterationReport: IterationReportSchema,
  designSystemEnforcer: DesignSystemEnforcerResultSchema.optional(),
  seoByDefault: SeoByDefaultResultSchema.optional(),
  runtimeFeedback: RuntimeFeedbackResultSchema.optional(),
  previewQaLoop: PreviewQaLoopResultSchema.optional(),
  sandboxTemplate: SandboxTemplateRecommendationSchema.optional(),
  warnings: z.array(z.string()),
  dryRun: z.boolean(),
  requiresConfirm: z.boolean(),
  changes: z.array(z.object({ type: z.string(), path: z.string(), action: z.string() })),
});
export type LovableStylePipelineResult = z.infer<typeof LovableStylePipelineResultSchema>;
