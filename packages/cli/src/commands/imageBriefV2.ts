export async function imageBriefCommand(
  userRequest: string,
  options: { json?: boolean; brand?: string; provider?: string } = {}
) {
  const { generateImageBrief } = await import('@claude-skill-router/core/image-generation/generateImageBrief');

  const brief = generateImageBrief(userRequest, options.brand);

  if (options.json) {
    console.log(JSON.stringify({
      brief,
      provider: options.provider || 'auto',
      requiresExternalExecution: true,
      requiresConfirm: true,
      warnings: [
        'AVISO: Este brief é apenas referência. Para gerar a imagem, use um provider externo manualmente.',
        'Nunca execute geração externa automaticamente.',
      ],
    }, null, 2));
  } else {
    const brandName = options.brand || 'a marca';
    console.log(`\n=== Image Brief ===\n`);
    console.log(`Brand: ${brandName}`);
    console.log(`Provider: ${options.provider || '(auto-recommend)'}`);
    console.log(`\nObjective: ${brief.objective}`);
    console.log(`Audience: ${brief.audience}`);
    console.log(`Scene: ${brief.scene}`);
    console.log(`Composition: ${brief.composition}`);
    console.log(`Environment: ${brief.environment}`);
    console.log(`Lighting: ${brief.lighting}`);
    console.log(`Color Mood: ${brief.colorMood}`);
    console.log(`Style: ${brief.style}`);
    console.log(`\nMust Include: ${brief.mustInclude.join(', ')}`);
    console.log(`Must Avoid: ${brief.mustAvoid.join(', ')}`);
    console.log(`Negative Prompt: ${brief.negativePrompt}`);
    console.log(`Formats: ${brief.aspectRatios.join(', ')}`);
    console.log(`Usage: ${brief.usage.join(', ')}`);
    console.log(`\nWARNING: Brief only. Do NOT auto-execute image generation.`);
    console.log('');
  }

  return { brief, requiresExternalExecution: true, requiresConfirm: true };
}
