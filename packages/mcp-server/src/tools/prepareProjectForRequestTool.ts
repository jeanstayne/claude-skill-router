import { z } from 'zod';
import { routeRequest } from '@claude-skill-router/core/router';

export const PrepareProjectInputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  userRequest: z.string().min(1).describe('Natural language request from user'),
  dryRun: z.boolean().default(true).describe('Preview changes (default: true)'),
  confirm: z.boolean().default(false).describe('Required for real writes. Must be true when dryRun is false.'),
  explicitPack: z.string().optional().describe('Force a specific pack'),
});

export type PrepareProjectInput = z.infer<typeof PrepareProjectInputSchema>;

export const prepareProjectForRequestTool = {
  name: 'prepare_project_for_request',
  description: 'Route user request AND prepare project (apply skills). Defaults to dry-run mode. Requires confirm=true for real writes.',
  inputSchema: PrepareProjectInputSchema,
  handler: async (rawInput: PrepareProjectInput) => {
    const input = PrepareProjectInputSchema.parse(rawInput);

    if (!input.dryRun && !input.confirm) {
      return {
        success: false,
        error: 'Mutation requires confirm: true',
        dryRun: false,
        requiresConfirm: true,
      };
    }

    const result = await routeRequest({
      projectPath: input.projectPath,
      userRequest: input.userRequest,
      dryRun: input.dryRun,
      confirm: input.confirm,
      mode: input.dryRun ? 'prepare' : 'apply',
      explicitPack: input.explicitPack,
    });

    return {
      success: result.success,
      intent: result.intent,
      requestSignals: result.requestSignals,
      projectScan: result.projectScan,
      selectedPack: result.selectedPack,
      skills: result.skills,
      agents: result.agents,
      suggestedDesignEngines: result.suggestedDesignEngines,
      executionPlan: result.executionPlan,
      dryRun: result.dryRun,
      requiresConfirm: result.requiresConfirm,
      applied: result.applied,
      warnings: result.warnings,
    };
  },
};
