import { describe, it, expect } from 'vitest';
import * as path from 'node:path';

const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../../fixtures');
const LP_FIXTURE = path.join(FIXTURES_DIR, 'react-vite-tailwind-lp');

describe('recommendExternalSkillsTool', () => {
  it('should recommend skills based on user request', async () => {
    const { recommendExternalSkillsTool } = await import('../src/tools/recommendExternalSkillsTool.js');
    const result = await recommendExternalSkillsTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'melhore as headlines da landing page',
      maxResults: 5,
    });
    expect(result.externalSkills).toBeDefined();
    expect(Array.isArray(result.externalSkills)).toBe(true);
    expect(result.warnings).toBeDefined();
    expect(result.note).toBeDefined();
  });

  it('should return valid structure', async () => {
    const { recommendExternalSkillsTool } = await import('../src/tools/recommendExternalSkillsTool.js');
    const result = await recommendExternalSkillsTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'test',
    });
    expect(Array.isArray(result.externalSkills)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(typeof result.note).toBe('string');
  });
});

describe('listExternalSkillsTool', () => {
  it('should list all external skills', async () => {
    const { listExternalSkillsTool } = await import('../src/tools/listExternalSkillsTool.js');
    const result = await listExternalSkillsTool.handler({});
    expect(result.skills).toBeDefined();
    expect(Array.isArray(result.skills)).toBe(true);
    expect(typeof result.total).toBe('number');
  });

  it('should filter by category', async () => {
    const { listExternalSkillsTool } = await import('../src/tools/listExternalSkillsTool.js');
    const result = await listExternalSkillsTool.handler({ category: 'marketing' });
    expect(result.skills.length).toBeGreaterThan(0);
    for (const skill of result.skills) {
      expect(skill.category).toBe('marketing');
    }
  });

  it('should filter by riskLevel', async () => {
    const { listExternalSkillsTool } = await import('../src/tools/listExternalSkillsTool.js');
    const result = await listExternalSkillsTool.handler({ riskLevel: 'high' });
    for (const skill of result.skills) {
      expect(skill.riskLevel).toBe('high');
    }
  });

  it('should return consistent total count', async () => {
    const { listExternalSkillsTool } = await import('../src/tools/listExternalSkillsTool.js');
    const result = await listExternalSkillsTool.handler({});
    expect(result.total).toBe(result.skills.length);
  });
});

describe('generateImageBriefTool', () => {
  it('should generate an image brief', async () => {
    const { generateImageBriefTool } = await import('../src/tools/generateImageBriefTool.js');
    const result = await generateImageBriefTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'hero da landing page',
      brand: 'TestBrand',
    });
    expect(result.brief).toBeDefined();
    expect(result.brief.objective).toBeTruthy();
    expect(result.brief.prompt).toBeTruthy();
    expect(result.requiresExternalExecution).toBe(true);
    expect(result.requiresConfirm).toBe(true);
  });

  it('should include warnings about external execution', async () => {
    const { generateImageBriefTool } = await import('../src/tools/generateImageBriefTool.js');
    const result = await generateImageBriefTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'hero',
    });
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('AVISO');
  });

  it('should return recommended external skills', async () => {
    const { generateImageBriefTool } = await import('../src/tools/generateImageBriefTool.js');
    const result = await generateImageBriefTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'banner',
    });
    expect(result.recommendedExternalSkills).toContain('gpt-image-2');
    expect(result.recommendedExternalSkills).toContain('ai-image-generation');
  });

  it('should never auto-execute', async () => {
    const { generateImageBriefTool } = await import('../src/tools/generateImageBriefTool.js');
    const result = await generateImageBriefTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'hero',
    });
    expect(result.requiresConfirm).toBe(true);
    expect(result.brief).not.toHaveProperty('imageUrl');
    expect(result.brief).not.toHaveProperty('generatedImage');
  });
});

describe('generateCopyVariantsTool', () => {
  it('should generate copy variants', async () => {
    const { generateCopyVariantsTool } = await import('../src/tools/generateCopyVariantsTool.js');
    const result = await generateCopyVariantsTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP de vendas',
      variantCount: 3,
    });
    expect(result.headlines.length).toBe(3);
    expect(result.subheadlines.length).toBeGreaterThan(0);
    expect(result.ctas.length).toBeGreaterThan(0);
    expect(result.angles.length).toBeGreaterThan(0);
    expect(result.requiresExternalExecution).toBe(false);
  });

  it('should respect variantCount parameter', async () => {
    const { generateCopyVariantsTool } = await import('../src/tools/generateCopyVariantsTool.js');
    const result = await generateCopyVariantsTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP',
      variantCount: 7,
    });
    expect(result.headlines.length).toBe(7);
  });

  it('should default to 5 variants', async () => {
    const { generateCopyVariantsTool } = await import('../src/tools/generateCopyVariantsTool.js');
    const result = await generateCopyVariantsTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP',
    });
    expect(result.headlines.length).toBe(5);
  });
});

describe('generateMarketingPlanTool', () => {
  it('should generate a marketing plan', async () => {
    const { generateMarketingPlanTool } = await import('../src/tools/generateMarketingPlanTool.js');
    const result = await generateMarketingPlanTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'lançamento de produto SaaS',
    });
    expect(result.plan).toBeDefined();
    expect(result.plan.offer).toBeTruthy();
    expect(result.plan.channels.length).toBeGreaterThan(0);
    expect(result.plan.ads.length).toBeGreaterThan(0);
    expect(result.plan.social.length).toBeGreaterThan(0);
    expect(result.plan.email.length).toBeGreaterThan(0);
    expect(result.plan.launch).toBeDefined();
    expect(result.plan.assets.length).toBeGreaterThan(0);
  });

  it('should recommend external skills', async () => {
    const { generateMarketingPlanTool } = await import('../src/tools/generateMarketingPlanTool.js');
    const result = await generateMarketingPlanTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'campanha',
    });
    expect(result.recommendedExternalSkills.length).toBeGreaterThan(0);
  });

  it('should not require external execution', async () => {
    const { generateMarketingPlanTool } = await import('../src/tools/generateMarketingPlanTool.js');
    const result = await generateMarketingPlanTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'campanha',
    });
    expect(result.requiresExternalExecution).toBe(false);
  });
});

describe('generateCROSEOPlanTool', () => {
  it('should generate CRO/SEO plan', async () => {
    const { generateCROSEOPlanTool } = await import('../src/tools/generateCROSEOPlanTool.js');
    const result = await generateCROSEOPlanTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP de conversão',
    });
    expect(result.plan).toBeDefined();
    expect(result.plan.cro.length).toBeGreaterThan(0);
    expect(result.plan.seo.length).toBeGreaterThan(0);
    expect(result.plan.schema.length).toBeGreaterThan(0);
  });

  it('should have prioritized CRO items', async () => {
    const { generateCROSEOPlanTool } = await import('../src/tools/generateCROSEOPlanTool.js');
    const result = await generateCROSEOPlanTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP',
    });
    for (const item of result.plan.cro) {
      expect(['high', 'medium', 'low']).toContain(item.priority);
    }
  });

  it('should have prioritized SEO items', async () => {
    const { generateCROSEOPlanTool } = await import('../src/tools/generateCROSEOPlanTool.js');
    const result = await generateCROSEOPlanTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP',
    });
    for (const item of result.plan.seo) {
      expect(['high', 'medium', 'low']).toContain(item.priority);
    }
  });

  it('should not require external execution', async () => {
    const { generateCROSEOPlanTool } = await import('../src/tools/generateCROSEOPlanTool.js');
    const result = await generateCROSEOPlanTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP',
    });
    expect(result.requiresExternalExecution).toBe(false);
  });
});
