import { z } from 'zod';

export const RecommendationResultSchema = z.object({
  recommendedPack: z.string(),
  skills: z.array(z.string()),
  agents: z.array(z.string()),
  reasoning: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export type RecommendationResult = z.infer<typeof RecommendationResultSchema>;
