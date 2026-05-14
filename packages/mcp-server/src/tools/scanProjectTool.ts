import { z } from 'zod';
import { scanProject } from '@claude-skill-router/core/scanner';

export const ScanProjectInputSchema = z.object({
  projectPath: z.string().describe('Path to the project directory to scan'),
});

export type ScanProjectInput = z.infer<typeof ScanProjectInputSchema>;

export const scanProjectTool = {
  name: 'scan_project',
  description: 'Scan a project directory and detect stack, framework, type, and Claude config',
  inputSchema: ScanProjectInputSchema,
  handler: async (input: ScanProjectInput) => {
    const result = await scanProject(input.projectPath);
    return {
      success: true,
      scan: result,
    };
  },
};
