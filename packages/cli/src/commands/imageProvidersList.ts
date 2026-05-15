export async function imageProvidersListCommand(options: { json?: boolean } = {}) {
  const { loadImageProviders } = await import('@claude-skill-router/core/image-generation/loadImageProviders');

  const providers = loadImageProviders();

  if (options.json) {
    console.log(JSON.stringify({ providers, count: providers.length }, null, 2));
  } else {
    console.log('\n=== Image Providers ===\n');
    for (const p of providers) {
      console.log(`  ${p.id}`);
      console.log(`    Name: ${p.name}`);
      console.log(`    Provider: ${p.provider}`);
      console.log(`    Best for: ${p.bestFor.join(', ')}`);
      console.log(`    Supports: text2img=${p.supports.textToImage}, img2img=${p.supports.imageToImage}`);
      console.log(`    Risk: ${p.riskLevel} | External: ${p.requiresExternalExecution} | Confirm: ${!p.autoExecuteAllowed}`);
      console.log(`    Env: ${p.envVars.join(', ')}`);
      console.log(`    Notes: ${p.notes}`);
      console.log('');
    }
    console.log(`WARNING: All image providers require external execution and explicit confirmation.`);
    console.log('');
  }

  return { providers };
}
