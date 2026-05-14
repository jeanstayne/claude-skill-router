import { z } from 'zod';

export const ProjectScanResultSchema = z.object({
  projectRoot: z.string(),
  framework: z.string(),
  language: z.string(),
  ui: z.array(z.string()),
  tests: z.array(z.string()),
  agentConfig: z.object({
    hasClaudeMd: z.boolean(),
    hasAgentsMd: z.boolean(),
    hasClaudeFolder: z.boolean(),
    skills: z.array(z.string()),
    agents: z.array(z.string()),
  }),
  projectType: z.string(),
  confidence: z.number().min(0).max(1),
});

export type ProjectScanResult = z.infer<typeof ProjectScanResultSchema>;
