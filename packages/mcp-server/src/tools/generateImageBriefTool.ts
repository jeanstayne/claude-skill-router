import { z } from 'zod';
import { ImageBriefSchema } from '@claude-skill-router/core/schemas/externalSkillSchema';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  userRequest: z.string().min(1).describe('What kind of image is needed'),
  brand: z.string().optional().describe('Brand name for context'),
});

export const generateImageBriefTool = {
  name: 'generate_image_brief',
  description: 'Generate an image brief and prompt for hero, banner, or visual assets. Does NOT generate images — provides brief/prompt only.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const brand = input.brand || 'a marca';

    const brief = {
      objective: `Imagem principal para ${input.userRequest.includes('hero') ? 'hero section' : 'site'} de ${brand}`,
      scene: `Cena profissional representando o produto/serviço de ${brand} em contexto natural de uso`,
      composition: 'Enquadramento wide (16:9), ponto focal central com espaço para copy à esquerda',
      style: 'Premium, iluminação natural, cores vibrantes mas sofisticadas, profundidade de campo',
      prompt: `Professional hero image for ${brand} — wide landscape composition, natural lighting, premium quality, depth of field, centered subject with copy space on left side, high-end commercial photography style`,
      negativePrompt: 'low quality, blurry, watermark, text overlay, distorted faces, busy background, harsh shadows, artificial lighting',
      formats: ['16:9 (hero desktop)', '9:16 (stories/mobile hero)', '1:1 (social feed)'],
    };

    const parsed = ImageBriefSchema.parse(brief);

    return {
      brief: parsed,
      recommendedExternalSkills: ['gpt-image-2', 'ai-image-generation', 'canvas-design'],
      requiresExternalExecution: true,
      requiresConfirm: true,
      warnings: [
        'AVISO: Skills de geração de imagem (gpt-image-2, ai-image-generation) requerem CLI/login externo.',
        'Este brief é apenas uma referência. Para gerar a imagem, use um gerador externo manualmente.',
      ],
    };
  },
};
