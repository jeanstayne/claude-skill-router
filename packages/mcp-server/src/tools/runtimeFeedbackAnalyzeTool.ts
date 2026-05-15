import { z } from 'zod';
import { runRuntimeFeedback } from '@claude-skill-router/core/runtime-feedback/runRuntimeFeedback';

const ConsoleLogEntrySchema = z.object({
  type: z.enum(['error', 'warn', 'log', 'info', 'debug']),
  message: z.string(),
  source: z.string().optional(),
  line: z.number().optional(),
  column: z.number().optional(),
  stack: z.string().optional(),
  timestamp: z.string().optional(),
});

const NetworkRequestEntrySchema = z.object({
  url: z.string(),
  method: z.string(),
  status: z.number(),
  duration: z.number(),
  size: z.number().optional(),
  type: z.enum(['xhr', 'fetch', 'script', 'stylesheet', 'image', 'font', 'document', 'other']),
  ok: z.boolean(),
  fromCache: z.boolean().optional(),
});

const InputSchema = z.object({
  consoleLogs: z.array(ConsoleLogEntrySchema).describe('Console log entries to analyze'),
  networkRequests: z.array(NetworkRequestEntrySchema).describe('Network request entries to analyze'),
});

export const runtimeFeedbackAnalyzeTool = {
  name: 'runtime_feedback_analyze',
  description: 'Analyze runtime feedback: parse console logs and network requests, classify issues (hydration, a11y, JS errors, network errors, performance), and generate fix plans with priority order.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = await runRuntimeFeedback({
      consoleLogs: input.consoleLogs,
      networkRequests: input.networkRequests,
    });
    return result as unknown as Record<string, unknown>;
  },
};
