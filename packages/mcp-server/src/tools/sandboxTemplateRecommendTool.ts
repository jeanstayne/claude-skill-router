import { z } from 'zod';
import { recommendSandboxTemplate } from '@claude-skill-router/core/sandbox-template-registry/recommendSandboxTemplate';

const InputSchema = z.object({
  projectType: z.string().optional().describe('Project type: landing-page, sass-application, api-backend, etc.'),
  framework: z.string().optional().describe('Target framework: nextjs, react, astro'),
  language: z.string().optional().describe('Target language: typescript, javascript'),
  needsUi: z.boolean().optional().describe('Whether the project needs UI libraries'),
  needsApi: z.boolean().optional().describe('Whether the project needs API routes'),
  needsDatabase: z.boolean().optional().describe('Whether the project needs database/ORM'),
});

export const sandboxTemplateRecommendTool = {
  name: 'sandbox_template_recommend',
  description: 'Recommend the best sandbox template (nextjs-tailwind-shadcn, vite-react-tailwind, nextjs-app-router, astro-landing, nextjs-api) based on project requirements.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = await recommendSandboxTemplate({
      projectType: input.projectType,
      framework: input.framework,
      language: input.language,
      needsUi: input.needsUi,
      needsApi: input.needsApi,
      needsDatabase: input.needsDatabase,
    });
    return result as unknown as Record<string, unknown>;
  },
};
