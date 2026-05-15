// Schema definitions using Zod — Phase 14

export { ProjectScanResultSchema, type ProjectScanResult } from './projectScanSchema.js';
export { RecommendationResultSchema, type RecommendationResult } from './recommendationSchema.js';
export { RegistryEntrySchema as RegistrySchema, type RegistryEntry } from './registrySchema.js';
export { InstallerManifestSchema, type InstallerManifest } from './installerSchema.js';

// Router schemas
export {
  RequestSignalsSchema, type RequestSignals,
  IntentSchema, type Intent,
  ExecutionPlanStepSchema, type ExecutionPlanStep,
  RouteRequestInputSchema, type RouteRequestInput,
  RouteRequestResultSchema, type RouteRequestResult,
  ExternalSkillRecommendationResultSchema, type ExternalSkillRecommendationResult,
} from './requestRouterSchema.js';

// External skill schemas (Phase 14)
export {
  RiskLevelSchema, type RiskLevel,
  ExternalSkillCategorySchema, type ExternalSkillCategory,
  ExternalSkillSchema, type ExternalSkill,
  ExternalSkillRecommendationSchema, type ExternalSkillRecommendation,
  ExternalSkillRegistrySchema, type ExternalSkillRegistry,
  ImageBriefSchema, type ImageBrief,
  CopyVariantsSchema, type CopyVariants,
  MarketingPlanSchema, type MarketingPlan,
  CROSEOPlanSchema, type CROSEOPlan,
} from './externalSkillSchema.js';

// Lovable-Style Design Pipeline schemas (Phase 15)
export {
  ProductMarketingContextSchema, type ProductMarketingContext,
  VisualDirectionSchema, type VisualDirection,
  DesignMdSchema, type DesignMd,
  DesignMdSectionSchema, type DesignMdSection,
  BrandTemplateSchema, type BrandTemplate,
  ComponentFirstPlanSchema, type ComponentFirstPlan,
  ComponentSpecSchema, type ComponentSpec,
  VisualQaPlanSchema, type VisualQaPlan,
  VisualQaCheckSchema, type VisualQaCheck,
  IterationReportSchema, type IterationReport,
  LovableStylePipelineInputSchema, type LovableStylePipelineInput,
  LovableStylePipelineResultSchema, type LovableStylePipelineResult,
} from './lovablePipelineSchema.js';
