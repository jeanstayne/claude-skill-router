import { z } from 'zod';
import { recommendSkills } from '@claude-skill-router/core/recommender';

export const RecommendSkillsInputSchema = z.object({
  projectType: z.string().describe('Detected project type'),
  framework: z.string().describe('Detected framework'),
  ui: z.array(z.string()).describe('Detected UI libraries'),
  goal: z.string().optional().describe('Optional project goal'),
});

export type RecommendSkillsInput = z.infer<typeof RecommendSkillsInputSchema>;

export const recommendSkillsTool = {
  name: 'recommend_skills',
  description: 'Recommend skills, agents, and design engines. Design engines are suggestions only — never executed automatically.',
  inputSchema: RecommendSkillsInputSchema,
  handler: async (input: RecommendSkillsInput) => {
    const result = await recommendSkills(input);
    return {
      success: true,
      recommendation: {
        recommendedPack: result.recommendedPack,
        skills: result.skills,
        agents: result.agents,
        reasoning: result.reasoning,
        confidence: result.confidence,
        suggestedDesignEngines: result.suggestedDesignEngines,
      },
    };
  },
};
