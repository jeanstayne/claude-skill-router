import { z } from 'zod';
import { runPreviewQaLoop } from '@claude-skill-router/core/preview-qa-loop/runPreviewQaLoop';

const ViewportCheckSchema = z.object({
  checkId: z.string(),
  passed: z.boolean(),
  note: z.string(),
});

const ViewportResultSchema = z.object({
  viewportName: z.string(),
  checks: z.array(ViewportCheckSchema),
});

const InputSchema = z.object({
  viewportResults: z.array(ViewportResultSchema).optional().describe('Viewport QA check results (optional — runs setup without results)'),
});

export const previewQaLoopTool = {
  name: 'preview_qa_loop',
  description: 'Run the Preview QA Loop: generate a 20-item visual checklist, create a responsive viewport matrix (390x844, 768x1024, 1440x900, 1920x1080), detect visual regressions, and generate iteration plans. Feed viewport check results for regression detection.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = await runPreviewQaLoop({
      viewportResults: input.viewportResults,
    });
    return result as unknown as Record<string, unknown>;
  },
};
