import { ImageProvider } from '../schemas/imageGenerationSchema.js';
import { loadImageProviders } from './loadImageProviders.js';

export function recommendImageProvider(
  userRequest: string,
  purpose?: string
): { provider: ImageProvider; reason: string } | null {
  const providers = loadImageProviders();
  if (providers.length === 0) return null;

  const request = userRequest.toLowerCase();

  // gpt-image-2 for text-heavy, mockups, ads, brand-safe images
  const gptTriggers = [
    'texto', 'mockup', 'ad', 'anúncio', 'banner com texto',
    'logo', 'brand', 'marca com texto', 'sinalização',
  ];
  // nano-banana for photorealistic, cinematic, agro, lifestyle
  const nanoTriggers = [
    'fotorealista', 'cinematic', 'campo', 'lavoura', 'agro',
    'fazenda', 'lifestyle', 'cena real', 'paisagem', 'natureza',
    'golden hour', 'hero', 'background',
  ];

  const gptScore = gptTriggers.filter(t => request.includes(t)).length;
  const nanoScore = nanoTriggers.filter(t => request.includes(t)).length;

  // Default by purpose
  if (purpose === 'mockup' || purpose === 'ad') {
    const gpt = providers.find(p => p.id === 'gpt-image-2');
    if (gpt) return { provider: gpt, reason: 'GPT Image 2 recomendado para mockups, ads e imagens com texto controlado' };
  }
  if (purpose === 'hero' || purpose === 'background') {
    const nano = providers.find(p => p.id === 'nano-banana');
    if (nano) return { provider: nano, reason: 'Nano Banana recomendado para hero fotorealista, paisagens e cenas cinematográficas' };
  }

  if (nanoScore > gptScore) {
    const nano = providers.find(p => p.id === 'nano-banana');
    if (nano) return { provider: nano, reason: 'Nano Banana recomendado para cenas fotorealistas e visuais agro/cinematográficos' };
  }

  const gpt = providers.find(p => p.id === 'gpt-image-2');
  if (gpt) return { provider: gpt, reason: 'GPT Image 2 recomendado para visuais brand-safe com controle preciso' };

  return { provider: providers[0], reason: 'Provider disponível para esta tarefa' };
}
