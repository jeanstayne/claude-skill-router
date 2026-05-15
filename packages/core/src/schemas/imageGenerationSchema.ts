// Image Generation Orchestrator — Zod schemas (Phase 17)
import { z } from 'zod';

// === Image Provider ===
export const ImageProviderSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.literal('image-generation'),
  provider: z.string().min(1),
  bestFor: z.array(z.string()),
  supports: z.object({
    textToImage: z.boolean(),
    imageToImage: z.boolean(),
    multiReference: z.boolean(),
    transparentBackground: z.boolean(),
  }),
  requiresExternalExecution: z.boolean(),
  requiresNetwork: z.boolean(),
  requiresApiKey: z.boolean(),
  envVars: z.array(z.string()),
  autoExecuteAllowed: z.literal(false),
  dryRunDefault: z.literal(true),
  riskLevel: z.literal('high'),
  notes: z.string(),
});
export type ImageProvider = z.infer<typeof ImageProviderSchema>;

// === Image Brief ===
export const ImageBriefSchemaV2 = z.object({
  objective: z.string().min(1),
  brand: z.string().min(1),
  audience: z.string().default(''),
  scene: z.string().min(1),
  composition: z.string().min(1),
  environment: z.string().default(''),
  lighting: z.string().default(''),
  colorMood: z.string().default(''),
  style: z.string().min(1),
  mustInclude: z.array(z.string()).default([]),
  mustAvoid: z.array(z.string()).default([]),
  negativePrompt: z.string().default(''),
  usage: z.array(z.string()).default(['hero']),
  aspectRatios: z.array(z.string()).default(['16:9']),
});
export type ImageBriefV2 = z.infer<typeof ImageBriefSchemaV2>;

// === Image Prompt ===
export const ImagePromptSchema = z.object({
  id: z.string().min(1),
  provider: z.enum(['gpt-image-2', 'nano-banana']),
  aspectRatio: z.string().min(1),
  prompt: z.string().min(1),
  negativePrompt: z.string().default(''),
  usage: z.string().min(1),
});
export type ImagePrompt = z.infer<typeof ImagePromptSchema>;

// === Image Generation Input ===
export const ImageGenerationInputSchema = z.object({
  projectPath: z.string().min(1),
  userRequest: z.string().min(1),
  brand: z.string().optional(),
  provider: z.enum(['gpt-image-2', 'nano-banana']).optional(),
  purpose: z.enum(['hero', 'section', 'ad', 'social', 'background', 'mockup']).optional(),
  aspectRatios: z.array(z.string()).optional(),
  dryRun: z.boolean().default(true),
  confirm: z.boolean().default(false),
});
export type ImageGenerationInput = z.infer<typeof ImageGenerationInputSchema>;

// === Image Generation Plan ===
export const ImageGenerationPlanSchema = z.object({
  success: z.boolean(),
  provider: z.string(),
  brief: ImageBriefSchemaV2,
  prompts: z.array(ImagePromptSchema),
  recommendedProvider: z.string(),
  requiresExternalExecution: z.boolean(),
  requiresConfirm: z.boolean(),
  dryRun: z.boolean(),
  warnings: z.array(z.string()),
  commandPreview: z.string().optional(),
  outputFiles: z.array(z.string()).optional(),
});
export type ImageGenerationPlan = z.infer<typeof ImageGenerationPlanSchema>;

// === Image Generation Result ===
export const ImageGenerationResultSchema = z.object({
  success: z.boolean(),
  provider: z.string(),
  message: z.string(),
  generatedFiles: z.array(z.string()).optional(),
  error: z.string().optional(),
});
export type ImageGenerationResult = z.infer<typeof ImageGenerationResultSchema>;
