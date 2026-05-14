import { z } from 'zod';
import { routeRequest } from '@claude-skill-router/core/router';

export const RouteRequestInputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  userRequest: z.string().min(1).describe('Natural language request from user'),
  dryRun: z.boolean().default(true).describe('Preview mode (default: true)'),
  explicitPack: z.string().optional().describe('Force a specific pack'),
});

export type RouteRequestInput = z.infer<typeof RouteRequestInputSchema>;

export const routeRequestTool = {
  name: 'route_request',
  description: 'Analyze a natural language user request and recommend skills, agents, packs and design engines. Never modifies files — recommendation only.',
  inputSchema: RouteRequestInputSchema,
  handler: async (rawInput: RouteRequestInput) => {
    const input = RouteRequestInputSchema.parse(rawInput);
    const result = await routeRequest({
      projectPath: input.projectPath,
      userRequest: input.userRequest,
      dryRun: true, // always dry-run for route_request
      mode: 'recommend-only',
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
      warnings: result.warnings,
      note: 'Use prepare_project_for_request to apply changes with confirmation.',
    };
  },
};
