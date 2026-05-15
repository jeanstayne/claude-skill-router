export async function brandTemplateCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; brand?: string; projectType?: string; intent?: string } = {}
) {
  const { selectBrandTemplate } = await import('@claude-skill-router/core/lovable-pipeline/selectBrandTemplate');

  const result = await selectBrandTemplate({
    brand: options.brand,
    projectType: options.projectType,
    intent: options.intent,
    userRequest,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\nBrand Template for: "${userRequest}"\n`);
    console.log(`Template ID:   ${result.templateId}`);
    console.log(`Confidence:    ${(result.confidence * 100).toFixed(0)}%`);
    if (result.template) {
      console.log(`Name:          ${result.template.name}`);
      console.log(`Segments:      ${result.template.segments.join(', ')}`);
      console.log(`Personality:   ${result.template.visualPersonality.join(', ')}`);
      console.log(`Palette:       primary=${result.template.recommendedPalette.primary}, accent=${result.template.recommendedPalette.accent}, bg=${result.template.recommendedPalette.background}`);
      console.log(`Typography:    headline=${result.template.typography.headline}, body=${result.template.typography.body}`);
      console.log(`Sections:      ${result.template.recommendedSections.join(' → ')}`);
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
