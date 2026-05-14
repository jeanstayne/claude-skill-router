import { z } from 'zod';
import { installAutopilot } from '@claude-skill-router/core/installer';

export const InstallAutopilotSkillInputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  scope: z.enum(['project', 'global']).default('project').describe('Installation scope'),
  withClaudeMd: z.boolean().default(false).describe('Also add managed snippet to CLAUDE.md'),
  dryRun: z.boolean().default(true).describe('Preview mode (default: true)'),
  confirm: z.boolean().default(false).describe('Required for real writes. Must be true when dryRun is false.'),
});

export type InstallAutopilotSkillInput = z.infer<typeof InstallAutopilotSkillInputSchema>;

export const installAutopilotSkillTool = {
  name: 'install_autopilot_skill',
  description: 'Install the skill-router-autopilot skill in a project or globally. Always dry-run by default. Requires confirm=true for real writes.',
  inputSchema: InstallAutopilotSkillInputSchema,
  handler: async (rawInput: InstallAutopilotSkillInput) => {
    const input = InstallAutopilotSkillInputSchema.parse(rawInput);

    if (!input.dryRun && !input.confirm) {
      return {
        success: false,
        error: 'Mutation requires confirm: true',
        dryRun: false,
        requiresConfirm: true,
      };
    }

    if (input.scope === 'global' && !input.dryRun && !input.confirm) {
      return {
        success: false,
        error: 'Global installation requires explicit confirm: true',
        dryRun: false,
        requiresConfirm: true,
      };
    }

    const result = await installAutopilot({
      targetProjectPath: input.projectPath,
      scope: input.scope,
      dryRun: input.dryRun,
      confirm: input.confirm,
      withClaudeMd: input.withClaudeMd,
    });

    return {
      success: result.success,
      scope: result.scope,
      dryRun: result.dryRun,
      requiresConfirm: !result.dryRun,
      filesCreated: result.filesCreated,
      filesBackedUp: result.filesBackedUp,
      filesSkipped: result.filesSkipped,
      claudeMdPatch: result.claudeMdPatch,
      errors: result.errors,
    };
  },
};
