import {
  ImageGenerationInput,
  ImageGenerationPlan,
  ImageGenerationPlanSchema,
} from '../schemas/imageGenerationSchema.js';
import { loadImageProviders } from './loadImageProviders.js';
import { recommendImageProvider } from './recommendImageProvider.js';
import { generateImageBrief } from './generateImageBrief.js';
import { generateImagePrompts } from './generateImagePrompts.js';
import { generateProviderCommandPreview } from './generateProviderCommandPreview.js';

export function runImageGenerationPlan(input: ImageGenerationInput): ImageGenerationPlan {
  const warnings: string[] = [];
  const providers = loadImageProviders();

  if (providers.length === 0) {
    return {
      success: false,
      provider: 'none',
      brief: {
        objective: '',
        brand: input.brand || '',
        audience: '',
        scene: '',
        composition: '',
        environment: '',
        lighting: '',
        colorMood: '',
        style: '',
        mustInclude: [],
        mustAvoid: [],
        negativePrompt: '',
        usage: [],
        aspectRatios: [],
      },
      prompts: [],
      recommendedProvider: 'none',
      requiresExternalExecution: false,
      requiresConfirm: false,
      dryRun: input.dryRun,
      warnings: ['Nenhum image provider encontrado no registry.'],
    };
  }

  // 1. Recommend provider
  const recommendation = recommendImageProvider(
    input.userRequest,
    input.purpose || undefined
  );

  const providerId = input.provider || recommendation?.provider.id || providers[0].id;
  const provider = providers.find(p => p.id === providerId);

  if (!provider) {
    return {
      success: false,
      provider: providerId,
      brief: {
        objective: '',
        brand: input.brand || '',
        audience: '',
        scene: '',
        composition: '',
        environment: '',
        lighting: '',
        colorMood: '',
        style: '',
        mustInclude: [],
        mustAvoid: [],
        negativePrompt: '',
        usage: [],
        aspectRatios: [],
      },
      prompts: [],
      recommendedProvider: recommendation?.provider.id || 'unknown',
      requiresExternalExecution: true,
      requiresConfirm: true,
      dryRun: input.dryRun,
      warnings: [`Provider "${providerId}" não encontrado. Providers disponíveis: ${providers.map(p => p.id).join(', ')}`],
    };
  }

  // 2. Generate brief
  const brief = generateImageBrief(input.userRequest, input.brand, provider);

  // 3. Generate prompts
  const prompts = generateImagePrompts(brief, providerId as 'gpt-image-2' | 'nano-banana');

  // 4. Generate command preview (for first hero prompt)
  const heroPrompt = prompts.find(p => p.id === 'hero-desktop') || prompts[0];
  const outputPath = `./public/images/${(input.brand || 'brand').toLowerCase().replace(/\s+/g, '-')}/hero-desktop.png`;
  const { command: commandPreview, warnings: cmdWarnings } = generateProviderCommandPreview(
    providerId,
    heroPrompt.prompt,
    outputPath,
  );
  warnings.push(...cmdWarnings);

  // High-risk provider warning
  if (provider.riskLevel === 'high') {
    warnings.push(`AVISO: ${provider.name} é um provider de alto risco. Requer execução externa com API key. Nunca execute sem confirmação explícita.`);
  }

  // API key check
  if (provider.requiresApiKey) {
    const allMissing = provider.envVars.every(v => !process.env[v]);
    if (allMissing) {
      warnings.push(`Nenhuma variável de ambiente configurada para ${provider.name}. Variáveis esperadas: ${provider.envVars.join(', ')}.`);
    }
  }

  const plan: ImageGenerationPlan = {
    success: true,
    provider: providerId,
    brief,
    prompts,
    recommendedProvider: recommendation?.provider.id || providerId,
    requiresExternalExecution: provider.requiresExternalExecution,
    requiresConfirm: provider.requiresExternalExecution,
    dryRun: input.dryRun,
    warnings,
    commandPreview,
  };

  return ImageGenerationPlanSchema.parse(plan);
}
