export async function imagePromptsCommand(
  userRequest: string,
  options: { json?: boolean; brand?: string; provider?: string } = {}
) {
  const { generateImageBrief } = await import('@claude-skill-router/core/image-generation/generateImageBrief');
  const { generateImagePrompts } = await import('@claude-skill-router/core/image-generation/generateImagePrompts');

  const providerId = (options.provider || 'nano-banana') as 'gpt-image-2' | 'nano-banana';
  const brief = generateImageBrief(userRequest, options.brand);
  const prompts = generateImagePrompts(brief, providerId);

  if (options.json) {
    console.log(JSON.stringify({
      provider: providerId,
      prompts,
      count: prompts.length,
      requiresExternalExecution: true,
      requiresConfirm: true,
    }, null, 2));
  } else {
    console.log(`\n=== Image Prompts (${providerId}) ===\n`);
    for (const p of prompts) {
      console.log(`--- ${p.id} (${p.aspectRatio}, ${p.usage}) ---`);
      console.log(`Prompt: ${p.prompt}`);
      console.log(`Negative: ${p.negativePrompt}`);
      console.log('');
    }
    console.log('WARNING: These prompts are for reference. Do NOT auto-execute generation.');
    console.log('');
  }

  return { prompts, requiresExternalExecution: true, requiresConfirm: true };
}
