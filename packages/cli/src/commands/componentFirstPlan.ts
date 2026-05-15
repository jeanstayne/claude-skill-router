export async function componentFirstPlanCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; stylePreference?: string } = {}
) {
  const { createProductMarketingContext } = await import('@claude-skill-router/core/lovable-pipeline/createProductMarketingContext');
  const { generateVisualDirections } = await import('@claude-skill-router/core/lovable-pipeline/generateVisualDirections');
  const { selectBrandTemplate } = await import('@claude-skill-router/core/lovable-pipeline/selectBrandTemplate');
  const { generateComponentFirstPlan } = await import('@claude-skill-router/core/lovable-pipeline/generateComponentFirstPlan');

  const ctx = createProductMarketingContext({ userRequest });
  const { recommended } = generateVisualDirections({ userRequest, productMarketingContext: ctx, stylePreference: options.stylePreference });
  const { template } = await selectBrandTemplate({ brand: ctx.brand, userRequest });
  const fallbackTemplate = template || {
    id: 'tech-product-lp', name: 'Tech Product LP',
    segments: [], bestForBrands: [], visualPersonality: ['professional'],
    recommendedPalette: { primary: '#2563eb', accent: '#f59e0b', background: '#ffffff' },
    typography: { headline: 'Inter', body: 'Inter' },
    componentStyle: { buttons: 'rounded-lg', cards: 'shadow-sm', sections: 'py-16' },
    recommendedSections: ['Hero', 'Benefits', 'CTA'], avoid: [],
  };

  const result = generateComponentFirstPlan({
    userRequest,
    productMarketingContext: ctx,
    selectedVisualDirection: recommended,
    selectedBrandTemplate: fallbackTemplate,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\nComponent-First Plan for: "${userRequest}"\n`);
    console.log(`Components: ${result.components.length}`);
    for (const comp of result.components) {
      console.log(`\n--- ${comp.name} ---`);
      console.log(`Purpose:       ${comp.purpose}`);
      console.log(`Props:         ${comp.props.join(', ')}`);
      console.log(`Visual Notes:  ${comp.visualNotes}`);
      console.log(`Copy Notes:    ${comp.copyNotes}`);
      console.log(`Accessibility: ${comp.accessibilityNotes}`);
    }
    console.log(`\nRecommended File Structure:`);
    for (const file of result.recommendedFileStructure) {
      console.log(`  ${file}`);
    }
    console.log(`\nImplementation Order:`);
    result.implementationOrder.forEach((step, i) => {
      console.log(`  ${i + 1}. ${step}`);
    });
  }

  return result;
}
