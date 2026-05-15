import { describe, it, expect } from 'vitest';
import * as path from 'node:path';

const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../../fixtures');
const LP_FIXTURE = path.join(FIXTURES_DIR, 'react-vite-tailwind-lp');

describe('designSystemEnforcerTool', () => {
  it('should analyze project design system', async () => {
    const { designSystemEnforcerTool } = await import('../src/tools/designSystemEnforcerTool.js');
    const result = await designSystemEnforcerTool.handler({ projectPath: LP_FIXTURE });
    expect(result).toHaveProperty('analysis');
    expect(result).toHaveProperty('hardcodedIssues');
    expect(result).toHaveProperty('checklist');
    expect(result).toHaveProperty('summary');
  });
});

describe('seoByDefaultTool', () => {
  it('should generate SEO plan', async () => {
    const { seoByDefaultTool } = await import('../src/tools/seoByDefaultTool.js');
    const result = await seoByDefaultTool.handler({
      projectPath: LP_FIXTURE,
      context: {
        brand: 'Samar Veículos',
        productOrService: 'Veículos Premium',
        audience: 'Compradores premium',
        primaryPain: 'Falta de confiança',
        primaryDesire: 'Carro dos sonhos',
        offer: 'Veículos Garantidos',
        differentiators: ['Qualidade'],
        objections: ['Preço'],
        proofAssets: [],
        toneOfVoice: 'Profissional',
        conversionGoal: 'Contato',
      },
    });
    expect(result).toHaveProperty('seoPlan');
    expect(result).toHaveProperty('metadataPlan');
    expect(result).toHaveProperty('jsonLdPlan');
    expect(result).toHaveProperty('semanticHtmlChecklist');
    expect(result.seoPlan.title.content).toContain('Samar');
  });
});

describe('sandboxTemplateRecommendTool', () => {
  it('should recommend template for landing page', async () => {
    const { sandboxTemplateRecommendTool } = await import('../src/tools/sandboxTemplateRecommendTool.js');
    const result = await sandboxTemplateRecommendTool.handler({
      projectType: 'landing-page',
      needsUi: true,
    });
    expect(result).toHaveProperty('topPick');
    expect(result).toHaveProperty('recommendations');
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});

describe('sandboxTemplateLoadTool', () => {
  it('should load all templates', async () => {
    const { sandboxTemplateLoadTool } = await import('../src/tools/sandboxTemplateLoadTool.js');
    const result = await sandboxTemplateLoadTool.handler({});
    expect(result).toHaveProperty('templates');
    expect(result.templates.length).toBe(5);
  });
});

describe('runtimeFeedbackAnalyzeTool', () => {
  it('should analyze feedback data', async () => {
    const { runtimeFeedbackAnalyzeTool } = await import('../src/tools/runtimeFeedbackAnalyzeTool.js');
    const result = await runtimeFeedbackAnalyzeTool.handler({
      consoleLogs: [
        { type: 'error', message: 'Hydration failed', source: 'layout.tsx' },
        { type: 'warn', message: 'Missing alt text' },
      ],
      networkRequests: [
        { url: 'https://api.example.com/data', method: 'GET', status: 500, duration: 200, type: 'fetch', ok: false },
      ],
    });
    expect(result).toHaveProperty('consoleSummary');
    expect(result).toHaveProperty('networkSummary');
    expect(result).toHaveProperty('classification');
    expect(result).toHaveProperty('fixPlan');
    expect(result.fixPlan.actions.length).toBeGreaterThan(0);
  });
});

describe('previewQaLoopTool', () => {
  it('should run preview QA setup without results', async () => {
    const { previewQaLoopTool } = await import('../src/tools/previewQaLoopTool.js');
    const result = await previewQaLoopTool.handler({});
    expect(result).toHaveProperty('checklist');
    expect(result).toHaveProperty('viewportSummary');
    expect(result).toHaveProperty('summary');
    expect(result.checklist.checklist.length).toBe(20);
  });

  it('should detect regressions with viewport results', async () => {
    const { previewQaLoopTool } = await import('../src/tools/previewQaLoopTool.js');
    const result = await previewQaLoopTool.handler({
      viewportResults: [
        {
          viewportName: 'iPhone 14 Pro',
          checks: [{ checkId: 'qa-preview-01', passed: false, note: 'Hero not above fold' }],
        },
      ],
    });
    expect(result.regressionReport).not.toBeNull();
  });
});

describe('designTokensPlanTool', () => {
  it('should generate token plan from brand template', async () => {
    const { designTokensPlanTool } = await import('../src/tools/designTokensPlanTool.js');
    const result = await designTokensPlanTool.handler({
      brandTemplate: {
        id: 'test',
        name: 'Test',
        segments: [],
        bestForBrands: [],
        visualPersonality: ['clean'],
        recommendedPalette: { primary: '#2563eb', accent: '#f59e0b', background: '#ffffff' },
        typography: { headline: 'Inter', body: 'Inter' },
        componentStyle: { buttons: 'rounded', cards: 'shadow', sections: 'py-16' },
        recommendedSections: [],
        avoid: [],
      },
      visualDirection: {
        id: 'premium',
        name: 'Premium',
        summary: 'Premium',
        mood: ['clean'],
        colorStrategy: 'Blue',
        typographyStrategy: 'Sans',
        layoutStrategy: 'Spaced',
        imageStyle: 'Clean',
        motionStyle: 'Smooth',
        componentStyle: 'Rounded',
        bestFor: ['LP'],
        avoid: [],
      },
    });
    expect(result).toHaveProperty('colors');
    expect(result).toHaveProperty('gradients');
    expect(result).toHaveProperty('shadows');
    expect(result).toHaveProperty('radius');
    expect(result).toHaveProperty('motion');
    expect(result).toHaveProperty('typography');
  });
});

describe('shadcnVariantPlanTool', () => {
  it('should generate variant plan from brand template', async () => {
    const { shadcnVariantPlanTool } = await import('../src/tools/shadcnVariantPlanTool.js');
    const result = await shadcnVariantPlanTool.handler({
      brandTemplate: {
        id: 'test',
        name: 'Test',
        segments: [],
        bestForBrands: [],
        visualPersonality: ['clean'],
        recommendedPalette: { primary: '#2563eb', accent: '#f59e0b', background: '#ffffff' },
        typography: { headline: 'Inter', body: 'Inter' },
        componentStyle: { buttons: 'rounded', cards: 'shadow', sections: 'py-16' },
        recommendedSections: [],
        avoid: [],
      },
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);
  });
});
