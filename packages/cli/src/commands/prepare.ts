import { routeRequest } from '@claude-skill-router/core/router';

export async function prepareCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; dryRun?: boolean; confirm?: boolean; explicitPack?: string } = {}
) {
  const isDryRun = options.dryRun !== false;
  const isConfirmed = options.confirm === true;

  if (!isDryRun && !isConfirmed) {
    console.error('Error: Real writes require --confirm flag.');
    process.exit(1);
  }

  const result = await routeRequest({
    projectPath,
    userRequest,
    dryRun: isDryRun,
    confirm: isConfirmed,
    mode: isDryRun ? 'prepare' : 'apply',
    explicitPack: options.explicitPack,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Intent: ${result.intent}`);
    console.log(`Selected pack: ${result.selectedPack}`);
    if (result.applied) {
      console.log(`Status: Pack applied successfully.`);
    } else if (result.dryRun) {
      console.log(`Status: Dry-run — no files changed.`);
    }
    console.log(`\nSkills (${result.skills.length}):`);
    for (const s of result.skills) console.log(`  - ${s}`);
    console.log(`\nAgents (${result.agents.length}):`);
    for (const a of result.agents) console.log(`  - ${a}`);
    if (result.suggestedDesignEngines.length > 0) {
      console.log(`\nDesign engines:`);
      for (const e of result.suggestedDesignEngines) console.log(`  - ${e.name}`);
    }
    if (result.warnings.length > 0) {
      console.log(`\nWarnings:`);
      for (const w of result.warnings) console.log(`  - ${w}`);
    }
  }
  return result;
}
