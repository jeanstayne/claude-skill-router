import { z } from 'zod';
import { generateImageBrief } from '@claude-skill-router/core/image-generation/generateImageBrief';
import { generateImagePrompts } from '@claude-skill-router/core/image-generation/generateImagePrompts';

const InputSchema = z.object({
  userRequest: z.string().min(1).describe('What kind of image is needed'),
  brand: z.string().optional().describe('Brand name for context'),
  providerId: z.enum(['gpt-image-2', 'nano-banana']).describe('Target provider'),
});

export const generateImagePromptsTool = {
  name: 'generate_image_prompts',
  description: 'Generate provider-specific image prompts for multiple formats (16:9, 9:16, 4:3, 1:1). Each prompt includes negative prompt and usage context.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const brief = generateImageBrief(input.userRequest, input.brand);
    const prompts = generateImagePrompts(brief, input.providerId);

    return {
      provider: input.providerId,
      prompts,
      count: prompts.length,
      formats: prompts.map(p => `${p.id} (${p.aspectRatio}, ${p.usage})`),
      requiresExternalExecution: true,
      requiresConfirm: true,
      warnings: [
        'AVISO: Estes prompts são para referência. A geração real requer execução externa com confirmação explícita.',
        'Nunca execute geração externa automaticamente.',
      ],
    };
  },
};
