import { z } from 'zod';
import { ExternalSkillCategorySchema, RiskLevelSchema, type ExternalSkill } from '@claude-skill-router/core/schemas/externalSkillSchema';
import { loadExternalSkills } from '@claude-skill-router/core/registry/loadExternalSkills';
import * as path from 'node:path';

function getRegistryPath(): string {
  return path.resolve(import.meta.dirname, '../../../../registry');
}

const InputSchema = z.object({
  category: ExternalSkillCategorySchema.optional().describe('Filter by category'),
  riskLevel: RiskLevelSchema.optional().describe('Filter by risk level'),
});

export const listExternalSkillsTool = {
  name: 'list_external_skills',
  description: 'List all registered external skills from the marketplace registry. Read-only.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    let skills: ExternalSkill[] = [];
    try {
      skills = await loadExternalSkills(getRegistryPath());
    } catch {
      return { skills: [], total: 0, note: 'External skills registry not available.' };
    }

    if (input.category) {
      skills = skills.filter(s => s.category === input.category);
    }
    if (input.riskLevel) {
      skills = skills.filter(s => s.riskLevel === input.riskLevel);
    }

    return {
      skills: skills.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        riskLevel: s.riskLevel,
        requiresExternalCli: s.requiresExternalCli,
        installCommand: s.installCommand,
      })),
      total: skills.length,
    };
  },
};
