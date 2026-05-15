import { z } from 'zod';
import { createProductMarketingContext } from '@claude-skill-router/core/lovable-pipeline/createProductMarketingContext';
import { generateVisualDirections } from '@claude-skill-router/core/lovable-pipeline/generateVisualDirections';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  userRequest: z.string().min(1).describe('Natural language request from user'),
  stylePreference: z.string().optional().describe('Style preference hint'),
});

export const generateVisualDirectionsTool = {
  name: 'generate_visual_directions',
  description: 'Generate 3 visual directions (Premium Comercial, Editorial Clean, Conversão de Impacto) with mood, color, typography, layout, image, motion strategies. Always returns 3 variants.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const ctx = createProductMarketingContext({ userRequest: input.userRequest });
    const result = generateVisualDirections({
      userRequest: input.userRequest,
      productMarketingContext: ctx,
      stylePreference: input.stylePreference,
    });
    return result as unknown as Record<string, unknown>;
  },
};
