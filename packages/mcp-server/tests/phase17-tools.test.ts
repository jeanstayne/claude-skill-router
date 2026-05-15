import { describe, it, expect } from 'vitest';

describe('listImageProvidersTool', () => {
  it('should return available image providers', async () => {
    const { listImageProvidersTool } = await import('../src/tools/listImageProvidersTool.js');
    const result = await listImageProvidersTool.handler({});
    expect(result).toHaveProperty('providers');
    expect(result).toHaveProperty('count');
    expect(result.count).toBeGreaterThan(0);
    expect(Array.isArray(result.providers)).toBe(true);
  });

  it('should include gpt-image-2 and nano-banana', async () => {
    const { listImageProvidersTool } = await import('../src/tools/listImageProvidersTool.js');
    const result = await listImageProvidersTool.handler({});
    const ids = result.providers.map((p: { id: string }) => p.id);
    expect(ids).toContain('gpt-image-2');
    expect(ids).toContain('nano-banana');
  });
});

describe('recommendImageProviderTool', () => {
  it('should recommend nano-banana for agro landscape', async () => {
    const { recommendImageProviderTool } = await import('../src/tools/recommendImageProviderTool.js');
    const result = await recommendImageProviderTool.handler({
      userRequest: 'imagem de campo de soja para hero section',
    });
    expect(result).toHaveProperty('recommendedProvider');
    expect(result.recommendedProvider).toBe('nano-banana');
    expect(result).toHaveProperty('reason');
    expect(result).toHaveProperty('warnings');
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it('should recommend gpt-image-2 for ads with text', async () => {
    const { recommendImageProviderTool } = await import('../src/tools/recommendImageProviderTool.js');
    const result = await recommendImageProviderTool.handler({
      userRequest: 'criar banner com texto promocional e mockup',
    });
    expect(result).toHaveProperty('recommendedProvider');
    expect(result.recommendedProvider).toBe('gpt-image-2');
  });

  it('should recommend nano-banana for hero purpose', async () => {
    const { recommendImageProviderTool } = await import('../src/tools/recommendImageProviderTool.js');
    const result = await recommendImageProviderTool.handler({
      userRequest: 'imagem qualquer',
      purpose: 'hero',
    });
    expect(result.recommendedProvider).toBe('nano-banana');
  });

  it('should recommend gpt-image-2 for mockup purpose', async () => {
    const { recommendImageProviderTool } = await import('../src/tools/recommendImageProviderTool.js');
    const result = await recommendImageProviderTool.handler({
      userRequest: 'imagem qualquer',
      purpose: 'mockup',
    });
    expect(result.recommendedProvider).toBe('gpt-image-2');
  });
});

describe('generateImageBriefToolV2', () => {
  it('should generate brief for Destaque Agro', async () => {
    const { generateImageBriefToolV2 } = await import('../src/tools/generateImageBriefToolV2.js');
    const result = await generateImageBriefToolV2.handler({
      userRequest: 'imagem hero para landing page de consultoria agro',
      brand: 'Destaque Agro',
    });
    expect(result).toHaveProperty('brief');
    expect(result.brief).toHaveProperty('brand', 'Destaque Agro');
    expect(result.brief).toHaveProperty('objective');
    expect(result.brief).toHaveProperty('scene');
    expect(result.brief).toHaveProperty('mustInclude');
    expect(result.brief).toHaveProperty('mustAvoid');
    expect(Array.isArray(result.brief.mustInclude)).toBe(true);
    expect(Array.isArray(result.brief.mustAvoid)).toBe(true);
  });

  it('should generate brief for unknown brand', async () => {
    const { generateImageBriefToolV2 } = await import('../src/tools/generateImageBriefToolV2.js');
    const result = await generateImageBriefToolV2.handler({
      userRequest: 'imagem hero para site de tecnologia',
    });
    expect(result).toHaveProperty('brief');
    expect(result.brief).toHaveProperty('brand');
    expect(result.brief).toHaveProperty('objective');
  });
});

describe('generateImagePromptsTool', () => {
  it('should generate prompts for nano-banana', async () => {
    const { generateImagePromptsTool } = await import('../src/tools/generateImagePromptsTool.js');
    const result = await generateImagePromptsTool.handler({
      userRequest: 'hero image for agro consulting landing page',
      providerId: 'nano-banana',
      brand: 'Destaque Agro',
    });
    expect(result).toHaveProperty('provider', 'nano-banana');
    expect(result).toHaveProperty('prompts');
    expect(Array.isArray(result.prompts)).toBe(true);
    expect(result.prompts.length).toBeGreaterThan(0);
    expect(result.prompts[0]).toHaveProperty('id');
    expect(result.prompts[0]).toHaveProperty('prompt');
  });

  it('should generate prompts for gpt-image-2', async () => {
    const { generateImagePromptsTool } = await import('../src/tools/generateImagePromptsTool.js');
    const result = await generateImagePromptsTool.handler({
      userRequest: 'banner promocional',
      providerId: 'gpt-image-2',
    });
    expect(result).toHaveProperty('provider', 'gpt-image-2');
    expect(Array.isArray(result.prompts)).toBe(true);
  });
});

describe('planImageGenerationTool', () => {
  it('should run in dry-run mode by default', async () => {
    const { planImageGenerationTool } = await import('../src/tools/planImageGenerationTool.js');
    const result = await planImageGenerationTool.handler({
      projectPath: '.',
      userRequest: 'hero image for Destaque Agro landing page',
    });
    expect(result).toHaveProperty('dryRun', true);
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('recommendedProvider');
    expect(result).toHaveProperty('warnings');
  });

  it('should block execution without confirm', async () => {
    const { planImageGenerationTool } = await import('../src/tools/planImageGenerationTool.js');
    const result = await planImageGenerationTool.handler({
      projectPath: '.',
      userRequest: 'hero image',
      dryRun: false,
      confirm: false,
    });
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(result.requiresConfirm).toBe(true);
  });

  it('should include command preview for specific provider', async () => {
    const { planImageGenerationTool } = await import('../src/tools/planImageGenerationTool.js');
    const result = await planImageGenerationTool.handler({
      projectPath: '.',
      userRequest: 'hero image for agro LP',
      provider: 'nano-banana',
      dryRun: true,
    });
    expect(result).toHaveProperty('commandPreview');
  });
});
