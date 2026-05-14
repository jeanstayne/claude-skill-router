import { z } from 'zod';
import { installSkillPack } from '@claude-skill-router/core/installer';

export const ApplySkillPackInputSchema = z.object({
  projectPath: z.string().describe('Path to the target project'),
  packId: z.string().describe('ID of the skill pack to apply'),
  dryRun: z.boolean().default(true).describe('Preview changes without applying (default: true)'),
  confirm: z.boolean().default(false).describe('Required explicit confirmation for real writes. Must be true when dryRun is false.'),
});

export type ApplySkillPackInput = z.infer<typeof ApplySkillPackInputSchema>;

export const applySkillPackTool = {
  name: 'apply_skill_pack',
  description: 'Apply a skill pack to a project. Defaults to dry-run mode (safe preview). Requires explicit confirm=true for real writes.',
  inputSchema: ApplySkillPackInputSchema,
  handler: async (rawInput: ApplySkillPackInput) => {
    const input = ApplySkillPackInputSchema.parse(rawInput);
    if (!input.dryRun && !input.confirm) {
      return {
        success: false,
        dryRun: false,
        error: 'Real writes require confirm=true. Set dryRun=true for preview, or confirm=true to apply changes.',
      };
    }

    const result = await installSkillPack({
      targetProjectPath: input.projectPath,
      packId: input.packId,
      dryRun: input.dryRun,
    });

    return {
      success: result.success,
      dryRun: input.dryRun,
      filesCreated: result.filesCreated,
      filesBackedUp: result.filesBackedUp,
      manifest: result.manifest,
      errors: result.errors,
    };
  },
};
