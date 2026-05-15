import { describe, it, expect } from 'vitest';

describe('CLI Phase 17 commands', () => {
  it('should have imageProvidersList command', async () => {
    const { imageProvidersListCommand } = await import('../src/commands/imageProvidersList.js');
    expect(imageProvidersListCommand).toBeDefined();
    expect(typeof imageProvidersListCommand).toBe('function');
  });

  it('should have imageProviderRecommend command', async () => {
    const { imageProviderRecommendCommand } = await import('../src/commands/imageProviderRecommend.js');
    expect(imageProviderRecommendCommand).toBeDefined();
    expect(typeof imageProviderRecommendCommand).toBe('function');
  });

  it('should have imageBriefV2 command', async () => {
    const { imageBriefCommand } = await import('../src/commands/imageBriefV2.js');
    expect(imageBriefCommand).toBeDefined();
    expect(typeof imageBriefCommand).toBe('function');
  });

  it('should have imagePrompts command', async () => {
    const { imagePromptsCommand } = await import('../src/commands/imagePrompts.js');
    expect(imagePromptsCommand).toBeDefined();
    expect(typeof imagePromptsCommand).toBe('function');
  });

  it('should have imagePlan command', async () => {
    const { imagePlanCommand } = await import('../src/commands/imagePlan.js');
    expect(imagePlanCommand).toBeDefined();
    expect(typeof imagePlanCommand).toBe('function');
  });
});

// Cross-package schema validation
describe('Image Generation schemas (CLI-side validation)', () => {
  it('should export ImageGenerationInputSchema with dryRun and confirm defaults', async () => {
    const { ImageGenerationInputSchema } = await import('../../core/src/schemas/imageGenerationSchema.js');
    const input = {
      projectPath: '/test',
      userRequest: 'test image',
    };
    const result = ImageGenerationInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dryRun).toBe(true);
      expect(result.data.confirm).toBe(false);
    }
  });

  it('should export ImageGenerationPlanSchema', async () => {
    const { ImageGenerationPlanSchema } = await import('../../core/src/schemas/imageGenerationSchema.js');
    const plan = {
      success: true,
      provider: 'nano-banana',
      recommendedProvider: 'nano-banana',
      requiresExternalExecution: true,
      requiresConfirm: false,
      dryRun: true,
      warnings: [],
      brief: {
        objective: 'Test',
        brand: 'Test',
        scene: 'Test',
        composition: 'Test',
        style: 'Test',
      },
      prompts: [{
        id: 'test',
        provider: 'nano-banana',
        aspectRatio: '16:9',
        prompt: 'test prompt',
        usage: 'test',
      }],
    };
    const result = ImageGenerationPlanSchema.safeParse(plan);
    expect(result.success).toBe(true);
  });
});
