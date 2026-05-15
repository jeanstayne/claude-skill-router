export async function productMarketingContextCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean } = {}
) {
  const { createProductMarketingContext } = await import('@claude-skill-router/core/lovable-pipeline/createProductMarketingContext');
  const result = createProductMarketingContext({ userRequest });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\nProduct Marketing Context for: "${userRequest}"\n`);
    console.log(`Brand:              ${result.brand}`);
    console.log(`Product/Service:    ${result.productOrService}`);
    console.log(`Audience:           ${result.audience}`);
    console.log(`Primary Pain:       ${result.primaryPain}`);
    console.log(`Primary Desire:     ${result.primaryDesire}`);
    console.log(`Offer:              ${result.offer}`);
    console.log(`Differentiators:    ${result.differentiators.join(', ')}`);
    console.log(`Objections:         ${result.objections.join(', ')}`);
    console.log(`Tone of Voice:      ${result.toneOfVoice}`);
    console.log(`Conversion Goal:    ${result.conversionGoal}`);
    console.log(`Proof Assets:       ${result.proofAssets.length > 0 ? result.proofAssets.join(', ') : '(none detected)'}`);
    console.log('');
  }

  return result;
}
