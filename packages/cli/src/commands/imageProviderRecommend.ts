export async function imageProviderRecommendCommand(
  userRequest: string,
  options: { json?: boolean; purpose?: string } = {}
) {
  const { recommendImageProvider } = await import('@claude-skill-router/core/image-generation/recommendImageProvider');

  const result = recommendImageProvider(userRequest, options.purpose as any);

  if (!result) {
    if (options.json) {
      console.log(JSON.stringify({ recommendedProvider: null, error: 'No providers available' }, null, 2));
    } else {
      console.log('No image providers found in registry.');
    }
    return { recommendedProvider: null };
  }

  if (options.json) {
    console.log(JSON.stringify({
      recommendedProvider: result.provider.id,
      providerName: result.provider.name,
      reason: result.reason,
      capabilities: result.provider.supports,
      riskLevel: result.provider.riskLevel,
      requiresExternalExecution: result.provider.requiresExternalExecution,
      requiresConfirm: true,
    }, null, 2));
  } else {
    console.log(`\n=== Image Provider Recommendation ===\n`);
    console.log(`Provider: ${result.provider.name} (${result.provider.id})`);
    console.log(`Reason: ${result.reason}`);
    console.log(`Risk: ${result.provider.riskLevel.toUpperCase()}`);
    console.log(`\nWARNING: External execution required. Never auto-execute without explicit confirmation.`);
    console.log('');
  }

  return { recommendedProvider: result.provider.id };
}
