import { z } from 'zod';
import { createProductMarketingContext } from '@claude-skill-router/core/lovable-pipeline/createProductMarketingContext';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  userRequest: z.string().min(1).describe('Natural language request from user'),
});

export const generateProductMarketingContextTool = {
  name: 'generate_product_marketing_context',
  description: 'Generate Product Marketing Context from user request — detects brand, audience, pains, desires, offer, differentiators, tone of voice.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const context = createProductMarketingContext({ userRequest: input.userRequest });
    return context as unknown as Record<string, unknown>;
  },
};
