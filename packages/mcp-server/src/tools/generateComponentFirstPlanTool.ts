import { z } from 'zod';
import { createProductMarketingContext } from '@claude-skill-router/core/lovable-pipeline/createProductMarketingContext';
import { generateVisualDirections } from '@claude-skill-router/core/lovable-pipeline/generateVisualDirections';
import { selectBrandTemplate } from '@claude-skill-router/core/lovable-pipeline/selectBrandTemplate';
import { generateComponentFirstPlan } from '@claude-skill-router/core/lovable-pipeline/generateComponentFirstPlan';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the target project'),
  userRequest: z.string().min(1).describe('Natural language request from user'),
  stylePreference: z.string().optional().describe('Style preference hint'),
});

export const generateComponentFirstPlanTool = {
  name: 'generate_component_first_plan',
  description: 'Generate a Component-First UI Plan with individual component specs (props, visual notes, copy notes, accessibility), recommended file structure, and implementation order.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const ctx = createProductMarketingContext({ userRequest: input.userRequest });
    const { recommended } = generateVisualDirections({ userRequest: input.userRequest, productMarketingContext: ctx, stylePreference: input.stylePreference });
    const { template } = await selectBrandTemplate({ brand: ctx.brand, userRequest: input.userRequest });
    const fallbackTemplate = template || {
      id: 'tech-product-lp', name: 'Tech Product LP',
      segments: [], bestForBrands: [], visualPersonality: ['professional'],
      recommendedPalette: { primary: '#2563eb', accent: '#f59e0b', background: '#ffffff' },
      typography: { headline: 'Inter', body: 'Inter' },
      componentStyle: { buttons: 'rounded-lg', cards: 'shadow-sm', sections: 'py-16' },
      recommendedSections: ['Hero', 'Benefits', 'CTA'], avoid: [],
    };
    const result = generateComponentFirstPlan({
      userRequest: input.userRequest,
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: fallbackTemplate,
    });
    return result as unknown as Record<string, unknown>;
  },
};
