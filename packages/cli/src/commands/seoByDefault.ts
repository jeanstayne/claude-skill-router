export async function seoByDefaultCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean } = {}
) {
  const { createProductMarketingContext } = await import('@claude-skill-router/core/lovable-pipeline/createProductMarketingContext');
  const { runSeoByDefault } = await import('@claude-skill-router/core/seo-by-default/runSeoByDefault');

  const ctx = createProductMarketingContext({ userRequest });

  const result = await runSeoByDefault(projectPath, ctx);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\n=== SEO by Default ===\n`);
    console.log(`Project: ${projectPath}`);
    console.log(`Brand: ${ctx.brand}`);
    console.log(`Offer: ${ctx.productOrService}`);
    console.log(`\n--- Title ---`);
    console.log(`"${result.seoPlan.title.content}" (${result.seoPlan.title.currentLength} chars, max ${result.seoPlan.title.maxLength})`);
    console.log(`\n--- Meta Description ---`);
    console.log(`"${result.seoPlan.metaDescription.content}" (${result.seoPlan.metaDescription.currentLength} chars, max ${result.seoPlan.metaDescription.maxLength})`);
    console.log(`\n--- Open Graph ---`);
    console.log(`og:title: "${result.seoPlan.ogTitle.content}"`);
    console.log(`og:description: "${result.seoPlan.ogDescription.content}"`);
    console.log(`og:image: ${result.seoPlan.ogImage.content}`);
    console.log(`og:type: ${result.seoPlan.ogType.content}`);
    console.log(`\n--- Twitter ---`);
    console.log(`twitter:card: ${result.seoPlan.twitterCard.content}`);
    console.log(`\n--- JSON-LD (${result.jsonLdPlan.blocks.length} blocks) ---`);
    for (const block of result.jsonLdPlan.blocks) {
      console.log(`  [${block.priority}] ${block.type} → inject in <${block.injectLocation}>`);
    }
    console.log(`\n--- Missing Tags ---`);
    if (result.missingTags.length === 0) {
      console.log(`  Todas tags SEO encontradas.`);
    } else {
      for (const tag of result.missingTags) {
        console.log(`  ! ${tag}`);
      }
    }
    console.log(`\n--- Semantic HTML Checklist ---`);
    for (const item of result.semanticHtmlChecklist.checklist.filter(i => i.severity === 'high')) {
      console.log(`  [${item.severity}] ${item.description}`);
    }
    console.log(`  ... (${result.semanticHtmlChecklist.checklist.length} items total)`);
    if (result.seoPlan.warnings.length > 0) {
      console.log(`\n--- Warnings ---`);
      for (const w of result.seoPlan.warnings) {
        console.log(`  ! ${w}`);
      }
    }
    console.log('');
  }

  return result;
}
