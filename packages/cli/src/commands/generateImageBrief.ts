export async function generateImageBriefCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; brand?: string } = {}
) {
  const brand = options.brand || 'a marca';

  const brief = {
    objective: `Imagem principal para ${userRequest.includes('hero') ? 'hero section' : 'site'} de ${brand}`,
    scene: `Cena profissional representando o produto/serviço de ${brand} em contexto natural de uso`,
    composition: 'Enquadramento wide (16:9), ponto focal central com espaço para copy à esquerda',
    style: 'Premium, iluminação natural, cores vibrantes mas sofisticadas, profundidade de campo',
    prompt: `Professional hero image for ${brand} — wide landscape composition, natural lighting, premium quality, depth of field, centered subject with copy space on left side, high-end commercial photography style`,
    negativePrompt: 'low quality, blurry, watermark, text overlay, distorted faces, busy background, harsh shadows, artificial lighting',
    formats: ['16:9 (hero desktop)', '9:16 (stories/mobile hero)', '1:1 (social feed)'],
  };

  if (options.json) {
    console.log(JSON.stringify({
      brief,
      recommendedExternalSkills: ['gpt-image-2', 'ai-image-generation', 'canvas-design'],
      requiresExternalExecution: true,
      requiresConfirm: true,
      warnings: [
        'Skills de geração de imagem (gpt-image-2, ai-image-generation) requerem CLI/login externo.',
        'Este brief é apenas referência. Para gerar a imagem, use um gerador externo manualmente.',
      ],
    }, null, 2));
  } else {
    console.log(`Image Brief for: "${userRequest}"\n`);
    console.log(`Brand: ${brand}`);
    console.log(`Objective: ${brief.objective}`);
    console.log(`Scene: ${brief.scene}`);
    console.log(`Composition: ${brief.composition}`);
    console.log(`Style: ${brief.style}`);
    console.log(`\nPrompt: ${brief.prompt}`);
    console.log(`Negative: ${brief.negativePrompt}`);
    console.log(`Formats: ${brief.formats.join(', ')}`);
    console.log('\nWARNING: Brief only. Do NOT auto-execute image generation.');
  }

  return { brief, requiresExternalExecution: true, requiresConfirm: true };
}
