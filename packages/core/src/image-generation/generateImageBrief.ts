import { ImageBriefV2, ImageProvider } from '../schemas/imageGenerationSchema.js';

export function generateImageBrief(
  userRequest: string,
  brand?: string,
  _provider?: ImageProvider
): ImageBriefV2 {
  const brandName = brand || 'a marca';
  const isAgro = brandName.toLowerCase().includes('destaque agro') || brandName.toLowerCase().includes('agro');

  if (isAgro) {
    return {
      objective: `Imagem hero premium para landing page da ${brandName} — consultoria estratégica para o agronegócio`,
      brand: brandName,
      audience: 'Empresários e gestores do agronegócio, produtores rurais, empresas agroindustriais',
      scene: 'Campo de soja ou lavoura do oeste da Bahia, terreno plano, pôr do sol natural, sem aparência de IA',
      composition: 'Enquadramento wide (16:9), terço esquerdo vazio para headline, ponto focal no terço direito, profundidade de campo rasa',
      environment: 'Lavoura extensa, vegetação natural, terra fértil, horizonte limpo, sem construções visíveis',
      lighting: 'Golden hour, luz natural dourada, névoa matinal suave, sem iluminação artificial',
      colorMood: 'Verdes escuros, tons terrosos quentes, dourado âmbar. NADA de azul céu ou tons frios.',
      style: 'Fotografia premium editorial, realismo limpo, profundidade atmosférica sutil, sem excesso de cinematic grading',
      mustInclude: [
        'vegetação de lavoura (soja/milho)',
        'horizonte limpo',
        'luz natural de golden hour',
        'terço esquerdo com espaço negativo',
        'textura orgânica de campo',
      ],
      mustAvoid: [
        'céu azul',
        'tons frios/azulados',
        'pessoas',
        'máquinas/tratores',
        'construções',
        'texto na imagem',
        'logotipos',
        'aparência de IA/artificial',
        'simetria forçada',
        'excesso de saturação',
      ],
      negativePrompt: 'blue sky, bright sky, harsh sunlight, people, faces, buildings, machinery, trucks, text overlay, watermark, logos, low quality, artificial lighting, cold tones, oversaturated greens, busy composition, symmetrical, centered subject, AI-looking, fake bokeh',
      usage: ['hero', 'background'],
      aspectRatios: ['16:9', '9:16', '1:1'],
    };
  }

  // Generic brand brief
  return {
    objective: `Imagem principal para ${userRequest.includes('hero') ? 'hero section' : 'site'} de ${brandName}`,
    brand: brandName,
    audience: 'Público-alvo da marca',
    scene: `Cena profissional representando o produto/serviço de ${brandName} em contexto natural de uso`,
    composition: 'Enquadramento wide (16:9), ponto focal central com espaço para copy à esquerda',
    environment: 'Ambiente profissional, limpo e contextual',
    lighting: 'Iluminação natural, soft shadows',
    colorMood: 'Cores alinhadas à identidade da marca, equilibradas e sofisticadas',
    style: 'Premium, iluminação natural, cores vibrantes mas sofisticadas, profundidade de campo',
    mustInclude: ['espaço para copy', 'contexto de uso real'],
    mustAvoid: ['texto overlay', 'logotipos', 'água digital'],
    negativePrompt: 'low quality, blurry, watermark, text overlay, distorted faces, busy background, harsh shadows, artificial lighting',
    usage: ['hero', 'background'],
    aspectRatios: ['16:9', '9:16', '1:1'],
  };
}
