import { z } from 'zod';
import { runLovableStylePipeline } from '@claude-skill-router/core/lovable-pipeline/runLovableStylePipeline';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the target project'),
  userRequest: z.string().min(1).describe('Natural language request from user'),
  brand: z.string().optional().describe('Brand name (auto-detected if omitted)'),
  audience: z.string().optional().describe('Target audience (auto-detected if omitted)'),
  offer: z.string().optional().describe('Value proposition (auto-detected if omitted)'),
  goal: z.string().optional().describe('Conversion goal (auto-detected if omitted)'),
  stylePreference: z.string().optional().describe('Style preference hint (e.g. Lovable, Framer, v0)'),
  dryRun: z.boolean().default(true).describe('Preview mode (default: true)'),
  confirm: z.boolean().default(false).describe('Required for real writes. Must be true when dryRun is false.'),
});

export const runLovablePipelineTool = {
  name: 'run_lovable_pipeline',
  description: 'Run the Lovable-Style Design Pipeline: Product Marketing Context → Visual Directions → Brand Template → DESIGN.md → Component-First Plan → Visual QA Plan → Iteration Report. Always dry-run by default. Requires confirm=true for real writes.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = await runLovableStylePipeline(input);
    return result as unknown as Record<string, unknown>;
  },
};
