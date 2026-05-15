import { z } from 'zod';

export const RiskLevelSchema = z.enum(['low', 'medium', 'high']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const ExternalSkillCategorySchema = z.enum([
  'design', 'image', 'marketing', 'seo', 'social', 'ads', 'audit',
]);
export type ExternalSkillCategory = z.infer<typeof ExternalSkillCategorySchema>;

export const ExternalSkillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  source: z.string(),
  repository: z.string().min(1).startsWith('https://github.com/'),
  skillPath: z.string().min(1),
  installCommand: z.string().min(1),
  category: ExternalSkillCategorySchema,
  subcategories: z.array(z.string()),
  bestFor: z.array(z.string()),
  riskLevel: RiskLevelSchema,
  requiresExternalCli: z.boolean().default(false),
  requiresLogin: z.boolean().default(false),
  requiresNetwork: z.boolean().default(false),
  autoInstallAllowed: z.boolean().default(false),
  autoExecuteAllowed: z.boolean().default(false),
  useAsReference: z.boolean().default(true),
  notes: z.string().default(''),
}).refine(
  (data) => {
    if (data.requiresExternalCli && data.riskLevel === 'low') return false;
    return true;
  },
  { message: 'Skills requiring external CLI must have riskLevel medium or high' }
).refine(
  (data) => {
    if (data.requiresLogin && data.riskLevel === 'low') return false;
    return true;
  },
  { message: 'Skills requiring login must have riskLevel medium or high' }
).refine(
  (data) => {
    if (data.requiresNetwork && data.autoExecuteAllowed) return false;
    return true;
  },
  { message: 'Skills requiring network cannot have autoExecuteAllowed true' }
);

export type ExternalSkill = z.infer<typeof ExternalSkillSchema>;

export const ExternalSkillRecommendationSchema = z.object({
  id: z.string(),
  reason: z.string(),
  riskLevel: RiskLevelSchema,
  requiresExternalExecution: z.boolean(),
  installCommand: z.string().optional(),
  warning: z.string().optional(),
});
export type ExternalSkillRecommendation = z.infer<typeof ExternalSkillRecommendationSchema>;

export const ExternalSkillRegistrySchema = z.object({
  version: z.string(),
  skills: z.array(ExternalSkillSchema),
});
export type ExternalSkillRegistry = z.infer<typeof ExternalSkillRegistrySchema>;

export const ImageBriefSchema = z.object({
  objective: z.string(),
  scene: z.string(),
  composition: z.string(),
  style: z.string(),
  prompt: z.string(),
  negativePrompt: z.string(),
  formats: z.array(z.string()),
});
export type ImageBrief = z.infer<typeof ImageBriefSchema>;

export const CopyVariantsSchema = z.object({
  headlines: z.array(z.string()),
  subheadlines: z.array(z.string()),
  ctas: z.array(z.string()),
  angles: z.array(z.string()),
});
export type CopyVariants = z.infer<typeof CopyVariantsSchema>;

export const MarketingPlanSchema = z.object({
  offer: z.string(),
  audience: z.string(),
  channels: z.array(z.string()),
  ads: z.array(z.object({ channel: z.string(), headline: z.string(), visualBrief: z.string() })),
  social: z.array(z.object({ platform: z.string(), contentIdea: z.string(), format: z.string() })),
  email: z.array(z.object({ type: z.string(), subject: z.string(), goal: z.string() })),
  launch: z.object({ phases: z.array(z.string()), timeline: z.string() }),
  assets: z.array(z.string()),
});
export type MarketingPlan = z.infer<typeof MarketingPlanSchema>;

export const CROSEOPlanSchema = z.object({
  cro: z.array(z.object({ category: z.string(), action: z.string(), priority: z.enum(['high', 'medium', 'low']) })),
  seo: z.array(z.object({ category: z.string(), action: z.string(), priority: z.enum(['high', 'medium', 'low']) })),
  schema: z.array(z.object({ type: z.string(), priority: z.enum(['high', 'medium', 'low']) })),
});
export type CROSEOPlan = z.infer<typeof CROSEOPlanSchema>;
