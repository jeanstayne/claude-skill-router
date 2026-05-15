import { z } from 'zod';
import { generateImageBrief } from '@claude-skill-router/core/image-generation/generateImageBrief';
import { loadImageProvider } from '@claude-skill-router/core/image-generation/loadImageProviders';

const InputSchema = z.object({
  userRequest: z.string().min(1).describe('What kind of image is needed'),
  brand: z.string().optional().describe('Brand name for context'),
  providerId: z.enum(['gpt-image-2', 'nano-banana']).optional()
    .describe('Target provider (default: auto-recommend)'),
});

export const generateImageBriefToolV2 = {
  name: 'generate_image_brief_v2',
  description: 'Generate a professional image brief with objective, scene, composition, lighting, color mood, must-include/must-avoid lists. Rich brand-aware brief for Destaque Agro and other brands.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const provider = input.providerId ? loadImageProvider(input.providerId) : undefined;
    const brief = generateImageBrief(input.userRequest, input.brand, provider || undefined);

    return {
      brief,
      requiresExternalExecution: true,
      requiresConfirm: true,
      warnings: [
        'AVISO: Este brief é apenas uma referência. Para gerar a imagem real, use um provider externo com confirmação explícita.',
        'Nunca execute geração externa automaticamente. O usuário deve aprovar e configurar credenciais.',
      ],
    };
  },
};
