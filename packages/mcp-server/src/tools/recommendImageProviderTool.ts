import { z } from 'zod';
import { recommendImageProvider } from '@claude-skill-router/core/image-generation/recommendImageProvider';

const InputSchema = z.object({
  userRequest: z.string().min(1).describe('What kind of image is needed'),
  purpose: z.enum(['hero', 'section', 'ad', 'social', 'background', 'mockup']).optional()
    .describe('Purpose of the image'),
});

export const recommendImageProviderTool = {
  name: 'recommend_image_provider',
  description: 'Recommend the best image generation provider (gpt-image-2 vs nano-banana) for a given request.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = recommendImageProvider(input.userRequest, input.purpose);

    if (!result) {
      return {
        recommendedProvider: null,
        reason: 'No image providers available in registry.',
        availableProviders: [],
      };
    }

    return {
      recommendedProvider: result.provider.id,
      providerName: result.provider.name,
      reason: result.reason,
      capabilities: result.provider.supports,
      riskLevel: result.provider.riskLevel,
      requiresExternalExecution: result.provider.requiresExternalExecution,
      requiresConfirm: true,
      warnings: [
        `${result.provider.name} é um provider de alto risco. Requer execução externa com API key.`,
        'Nunca execute geração de imagem sem confirmação explícita do usuário.',
      ],
    };
  },
};
