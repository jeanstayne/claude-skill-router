import { z } from 'zod';
import { selectBrandTemplate } from '@claude-skill-router/core/lovable-pipeline/selectBrandTemplate';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  userRequest: z.string().min(1).describe('Natural language request from user'),
  brand: z.string().optional().describe('Brand name'),
  projectType: z.string().optional().describe('Detected project type (landing-page, dashboard-saas, etc.)'),
  intent: z.string().optional().describe('Detected intent'),
});

export const selectBrandTemplateTool = {
  name: 'select_brand_template',
  description: 'Select the best brand template based on brand name, project type, intent, and keyword heuristics. Returns template with confidence score.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = await selectBrandTemplate({
      brand: input.brand,
      projectType: input.projectType,
      intent: input.intent,
      userRequest: input.userRequest,
    });
    return result as unknown as Record<string, unknown>;
  },
};
