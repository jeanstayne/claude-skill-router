import { z } from 'zod';
import { runDesignSystemEnforcer } from '@claude-skill-router/core/design-system-enforcer/runDesignSystemEnforcer';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the target project'),
});

export const designSystemEnforcerTool = {
  name: 'design_system_enforcer',
  description: 'Analyze project design system: detect hardcoded visual classes, analyze CSS variables/Tailwind/variants, generate checklist. Returns gaps and confidence score.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = await runDesignSystemEnforcer(input.projectPath);
    return result as unknown as Record<string, unknown>;
  },
};
