import { describe, it, expect } from 'vitest';
import { ImageProviderSchema, ImageBriefSchemaV2, ImagePromptSchema, ImageGenerationInputSchema, ImageGenerationPlanSchema, ImageGenerationResultSchema } from '../src/schemas/imageGenerationSchema.js';

describe('ImageProviderSchema', () => {
  it('should validate a valid provider', () => {
    const provider = {
      id: 'nano-banana',
      name: 'Nano Banana',
      category: 'image-generation' as const,
      provider: 'google',
      bestFor: ['fotorealista', 'paisagem', 'hero', 'agro'],
      supports: { textToImage: true, imageToImage: false, multiReference: false, transparentBackground: false },
      requiresExternalExecution: true,
      requiresNetwork: true,
      requiresApiKey: true,
      envVars: ['GEMINI_API_KEY'],
      autoExecuteAllowed: false as const,
      dryRunDefault: true as const,
      riskLevel: 'high' as const,
      notes: 'Use only with explicit confirmation.',
    };
    const result = ImageProviderSchema.safeParse(provider);
    expect(result.success).toBe(true);
  });

  it('should reject provider without id', () => {
    const result = ImageProviderSchema.safeParse({ name: 'Test' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid riskLevel', () => {
    const result = ImageProviderSchema.safeParse({
      id: 'test',
      name: 'Test',
      category: 'image-generation',
      supplier: 'test',
      supports: {},
      bestFor: [],
      requiresExternalExecution: false,
      requiresNetwork: false,
      requiresApiKey: false,
      envVars: [],
      autoExecuteAllowed: false,
      dryRunDefault: true,
      riskLevel: 'unknown',
    });
    expect(result.success).toBe(false);
  });
});

describe('ImageBriefSchemaV2', () => {
  it('should validate a complete brief', () => {
    const brief = {
      objective: 'Criar imagem hero premium para landing page de consultoria agro',
      brand: 'Destaque Agro',
      scene: 'Campo de soja no oeste da Bahia durante golden hour',
      composition: 'Terço esquerdo vazio para headline, horizonte limpo',
      style: 'Fotorealista editorial, tons quentes, sem céu azul',
      audience: 'Empresários do agronegócio',
      environment: 'Campo de soja no oeste da Bahia',
      lighting: 'Golden hour',
      colorMood: 'Tons quentes, verdes escuros, sem céu azul',
      mustInclude: ['lavoura', 'horizonte limpo', 'espaço negativo'],
      mustAvoid: ['céu azul', 'pessoas', 'máquinas'],
      negativePrompt: 'blue sky, people, buildings, machinery',
      aspectRatios: ['16:9', '9:16'],
      usage: ['hero'],
    };
    const result = ImageBriefSchemaV2.safeParse(brief);
    expect(result.success).toBe(true);
  });

  it('should validate brief with only required fields', () => {
    const brief = {
      objective: 'Hero image for site',
      brand: 'Destaque Agro',
      scene: 'Agricultural field',
      composition: 'Left third negative space',
      style: 'Photorealistic editorial',
    };
    const result = ImageBriefSchemaV2.safeParse(brief);
    expect(result.success).toBe(true);
  });
});

describe('ImagePromptSchema', () => {
  it('should validate a prompt', () => {
    const prompt = {
      id: 'hero-desktop',
      provider: 'nano-banana' as const,
      aspectRatio: '16:9',
      prompt: 'Agricultural landscape at golden hour',
      usage: 'Hero section desktop',
    };
    const result = ImagePromptSchema.safeParse(prompt);
    expect(result.success).toBe(true);
  });

  it('should reject invalid provider', () => {
    const prompt = {
      id: 'test',
      provider: 'unknown-provider',
      aspectRatio: '16:9',
      prompt: 'test',
      usage: 'test',
    };
    const result = ImagePromptSchema.safeParse(prompt);
    expect(result.success).toBe(false);
  });
});

describe('ImageGenerationInputSchema', () => {
  it('should validate minimal input with defaults', () => {
    const input = {
      projectPath: '/test/project',
      userRequest: 'hero image for landing page',
    };
    const result = ImageGenerationInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dryRun).toBe(true);
      expect(result.data.confirm).toBe(false);
    }
  });

  it('should allow optional fields', () => {
    const input = {
      projectPath: '/test/project',
      userRequest: 'hero image',
      brand: 'Destaque Agro',
      provider: 'nano-banana' as const,
      purpose: 'hero' as const,
      dryRun: false,
      confirm: true,
    };
    const result = ImageGenerationInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

describe('ImageGenerationPlanSchema', () => {
  it('should validate a plan from dry-run', () => {
    const plan = {
      success: true,
      provider: 'nano-banana',
      brief: {
        objective: 'Hero image',
        brand: 'Destaque Agro',
        scene: 'Farmland at golden hour',
        composition: 'Left third empty',
        style: 'Photorealistic',
      },
      prompts: [{
        id: 'hero-desktop',
        provider: 'nano-banana' as const,
        aspectRatio: '16:9',
        prompt: 'Agricultural landscape',
        usage: 'Hero desktop',
      }],
      recommendedProvider: 'nano-banana',
      requiresExternalExecution: true,
      requiresConfirm: false,
      dryRun: true,
      warnings: ['Provider requires GEMINI_API_KEY env var'],
    };
    const result = ImageGenerationPlanSchema.safeParse(plan);
    expect(result.success).toBe(true);
  });
});

describe('ImageGenerationResultSchema', () => {
  it('should validate a generation result', () => {
    const result = {
      success: true,
      provider: 'nano-banana',
      message: 'Image generated successfully',
      generatedFiles: ['/output/hero-desktop.png'],
    };
    const parsed = ImageGenerationResultSchema.safeParse(result);
    expect(parsed.success).toBe(true);
  });

  it('should validate a failed result', () => {
    const result = {
      success: false,
      provider: 'none',
      message: 'Execution blocked: confirm required',
      error: 'API key not configured',
    };
    const parsed = ImageGenerationResultSchema.safeParse(result);
    expect(parsed.success).toBe(true);
  });
});
