export async function imagePlanCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; brand?: string; provider?: string; purpose?: string; dryRun?: boolean } = {}
) {
  const { runImageGenerationPlan } = await import('@claude-skill-router/core/image-generation/runImageGenerationPlan');

  const plan = runImageGenerationPlan({
    projectPath,
    userRequest,
    brand: options.brand,
    provider: options.provider as any,
    purpose: options.purpose as any,
    dryRun: options.dryRun !== false,
    confirm: false,
  });

  // Strip any API keys from command preview
  if (plan.commandPreview) {
    plan.commandPreview = plan.commandPreview
      .replace(/AIzaSy[A-Za-z0-9_-]+/g, '<API_KEY>')
      .replace(/sk-[A-Za-z0-9]+/g, '<API_KEY>');
  }

  if (options.json) {
    console.log(JSON.stringify(plan, null, 2));
  } else {
    console.log(`\n=== Image Generation Plan ===\n`);
    console.log(`Provider: ${plan.provider}`);
    console.log(`Recommended: ${plan.recommendedProvider}`);
    console.log(`Success: ${plan.success}`);
    console.log(`Dry Run: ${plan.dryRun}`);
    console.log(`Requires Confirm: ${plan.requiresConfirm}`);
    console.log(`\n--- Brief ---`);
    console.log(`Objective: ${plan.brief.objective}`);
    console.log(`Scene: ${plan.brief.scene}`);
    console.log(`Style: ${plan.brief.style}`);
    console.log(`\n--- Prompts (${plan.prompts.length}) ---`);
    for (const p of plan.prompts) {
      console.log(`  ${p.id} (${p.aspectRatio}): ${p.prompt.substring(0, 120)}...`);
    }
    if (plan.commandPreview) {
      console.log(`\n--- Command Preview ---`);
      console.log(plan.commandPreview);
    }
    if (plan.warnings.length > 0) {
      console.log(`\n--- Warnings ---`);
      for (const w of plan.warnings) {
        console.log(`  ! ${w}`);
      }
    }
    console.log('');
  }

  return plan;
}
