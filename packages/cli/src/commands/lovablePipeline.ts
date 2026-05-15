export async function lovablePipelineCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; dryRun?: boolean; confirm?: boolean; stylePreference?: string; brand?: string } = {}
) {
  const { runLovableStylePipeline } = await import('@claude-skill-router/core/lovable-pipeline/runLovableStylePipeline');
  const effectiveDryRun = options.dryRun !== false;
  const effectiveConfirm = options.confirm === true;

  const result = await runLovableStylePipeline({
    projectPath,
    userRequest,
    brand: options.brand,
    stylePreference: options.stylePreference,
    dryRun: effectiveDryRun,
    confirm: effectiveConfirm,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\n=== Lovable-Style Design Pipeline ===\n`);
    console.log(`Project: ${projectPath}`);
    console.log(`Request: "${userRequest}"`);
    console.log(`Mode: ${effectiveDryRun ? 'DRY-RUN (preview)' : 'LIVE (writing files)'}`);
    console.log(`\n--- Product Marketing Context ---`);
    console.log(`Brand: ${result.productMarketingContext.brand}`);
    console.log(`Audience: ${result.productMarketingContext.audience}`);
    console.log(`Offer: ${result.productMarketingContext.offer}`);
    console.log(`Tone: ${result.productMarketingContext.toneOfVoice}`);
    console.log(`Goal: ${result.productMarketingContext.conversionGoal}`);
    console.log(`\n--- Visual Directions (${result.visualDirections.length}) ---`);
    for (const dir of result.visualDirections) {
      const star = dir.id === result.selectedVisualDirection.id ? ' [RECOMMENDED]' : '';
      console.log(`  ${dir.name} (${dir.id})${star}`);
    }
    console.log(`\n--- Brand Template ---`);
    console.log(`Selected: ${result.selectedBrandTemplate.name} (${result.selectedBrandTemplate.id})`);
    console.log(`\n--- DESIGN.md ---`);
    console.log(`Path: ${result.designMd.path}`);
    console.log(`Status: ${result.designMd.wouldCreate ? 'Would create' : 'Skipped'}`);
    console.log(`\n--- Component-First Plan ---`);
    console.log(`Components: ${result.componentFirstPlan.components.length}`);
    for (const comp of result.componentFirstPlan.components) {
      console.log(`  - ${comp.name}: ${comp.purpose}`);
    }
    console.log(`\n--- Visual QA Plan ---`);
    console.log(`Checks: ${result.visualQaPlan.checks.length} (${result.visualQaPlan.checks.filter(c => c.severity === 'high').length} high, ${result.visualQaPlan.checks.filter(c => c.severity === 'medium').length} medium, ${result.visualQaPlan.checks.filter(c => c.severity === 'low').length} low)`);
    console.log(`\n--- Iteration Report ---`);
    console.log(`Next Steps:`);
    for (const step of result.iterationReport.nextSteps) {
      console.log(`  - ${step}`);
    }
    if (result.warnings.length > 0) {
      console.log(`\nWarnings:`);
      for (const w of result.warnings) {
        console.log(`  ! ${w}`);
      }
    }
    console.log('');
  }

  return result;
}
