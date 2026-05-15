import { ImagePrompt, ImageBriefV2 } from '../schemas/imageGenerationSchema.js';

export function generateImagePrompts(
  brief: ImageBriefV2,
  providerId: 'gpt-image-2' | 'nano-banana'
): ImagePrompt[] {
  const prompts: ImagePrompt[] = [];

  const formatSpecs: Array<{ id: string; aspectRatio: string; usage: string }> = [
    { id: 'hero-desktop', aspectRatio: '16:9', usage: 'hero' },
    { id: 'hero-mobile', aspectRatio: '9:16', usage: 'hero' },
    { id: 'card-background', aspectRatio: '4:3', usage: 'section' },
    { id: 'social-stories', aspectRatio: '9:16', usage: 'social' },
    { id: 'ad-square', aspectRatio: '1:1', usage: 'ad' },
  ];

  const isAgro = brief.brand.toLowerCase().includes('agro');

  for (const spec of formatSpecs) {
    let prompt: string;
    let negative: string;

    if (isAgro) {
      prompt = buildAgroPrompt(spec, providerId, brief);
      negative = brief.negativePrompt || buildAgroNegative();
    } else {
      prompt = buildGenericPrompt(spec, providerId, brief);
      negative = brief.negativePrompt || 'low quality, blurry, watermark, text overlay, artificial lighting';
    }

    prompts.push({
      id: spec.id,
      provider: providerId,
      aspectRatio: spec.aspectRatio,
      prompt,
      negativePrompt: negative,
      usage: spec.usage,
    });
  }

  return prompts;
}

function buildAgroPrompt(
  spec: { id: string; aspectRatio: string; usage: string },
  providerId: string,
  _brief: ImageBriefV2
): string {
  const base = `Professional agricultural landscape photography, golden hour lighting, vast soybean field with soft morning mist, rich dark greens and warm earthy tones, shallow depth of field blurring distant treeline`;

  const compositionByFormat: Record<string, string> = {
    'hero-desktop': 'empty left third of frame for text overlay, premium editorial style, no sky visible or minimal sky at top, natural warm color grading, 16:9 aspect ratio, shot on professional DSLR 85mm lens',
    'hero-mobile': 'vertical composition 9:16, top third empty for headline, bottom has rich crop texture, mobile-first framing',
    'card-background': 'tighter crop, macro detail of crop leaves with morning dew, abstract organic texture, subtle enough for text overlay at 50% opacity overlay, 4:3 ratio',
    'social-stories': 'vertical 9:16, dramatic golden hour light rays through crops, editorial lifestyle feel, space for text overlay at top and bottom',
    'ad-square': 'square 1:1 composition, centered rich crop detail, balanced negative space around edges for ad copy, warm premium feel',
  };

  const extras = compositionByFormat[spec.id] || compositionByFormat['hero-desktop'];
  let prompt = `${base}, ${extras}`;

  if (providerId === 'nano-banana') {
    prompt += ', west Bahia Brazil farmland, flat terrain, natural sunset';
  } else {
    prompt += ', high-end commercial photography, magazine editorial quality';
  }

  prompt += '. CRITICAL: No blue sky. No cool tones. Only dark greens, warm earthy browns, golden amber.';

  return prompt;
}

function buildAgroNegative(): string {
  return 'blue sky, bright sky, harsh sunlight, people, faces, buildings, machinery, trucks, text overlay, watermark, logos, low quality, artificial lighting, cold tones, oversaturated greens, busy composition, symmetrical, centered subject, AI-looking, fake bokeh, drone shot';
}

function buildGenericPrompt(
  spec: { id: string; aspectRatio: string; usage: string },
  providerId: string,
  brief: ImageBriefV2
): string {
  const brand = brief.brand;
  const compositionByFormat: Record<string, string> = {
    'hero-desktop': 'wide landscape composition, natural lighting, premium quality, depth of field, copy space on left side, high-end commercial photography style',
    'hero-mobile': 'vertical 9:16 composition, copy space at top, premium quality',
    'card-background': 'abstract subtle texture, low contrast, 4:3 ratio, text-safe area',
    'social-stories': 'vertical 9:16, lifestyle feel, space for overlay text',
    'ad-square': 'square 1:1, balanced negative space, ad-copy safe',
  };

  const extras = compositionByFormat[spec.id] || compositionByFormat['hero-desktop'];
  return `Professional hero image for ${brand} — ${extras}, ${spec.aspectRatio} aspect ratio`;
}
