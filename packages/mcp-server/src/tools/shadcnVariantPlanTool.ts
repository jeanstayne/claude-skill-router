import { z } from 'zod';
import { generateShadcnVariantPlan } from '@claude-skill-router/core/design-system-enforcer/generateShadcnVariantPlan';
import { BrandTemplateSchema } from '@claude-skill-router/core/schemas/lovablePipelineSchema';

const InputSchema = z.object({
  brandTemplate: BrandTemplateSchema.describe('Brand template with palette for variant classes'),
});

export const shadcnVariantPlanTool = {
  name: 'shadcn_variant_plan',
  description: 'Generate shadcn/ui component variant plan: Button (default, accent, outline, ghost, premium), Card (default, glass, premium, interactive), Badge (default, accent, success), Section (default, alt, hero, cta), Hero (default, gradient, image). Variant classes use brand palette colors.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = generateShadcnVariantPlan(input.brandTemplate);
    return result as unknown as Record<string, unknown>;
  },
};
