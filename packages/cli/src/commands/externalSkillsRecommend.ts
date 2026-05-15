import { recommendExternalSkills } from '@claude-skill-router/core/registry/recommendExternalSkills';
import type { ExternalSkillRecommendation } from '@claude-skill-router/core/schemas/externalSkillSchema';

export async function externalSkillsRecommendCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; maxResults?: number } = {}
): Promise<{ externalSkills: ExternalSkillRecommendation[]; warnings: string[] }> {
  const result = await recommendExternalSkills({
    intent: 'unknown',
    userRequest,
    maxResults: options.maxResults || 5,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Recommendations for: "${userRequest}"\n`);

    if (result.externalSkills.length === 0) {
      console.log('No external skills found for this request.');
    } else {
      for (const s of result.externalSkills) {
        console.log(`  [${s.riskLevel}] ${s.id}`);
        console.log(`    Reason: ${s.reason}`);
        if (s.requiresExternalExecution) {
          console.log(`    Requires external execution`);
        }
        if (s.warning) {
          console.log(`    WARNING: ${s.warning}`);
        }
        console.log();
      }
    }

    if (result.warnings.length > 0) {
      console.log('Warnings:');
      for (const w of result.warnings) {
        console.log(`  ! ${w}`);
      }
      console.log();
    }
  }

  return result;
}
