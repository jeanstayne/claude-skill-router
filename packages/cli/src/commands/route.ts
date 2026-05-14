import { routeRequest } from '@claude-skill-router/core/router';

export async function routeCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; explicitPack?: string } = {}
) {
  const result = await routeRequest({
    projectPath,
    userRequest,
    dryRun: true,
    mode: 'recommend-only',
    explicitPack: options.explicitPack,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Intent: ${result.intent}`);
    console.log(`Selected pack: ${result.selectedPack}`);
    console.log(`Confidence: ${result.requestSignals.confidence}`);
    if (result.requestSignals.brand) {
      console.log(`Brand detected: ${result.requestSignals.brand}`);
    }
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
    console.log(`\nExecution plan:`);
    for (const step of result.executionPlan) {
      const flags = [];
      if (step.required) flags.push('required');
      if (step.mutation) flags.push('mutation');
      if (step.requiresConfirm) flags.push('confirm-needed');
      console.log(`  ${step.id}: ${step.title}${flags.length ? ` [${flags.join(', ')}]` : ''}`);
    }
    if (result.warnings.length > 0) {
      console.log(`\nWarnings:`);
      for (const w of result.warnings) console.log(`  - ${w}`);
    }
    console.log(`\n${result.dryRun ? 'Mode: dry-run — no files were changed.' : 'Mode: real — pack applied.'}`);
    if (result.dryRun) {
      console.log(`Next step: Run with --confirm to apply this pack.`);
    }
  }
  return result;
}
