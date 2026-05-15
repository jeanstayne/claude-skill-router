export async function designTokensCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; stylePreference?: string } = {}
) {
  const { createProductMarketingContext } = await import('@claude-skill-router/core/lovable-pipeline/createProductMarketingContext');
  const { generateVisualDirections } = await import('@claude-skill-router/core/lovable-pipeline/generateVisualDirections');
  const { selectBrandTemplate } = await import('@claude-skill-router/core/lovable-pipeline/selectBrandTemplate');
  const { classifyIntent } = await import('@claude-skill-router/core/router/classifyIntent');
  const { generateDesignTokensPlan } = await import('@claude-skill-router/core/design-system-enforcer/generateDesignTokensPlan');
  const { generateShadcnVariantPlan } = await import('@claude-skill-router/core/design-system-enforcer/generateShadcnVariantPlan');

  const { intent } = classifyIntent({ userRequest, signals: { visualStyle: [], businessGoal: [], keywords: [], mentionsDesignEngine: [], mentionsStack: [], confidence: 0 } });

  const productMarketingContext = createProductMarketingContext({ userRequest });

  const { recommended } = generateVisualDirections({
    userRequest,
    productMarketingContext,
    stylePreference: options.stylePreference,
  });

  const { template } = await selectBrandTemplate({
    brand: productMarketingContext.brand,
    intent,
    userRequest,
  });

  const defaultTemplate = {
    id: 'default',
    name: 'Default',
    segments: [],
    bestForBrands: [],
    visualPersonality: ['clean'],
    recommendedPalette: { primary: '#2563eb', accent: '#f59e0b', background: '#ffffff' },
    typography: { headline: 'Inter', body: 'Inter' },
    componentStyle: { buttons: 'rounded-lg', cards: 'shadow-sm', sections: 'py-16' },
    recommendedSections: [],
    avoid: [],
  };

  const brandTemplate = template ?? defaultTemplate;
  const visualDirection = recommended;

  const tokenPlan = generateDesignTokensPlan(brandTemplate, visualDirection);
  const shadcnPlan = generateShadcnVariantPlan(brandTemplate);

  const result = { tokenPlan, shadcnPlan };

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\n=== Design Tokens + shadcn/ui Plan ===\n`);
    console.log(`Project: ${projectPath}`);
    console.log(`Brand: ${brandTemplate.name}`);
    console.log(`Direction: ${visualDirection.name}`);
    console.log(`\n--- Color Tokens ---`);
    for (const t of tokenPlan.colors.tokens) {
      console.log(`  ${t.name}: ${t.value} — ${t.description}`);
    }
    console.log(`\n--- Gradients ---`);
    for (const t of tokenPlan.gradients.tokens) {
      console.log(`  ${t.name}: ${t.description}`);
    }
    console.log(`\n--- Shadows ---`);
    for (const t of tokenPlan.shadows.tokens) {
      console.log(`  ${t.name}: ${t.value} — ${t.description}`);
    }
    console.log(`\n--- Radius ---`);
    for (const t of tokenPlan.radius.tokens) {
      console.log(`  ${t.name}: ${t.value} — ${t.description}`);
    }
    console.log(`\n--- Motion ---`);
    for (const t of tokenPlan.motion.tokens) {
      console.log(`  ${t.name}: ${t.value} — ${t.description}`);
    }
    console.log(`\n--- Typography ---`);
    for (const t of tokenPlan.typography.tokens) {
      console.log(`  ${t.name}: ${t.value} — ${t.description}`);
    }
    console.log(`\n--- shadcn/ui Variants (${shadcnPlan.length} components) ---`);
    for (const comp of shadcnPlan) {
      console.log(`  ${comp.component} (${comp.variants.length} variants):`);
      for (const v of comp.variants) {
        console.log(`    ${v.name}`);
      }
    }
    console.log('');
  }

  return result;
}
