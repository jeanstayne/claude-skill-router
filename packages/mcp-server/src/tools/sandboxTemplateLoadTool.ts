import { z } from 'zod';
import { loadSandboxTemplates } from '@claude-skill-router/core/sandbox-template-registry/loadSandboxTemplates';

const InputSchema = z.object({});

export const sandboxTemplateLoadTool = {
  name: 'sandbox_template_load',
  description: 'Load all available sandbox templates from the registry (nextjs-tailwind-shadcn, vite-react-tailwind, nextjs-app-router, astro-landing, nextjs-api). Returns full template definitions with required files and recommended dependencies.',
  inputSchema: InputSchema,
  handler: async () => {
    const templates = await loadSandboxTemplates();
    return { templates } as unknown as Record<string, unknown>;
  },
};
