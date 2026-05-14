import { z } from 'zod';
import { cleanupUnusedSkills } from '@claude-skill-router/core/installer';

export const CleanupUnusedSkillsInputSchema = z.object({
  projectPath: z.string().describe('Path to the target project'),
  dryRun: z.boolean().default(true).describe('Preview what would be removed (default: true)'),
  confirm: z.boolean().default(false).describe('Required explicit confirmation for real removal. Must be true when dryRun is false.'),
});

export type CleanupUnusedSkillsInput = z.infer<typeof CleanupUnusedSkillsInputSchema>;

export const cleanupUnusedSkillsTool = {
  name: 'cleanup_unused_skills',
  description: 'Remove unused skills from a project. Defaults to dry-run mode. Never removes unmanaged files.',
  inputSchema: CleanupUnusedSkillsInputSchema,
  handler: async (rawInput: CleanupUnusedSkillsInput) => {
    const input = CleanupUnusedSkillsInputSchema.parse(rawInput);
    if (!input.dryRun && !input.confirm) {
      return {
        success: false,
        dryRun: false,
        error: 'Real removal requires confirm=true. Set dryRun=true for preview, or confirm=true to remove files.',
      };
    }

    const result = await cleanupUnusedSkills({
      targetProjectPath: input.projectPath,
      dryRun: input.dryRun,
    });

    return {
      success: result.success,
      dryRun: input.dryRun,
      filesRemoved: result.filesRemoved,
      errors: result.errors,
    };
  },
};
