import { describe, it, expect } from 'vitest';
import * as path from 'node:path';

const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../../fixtures');
const LP_FIXTURE = path.join(FIXTURES_DIR, 'react-vite-tailwind-lp');

describe('runLovablePipelineTool', () => {
  it('should run pipeline in dry-run mode', async () => {
    const { runLovablePipelineTool } = await import('../src/tools/runLovablePipelineTool.js');
    const result = await runLovablePipelineTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP premium para Destaque Agro',
      dryRun: true,
      confirm: false,
    });
    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(true);
  });

  it('should detect brand from request', async () => {
    const { runLovablePipelineTool } = await import('../src/tools/runLovablePipelineTool.js');
    const result = await runLovablePipelineTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP premium para Samar Veículos',
    });
    expect(result.success).toBe(true);
    expect(result.productMarketingContext.brand).toBe('Samar Veículos');
  });

  it('should return all pipeline outputs', async () => {
    const { runLovablePipelineTool } = await import('../src/tools/runLovablePipelineTool.js');
    const result = await runLovablePipelineTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP para NanoAI',
    });
    expect(result.visualDirections).toHaveLength(3);
    expect(result.componentFirstPlan.components.length).toBeGreaterThan(0);
    expect(result.visualQaPlan.checks.length).toBeGreaterThan(0);
  });
});

describe('generateProductMarketingContextTool', () => {
  it('should generate context for known brand', async () => {
    const { generateProductMarketingContextTool } = await import('../src/tools/generateProductMarketingContextTool.js');
    const result = await generateProductMarketingContextTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP para Samar Veículos',
    });
    expect(result.brand).toBe('Samar Veículos');
    expect(result.offer).toBeTruthy();
    expect(result.toneOfVoice).toBeTruthy();
  });

  it('should generate fallback context for unknown brand', async () => {
    const { generateProductMarketingContextTool } = await import('../src/tools/generateProductMarketingContextTool.js');
    const result = await generateProductMarketingContextTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP para uma startup qualquer',
    });
    expect(result.brand).toBeTruthy();
    expect(result.productOrService).toBeTruthy();
  });
});

describe('generateVisualDirectionsTool', () => {
  it('should generate 3 directions', async () => {
    const { generateVisualDirectionsTool } = await import('../src/tools/generateVisualDirectionsTool.js');
    const result = await generateVisualDirectionsTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP Destaque Agro',
    });
    expect(result.directions).toHaveLength(3);
  });

  it('should honor style preference', async () => {
    const { generateVisualDirectionsTool } = await import('../src/tools/generateVisualDirectionsTool.js');
    const result = await generateVisualDirectionsTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP Destaque Agro',
      stylePreference: 'editorial clean',
    });
    expect(result.recommended.id).toBe('editorial-clean');
  });
});

describe('selectBrandTemplateTool', () => {
  it('should select template for known brand', async () => {
    const { selectBrandTemplateTool } = await import('../src/tools/selectBrandTemplateTool.js');
    const result = await selectBrandTemplateTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP para Samar Veículos',
      brand: 'Samar Veículos',
    });
    expect(result.templateId).toBe('automotive-premium');
  });

  it('should return template with confidence', async () => {
    const { selectBrandTemplateTool } = await import('../src/tools/selectBrandTemplateTool.js');
    const result = await selectBrandTemplateTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP para uma empresa',
    });
    expect(typeof result.templateId).toBe('string');
    expect(typeof result.confidence).toBe('number');
  });
});

describe('generateDesignMdTool', () => {
  it('should generate DESIGN.md in dry-run mode', async () => {
    const { generateDesignMdTool } = await import('../src/tools/generateDesignMdTool.js');
    const result = await generateDesignMdTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP para Destaque Agro',
      dryRun: true,
      confirm: false,
    });
    expect(result.wouldCreate).toBe(true);
    expect(result.content).toContain('DESIGN.md');
  });

  it('should include sections', async () => {
    const { generateDesignMdTool } = await import('../src/tools/generateDesignMdTool.js');
    const result = await generateDesignMdTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP para Samar Veículos',
    });
    expect(result.sections.length).toBeGreaterThan(0);
  });
});

describe('generateComponentFirstPlanTool', () => {
  it('should generate component plan', async () => {
    const { generateComponentFirstPlanTool } = await import('../src/tools/generateComponentFirstPlanTool.js');
    const result = await generateComponentFirstPlanTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'LP premium para Samar Veículos',
    });
    expect(result.components.length).toBeGreaterThan(0);
    expect(result.recommendedFileStructure.length).toBeGreaterThan(0);
  });

  it('should detect dashboard request', async () => {
    const { generateComponentFirstPlanTool } = await import('../src/tools/generateComponentFirstPlanTool.js');
    const result = await generateComponentFirstPlanTool.handler({
      projectPath: LP_FIXTURE,
      userRequest: 'dashboard de vendas SaaS',
    });
    expect(result.components.length).toBeGreaterThan(0);
  });
});
