import { z } from 'zod';
import { generateDesignTokensPlan } from '@claude-skill-router/core/design-system-enforcer/generateDesignTokensPlan';
import { BrandTemplateSchema, VisualDirectionSchema } from '@claude-skill-router/core/schemas/lovablePipelineSchema';

const InputSchema = z.object({
  brandTemplate: BrandTemplateSchema.describe('Brand template with palette and typography'),
  visualDirection: VisualDirectionSchema.describe('Visual direction/style'),
});

export const designTokensPlanTool = {
  name: 'design_tokens_plan',
  description: 'Generate semantic design tokens plan: colors (primary, accent, background, surface, muted, text, border), gradients (hero, cta, section), shadows (sm, card, elevated, premium), radius (sm, card, component, full), motion (durations, easings), and typography (headline, body, sizes). Uses brand template palette and visual direction.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = generateDesignTokensPlan(input.brandTemplate, input.visualDirection);
    return result as unknown as Record<string, unknown>;
  },
};
