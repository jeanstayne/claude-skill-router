import { z } from 'zod';

export const RequestSignalsSchema = z.object({
  brand: z.string().optional(),
  requestedOutput: z.string().optional(),
  visualStyle: z.array(z.string()),
  businessGoal: z.array(z.string()),
  keywords: z.array(z.string()),
  mentionsDesignEngine: z.array(z.string()),
  mentionsStack: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});
export type RequestSignals = z.infer<typeof RequestSignalsSchema>;

export const IntentSchema = z.enum([
  'create-landing-page', 'improve-landing-page',
  'create-institutional-site', 'create-dashboard', 'improve-dashboard',
  'convert-visual-reference-to-code', 'create-design-system',
  'review-visual-quality', 'improve-copy', 'plan-website-structure',
  'prepare-project',
  // Phase 14 — Marketing, Image, SEO, CRO intents
  'generate-site-images', 'create-hero-visual', 'create-image-prompts',
  'improve-headlines', 'improve-marketing-copy',
  'audit-page-cro', 'optimize-form-cro', 'optimize-popup-cro',
  'optimize-seo', 'add-schema-markup',
  'create-content-strategy', 'create-programmatic-seo-pages',
  'create-ad-creative', 'create-paid-ads',
  'create-social-content', 'create-email-sequence',
  'create-launch-strategy', 'create-product-marketing-context',
  'extract-design-system', 'audit-website',
  'unknown',
]);
export type Intent = z.infer<typeof IntentSchema>;

export const ExecutionPlanStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  required: z.boolean(),
  mutation: z.boolean(),
  requiresConfirm: z.boolean().optional(),
});
export type ExecutionPlanStep = z.infer<typeof ExecutionPlanStepSchema>;

export const RouteRequestInputSchema = z.object({
  projectPath: z.string().min(1),
  userRequest: z.string().min(1),
  dryRun: z.boolean().default(true),
  confirm: z.boolean().default(false),
  mode: z.enum(['recommend-only', 'prepare', 'apply']).default('recommend-only'),
  explicitPack: z.string().optional(),
});
export type RouteRequestInput = z.infer<typeof RouteRequestInputSchema>;

export const ExternalSkillRecommendationResultSchema = z.object({
  id: z.string(),
  reason: z.string(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  requiresExternalExecution: z.boolean(),
  installCommand: z.string().optional(),
  warning: z.string().optional(),
});
export type ExternalSkillRecommendationResult = z.infer<typeof ExternalSkillRecommendationResultSchema>;

export const RouteRequestResultSchema = z.object({
  success: z.boolean(),
  intent: IntentSchema,
  requestSignals: RequestSignalsSchema,
  projectScan: z.object({}).passthrough().optional(),
  recommendation: z.object({}).passthrough().optional(),
  selectedPack: z.string(),
  skills: z.array(z.string()),
  agents: z.array(z.string()),
  suggestedDesignEngines: z.array(z.object({
    id: z.string(), name: z.string(), reason: z.string(),
  })),
  externalSkillRecommendations: z.object({
    externalSkills: z.array(ExternalSkillRecommendationResultSchema),
    warnings: z.array(z.string()),
  }).optional(),
  executionPlan: z.array(ExecutionPlanStepSchema),
  dryRun: z.boolean(),
  requiresConfirm: z.boolean(),
  applied: z.boolean().optional(),
  warnings: z.array(z.string()),
});
export type RouteRequestResult = z.infer<typeof RouteRequestResultSchema>;
