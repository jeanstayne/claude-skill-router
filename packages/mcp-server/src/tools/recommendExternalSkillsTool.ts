import { z } from 'zod';
import { recommendExternalSkills } from '@claude-skill-router/core/registry/recommendExternalSkills';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  userRequest: z.string().min(1).describe('Natural language request from user'),
  maxResults: z.number().default(5).describe('Max external skills to recommend'),
});

export const recommendExternalSkillsTool = {
  name: 'recommend_external_skills',
  description: 'Recommend external skills from the marketplace registry for a user request. Never executes external skills — recommendation only.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = await recommendExternalSkills({
      intent: 'unknown',
      userRequest: input.userRequest,
      maxResults: input.maxResults,
    });

    return {
      externalSkills: result.externalSkills,
      warnings: result.warnings,
      note: 'External skills are references only. Install manually with npx skills add if needed.',
    };
  },
};
