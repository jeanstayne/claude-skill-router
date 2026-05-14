import { recommendSkills } from '@claude-skill-router/core/recommender';

export async function recommendCommand(
  projectType: string,
  framework: string,
  ui: string[],
  options: { json?: boolean } = {}
) {
  const result = await recommendSkills({ projectType, framework, ui });
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Recommended pack: ${result.recommendedPack}`);
    console.log(`\nSkills:`);
    for (const s of result.skills) {
      console.log(`  - ${s}`);
    }
    console.log(`\nAgents:`);
    for (const a of result.agents) {
      console.log(`  - ${a}`);
    }
    if (result.suggestedDesignEngines.length > 0) {
      console.log(`\nSuggested design engines:`);
      for (const e of result.suggestedDesignEngines) {
        console.log(`  - ${e.name}: ${e.reason}`);
      }
    }
    console.log(`\nConfidence: ${result.confidence}`);
    console.log('Reasoning:');
    result.reasoning.forEach((r: string) => console.log(`  - ${r}`));
  }
  return result;
}
