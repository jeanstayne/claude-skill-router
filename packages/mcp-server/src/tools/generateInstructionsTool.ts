import { z } from 'zod';
import { loadRegistry } from '@claude-skill-router/core/registry';
import { generateClaudeMdPatch } from '@claude-skill-router/core/installer';
import * as path from 'node:path';

function getRegistryPath(): string {
  const dirname = import.meta.dirname;
  return path.resolve(dirname, '../../../../registry');
}

export const GenerateInstructionsInputSchema = z.object({
  projectPath: z.string().describe('Path to the target project'),
  packId: z.string().describe('ID of the skill pack to generate instructions for'),
});

export type GenerateInstructionsInput = z.infer<typeof GenerateInstructionsInputSchema>;

export const generateInstructionsTool = {
  name: 'generate_project_instructions',
  description: 'Generate project-specific instructions (CLAUDE.md patch) based on recommended skills',
  inputSchema: GenerateInstructionsInputSchema,
  handler: async (input: GenerateInstructionsInput) => {
    const registryPath = getRegistryPath();
    const registry = await loadRegistry(registryPath);

    const pack = registry.packs.find(p => p.id === input.packId);
    if (!pack) {
      return {
        success: false,
        error: `Pack "${input.packId}" not found in registry`,
      };
    }

    // Generate a dry-run patch to show what would be added
    const patchResult = await generateClaudeMdPatch(
      input.projectPath,
      pack.skills,
      pack.agents,
      true // always dry-run for instructions generation
    );

    return {
      success: true,
      packId: input.packId,
      skills: pack.skills,
      agents: pack.agents,
      suggestedPatch: patchResult.addedLines,
      claudeMdPath: patchResult.filePath,
      note: 'Use apply_skill_pack tool with dryRun=false to apply changes.',
    };
  },
};
