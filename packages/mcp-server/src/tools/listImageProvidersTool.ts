import { z } from 'zod';
import { loadImageProviders } from '@claude-skill-router/core/image-generation/loadImageProviders';

const InputSchema = z.object({});

export const listImageProvidersTool = {
  name: 'list_image_providers',
  description: 'List all available image generation providers (gpt-image-2, nano-banana) with capabilities and risk levels.',
  inputSchema: InputSchema,
  handler: async () => {
    const providers = loadImageProviders();
    return {
      providers,
      count: providers.length,
      note: 'All image providers require external execution and explicit confirmation. Never auto-execute.',
    };
  },
};
