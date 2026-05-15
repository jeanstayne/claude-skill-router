export async function visualDirectionsCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; stylePreference?: string } = {}
) {
  const { createProductMarketingContext } = await import('@claude-skill-router/core/lovable-pipeline/createProductMarketingContext');
  const { generateVisualDirections } = await import('@claude-skill-router/core/lovable-pipeline/generateVisualDirections');

  const ctx = createProductMarketingContext({ userRequest });
  const result = generateVisualDirections({ userRequest, productMarketingContext: ctx, stylePreference: options.stylePreference });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\nVisual Directions for: "${userRequest}"\n`);
    for (const dir of result.directions) {
      const star = dir.id === result.recommended.id ? ' [RECOMMENDED]' : '';
      console.log(`=== ${dir.name}${star} ===`);
      console.log(`Summary:        ${dir.summary}`);
      console.log(`Mood:           ${dir.mood.join(', ')}`);
      console.log(`Color:          ${dir.colorStrategy}`);
      console.log(`Typography:     ${dir.typographyStrategy}`);
      console.log(`Layout:         ${dir.layoutStrategy}`);
      console.log(`Image Style:    ${dir.imageStyle}`);
      console.log(`Motion:         ${dir.motionStyle}`);
      console.log(`Component:      ${dir.componentStyle}`);
      console.log(`Best For:       ${dir.bestFor.join('; ')}`);
      console.log(`Avoid:          ${dir.avoid.join(', ')}`);
      console.log('');
    }
  }

  return result;
}
