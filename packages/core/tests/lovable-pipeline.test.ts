import { describe, it, expect } from 'vitest';
import { createProductMarketingContext } from '../src/lovable-pipeline/createProductMarketingContext.js';
import { generateVisualDirections } from '../src/lovable-pipeline/generateVisualDirections.js';
import { selectBrandTemplate } from '../src/lovable-pipeline/selectBrandTemplate.js';
import { generateDesignMd } from '../src/lovable-pipeline/generateDesignMd.js';
import { generateComponentFirstPlan } from '../src/lovable-pipeline/generateComponentFirstPlan.js';
import { generateVisualQaPlan } from '../src/lovable-pipeline/generateVisualQaPlan.js';
import { generateIterationReport } from '../src/lovable-pipeline/generateIterationReport.js';
import { runLovableStylePipeline } from '../src/lovable-pipeline/runLovableStylePipeline.js';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../fixtures');
const LP_FIXTURE = path.join(FIXTURES_DIR, 'react-vite-tailwind-lp');

describe('createProductMarketingContext', () => {
  it('should detect known brand Samar', () => {
    const ctx = createProductMarketingContext({ userRequest: 'LP premium para Samar Veículos' });
    expect(ctx.brand).toBe('Samar Veículos');
    expect(ctx.toneOfVoice).toBe('confiante, humano, consultivo e direto');
    expect(ctx.conversionGoal).toBe('gerar contato ou visita');
  });

  it('should detect Destaque Agro', () => {
    const ctx = createProductMarketingContext({ userRequest: 'LP para Destaque Agro com foco em soja' });
    expect(ctx.brand).toBe('Destaque Agro');
    expect(ctx.productOrService).toContain('Consultoria');
  });

  it('should detect NanoAI', () => {
    const ctx = createProductMarketingContext({ userRequest: 'site institucional da NanoAI' });
    expect(ctx.brand).toBe('NanoAI');
    expect(ctx.toneOfVoice).toBe('estratégico, visionário, pragmático');
  });

  it('should detect Ellegance beauty brand', () => {
    const ctx = createProductMarketingContext({ userRequest: 'LP de vendas para Ellegance' });
    expect(ctx.brand).toBe('Ellegance');
    expect(ctx.productOrService).toContain('saúde e beleza');
  });

  it('should detect JK Perfumes', () => {
    const ctx = createProductMarketingContext({ userRequest: 'LP premium para JK Perfumes' });
    expect(ctx.brand).toBe('JK Perfumes');
  });

  it('should detect ELIZÊ fashion brand', () => {
    const ctx = createProductMarketingContext({ userRequest: 'LP para ELIZÊ moda feminina' });
    expect(ctx.brand).toBe('ELIZÊ');
  });

  it('should fallback with heuristic for unknown brand', () => {
    const ctx = createProductMarketingContext({ userRequest: 'LP para uma startup de IA' });
    expect(ctx.brand).toBeTruthy();
    expect(ctx.productOrService).toBeTruthy();
    expect(ctx.audience).toBeTruthy();
    expect(ctx.toneOfVoice).toBeTruthy();
  });

  it('should detect LP project type for fallback', () => {
    const ctx = createProductMarketingContext({ userRequest: 'crie uma landing page de vendas' });
    expect(ctx.toneOfVoice).toBe('persuasivo e direto');
    expect(ctx.conversionGoal).toBe('converter lead');
  });

  it('should detect consulting project type', () => {
    const ctx = createProductMarketingContext({ userRequest: 'site para consultoria financeira' });
    expect(ctx.toneOfVoice).toBe('consultivo e humano');
  });

  it('should detect agro signals in fallback', () => {
    const ctx = createProductMarketingContext({ userRequest: 'LP para startup de agronegócio com foco em soja' });
    expect(ctx.audience).toContain('agronegócio');
  });
});

describe('generateVisualDirections', () => {
  const ctx = createProductMarketingContext({ userRequest: 'LP premium para Destaque Agro' });

  it('should generate exactly 3 visual directions', () => {
    const { directions } = generateVisualDirections({ userRequest: 'LP Destaque Agro', productMarketingContext: ctx });
    expect(directions).toHaveLength(3);
  });

  it('should have premium-comercial as first direction', () => {
    const { directions } = generateVisualDirections({ userRequest: 'LP Destaque Agro', productMarketingContext: ctx });
    expect(directions[0].id).toBe('premium-commercial');
    expect(directions[0].name).toBe('Premium Comercial');
  });

  it('should have editorial-clean as second direction', () => {
    const { directions } = generateVisualDirections({ userRequest: 'LP Destaque Agro', productMarketingContext: ctx });
    expect(directions[1].id).toBe('editorial-clean');
    expect(directions[1].name).toBe('Editorial Clean');
  });

  it('should have conversao-impacto as third direction', () => {
    const { directions } = generateVisualDirections({ userRequest: 'LP Destaque Agro', productMarketingContext: ctx });
    expect(directions[2].id).toBe('conversao-impacto');
    expect(directions[2].name).toBe('Conversão de Impacto');
  });

  it('should recommend premium by default', () => {
    const { recommended } = generateVisualDirections({ userRequest: 'LP Destaque Agro', productMarketingContext: ctx });
    expect(recommended.id).toBe('premium-commercial');
  });

  it('should recommend editorial when style preference is editorial', () => {
    const { recommended } = generateVisualDirections({
      userRequest: 'LP Destaque Agro',
      productMarketingContext: ctx,
      stylePreference: 'editorial clean minimal',
    });
    expect(recommended.id).toBe('editorial-clean');
  });

  it('should recommend conversao when style preference is conversão', () => {
    const { recommended } = generateVisualDirections({
      userRequest: 'LP Destaque Agro',
      productMarketingContext: ctx,
      stylePreference: 'conversão impacto venda',
    });
    expect(recommended.id).toBe('conversao-impacto');
  });

  it('each direction should have all required fields', () => {
    const { directions } = generateVisualDirections({ userRequest: 'LP Destaque Agro', productMarketingContext: ctx });
    for (const dir of directions) {
      expect(dir.id).toBeTruthy();
      expect(dir.name).toBeTruthy();
      expect(dir.summary).toBeTruthy();
      expect(dir.mood.length).toBeGreaterThan(0);
      expect(dir.colorStrategy).toBeTruthy();
      expect(dir.typographyStrategy).toBeTruthy();
      expect(dir.layoutStrategy).toBeTruthy();
      expect(dir.imageStyle).toBeTruthy();
      expect(dir.motionStyle).toBeTruthy();
      expect(dir.componentStyle).toBeTruthy();
      expect(dir.bestFor.length).toBeGreaterThan(0);
      expect(dir.avoid.length).toBeGreaterThan(0);
    }
  });

  it('each direction should include brand name in summary', () => {
    const { directions } = generateVisualDirections({ userRequest: 'LP Destaque Agro', productMarketingContext: ctx });
    for (const dir of directions) {
      expect(dir.summary).toContain('Destaque Agro');
    }
  });
});

describe('selectBrandTemplate', () => {
  it('should select automotive-premium for Samar', async () => {
    const result = await selectBrandTemplate({ brand: 'Samar Veículos', userRequest: 'LP Samar' });
    expect(result.templateId).toBe('automotive-premium');
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it('should select agro-institutional for Destaque Agro', async () => {
    const result = await selectBrandTemplate({ brand: 'Destaque Agro', userRequest: 'LP Destaque Agro' });
    expect(result.templateId).toBe('agro-institutional');
  });

  it('should select ai-consulting for NanoAI', async () => {
    const result = await selectBrandTemplate({ brand: 'NanoAI', userRequest: 'site NanoAI' });
    expect(result.templateId).toBe('ai-consulting');
  });

  it('should select health-beauty-premium for Ellegance', async () => {
    const result = await selectBrandTemplate({ brand: 'Ellegance', userRequest: 'LP Ellegance' });
    expect(result.templateId).toBe('health-beauty-premium');
  });

  it('should detect brand from user request', async () => {
    const result = await selectBrandTemplate({ userRequest: 'LP premium para Samar Veículos' });
    expect(result.templateId).toBe('automotive-premium');
  });

  it('should use project type mapping', async () => {
    const result = await selectBrandTemplate({ projectType: 'landing-page', userRequest: 'LP genérica' });
    expect(result.templateId).toBe('tech-product-lp');
  });

  it('should use keyword heuristics', async () => {
    const result = await selectBrandTemplate({ userRequest: 'sistema SaaS B2B para gestão' });
    expect(['b2b-saas', 'tech-product-lp']).toContain(result.templateId);
  });

  it('should fallback to tech-product-lp for unknown', async () => {
    const result = await selectBrandTemplate({ userRequest: 'algo completamente genérico' });
    expect(result.templateId).toBe('tech-product-lp');
    expect(result.confidence).toBeLessThanOrEqual(0.3);
  });

  it('should return confidence between 0 and 1', async () => {
    const cases = [
      { brand: 'Samar Veículos', userRequest: 'LP Samar' },
      { userRequest: 'LP genérica sem marca' },
    ];
    for (const c of cases) {
      const result = await selectBrandTemplate(c);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    }
  });

  it('should return warnings for low confidence', async () => {
    const result = await selectBrandTemplate({ userRequest: 'LP genérica' });
    if (result.confidence < 0.5) {
      expect(result.warnings.length).toBeGreaterThan(0);
    }
  });

  it('should load template JSON when available', async () => {
    const result = await selectBrandTemplate({ brand: 'Samar Veículos', userRequest: 'LP Samar' });
    expect(result.template).not.toBeNull();
    expect(result.template!.name).toBeTruthy();
    expect(result.template!.recommendedPalette).toBeDefined();
    expect(result.template!.recommendedPalette.primary).toBeTruthy();
  });
});

describe('generateDesignMd', () => {
  const ctx = createProductMarketingContext({ userRequest: 'LP Destaque Agro' });
  const { recommended } = generateVisualDirections({ userRequest: 'LP Destaque Agro', productMarketingContext: ctx });

  it('should generate DESIGN.md in dry-run mode', async () => {
    const result = await generateDesignMd({
      projectPath: LP_FIXTURE,
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: {
        id: 'agro-institutional', name: 'Agro Institutional',
        segments: [], bestForBrands: [], visualPersonality: ['confiável'],
        recommendedPalette: { primary: '#2d6a4f', accent: '#f0a500', background: '#fafbf9' },
        typography: { headline: 'Sans', body: 'Sans' },
        componentStyle: { buttons: 'rounded', cards: 'shadow', sections: 'py-20' },
        recommendedSections: ['Hero', 'Benefícios'], avoid: [],
      },
      dryRun: true,
      confirm: false,
    });

    expect(result.wouldCreate).toBe(true);
    expect(result.content).toBeTruthy();
    expect(result.content).toContain('DESIGN.md');
    expect(result.content).toContain('Destaque Agro');
    expect(result.sections.length).toBeGreaterThan(0);
  });

  it('should include all 15 sections', async () => {
    const result = await generateDesignMd({
      projectPath: LP_FIXTURE,
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: {
        id: 'agro-institutional', name: 'Agro Institutional',
        segments: [], bestForBrands: [], visualPersonality: ['confiável'],
        recommendedPalette: { primary: '#2d6a4f', accent: '#f0a500', background: '#fafbf9' },
        typography: { headline: 'Sans', body: 'Sans' },
        componentStyle: { buttons: 'rounded', cards: 'shadow', sections: 'py-20' },
        recommendedSections: ['Hero', 'Benefícios'], avoid: [],
      },
      dryRun: true,
      confirm: false,
    });

    expect(result.sections).toHaveLength(15);
    const titles = result.sections.map(s => s.title);
    expect(titles).toContain('Product Marketing Context');
    expect(titles).toContain('Visual Direction Selected');
    expect(titles).toContain('Color System');
    expect(titles).toContain('Typography');
    expect(titles).toContain('Layout System');
    expect(titles).toContain('Accessibility Notes');
  });

  it('should not write file in dry-run mode', async () => {
    const testPath = path.join(LP_FIXTURE, '.claude', 'design', 'DESIGN.md');

    // Clean up if exists from previous test
    try { await fs.unlink(testPath); } catch {}

    await generateDesignMd({
      projectPath: LP_FIXTURE,
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: {
        id: 'agro-institutional', name: 'Agro',
        segments: [], bestForBrands: [], visualPersonality: [],
        recommendedPalette: { primary: '#000', accent: '#000', background: '#fff' },
        typography: { headline: 'Sans', body: 'Sans' },
        componentStyle: { buttons: '', cards: '', sections: '' },
        recommendedSections: [], avoid: [],
      },
      dryRun: true,
      confirm: false,
    });

    let exists = true;
    try { await fs.access(testPath); } catch { exists = false; }
    expect(exists).toBe(false);
  });
});

describe('generateComponentFirstPlan', () => {
  const ctx = createProductMarketingContext({ userRequest: 'LP premium para Samar Veículos' });
  const { recommended } = generateVisualDirections({ userRequest: 'LP Samar', productMarketingContext: ctx });

  const baseTemplate = {
    id: 'automotive-premium', name: 'Automotive Premium',
    segments: [], bestForBrands: [], visualPersonality: ['premium'],
    recommendedPalette: { primary: '#1a1a2e', accent: '#e94560', background: '#f8f9fa' },
    typography: { headline: 'Inter Tight', body: 'Inter' },
    componentStyle: { buttons: 'rounded-lg', cards: 'shadow', sections: 'py-20' },
    recommendedSections: ['Hero', 'Benefícios', 'CTA'], avoid: [],
  };

  it('should generate landing page components for LP request', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    expect(plan.components.length).toBeGreaterThanOrEqual(5);
    expect(plan.recommendedFileStructure.length).toBeGreaterThan(0);
    expect(plan.implementationOrder.length).toBeGreaterThan(0);
  });

  it('should generate dashboard components for dashboard request', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'dashboard de vendas SaaS',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    expect(plan.components.length).toBeGreaterThanOrEqual(3);
  });

  it('should generate institutional components for site request', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'site institucional da empresa',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    expect(plan.components.length).toBeGreaterThanOrEqual(3);
  });

  it('each component should have required fields', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    for (const comp of plan.components) {
      expect(comp.name).toBeTruthy();
      expect(comp.purpose).toBeTruthy();
      expect(comp.props.length).toBeGreaterThan(0);
      expect(comp.visualNotes).toBeTruthy();
      expect(comp.copyNotes).toBeTruthy();
      expect(comp.accessibilityNotes).toBeTruthy();
    }
  });

  it('recommendedFileStructure should use .tsx extension', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    for (const file of plan.recommendedFileStructure) {
      expect(file).toMatch(/\.tsx$/);
    }
  });

  it('implementationOrder should match file count', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    expect(plan.implementationOrder.length).toBe(plan.recommendedFileStructure.length);
  });
});

describe('generateVisualQaPlan', () => {
  const ctx = createProductMarketingContext({ userRequest: 'LP premium para Samar Veículos' });
  const { recommended } = generateVisualDirections({ userRequest: 'LP Samar', productMarketingContext: ctx });

  const baseTemplate = {
    id: 'automotive-premium', name: 'Automotive Premium',
    segments: [], bestForBrands: [], visualPersonality: ['premium'],
    recommendedPalette: { primary: '#1a1a2e', accent: '#e94560', background: '#f8f9fa' },
    typography: { headline: 'Inter Tight', body: 'Inter' },
    componentStyle: { buttons: 'rounded-lg', cards: 'shadow', sections: 'py-20' },
    recommendedSections: ['Hero', 'Benefícios', 'CTA'], avoid: [],
  };

  it('should generate QA plan with checks', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    const qaPlan = generateVisualQaPlan({
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
      componentFirstPlan: plan,
    });
    expect(qaPlan.checks.length).toBeGreaterThan(0);
    expect(qaPlan.recommendedTools.length).toBeGreaterThan(0);
    expect(qaPlan.manualFallback).toBe(true);
  });

  it('should have base checks', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    const qaPlan = generateVisualQaPlan({
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
      componentFirstPlan: plan,
    });

    const baseIds = ['qa-color-contrast', 'qa-typography-scale', 'qa-responsive-layout', 'qa-focus-states'];
    for (const id of baseIds) {
      expect(qaPlan.checks.find(c => c.id === id)).toBeDefined();
    }
  });

  it('should add direction-specific checks for premium', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    const qaPlan = generateVisualQaPlan({
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
      componentFirstPlan: plan,
    });

    expect(qaPlan.checks.find(c => c.id === 'qa-premium-glass')).toBeDefined();
    expect(qaPlan.checks.find(c => c.id === 'qa-premium-shadow')).toBeDefined();
  });

  it('should add direction-specific checks for conversao', () => {
    const { directions } = generateVisualDirections({ userRequest: 'LP Samar', productMarketingContext: ctx });
    const conversao = directions[2];
    const plan = generateComponentFirstPlan({
      userRequest: 'LP venda direta',
      productMarketingContext: ctx,
      selectedVisualDirection: conversao,
      selectedBrandTemplate: baseTemplate,
    });
    const qaPlan = generateVisualQaPlan({
      selectedVisualDirection: conversao,
      selectedBrandTemplate: baseTemplate,
      componentFirstPlan: plan,
    });

    expect(qaPlan.checks.find(c => c.id === 'qa-conversion-cta-visibility')).toBeDefined();
    expect(qaPlan.checks.find(c => c.id === 'qa-conversion-social-proof')).toBeDefined();
    expect(qaPlan.checks.find(c => c.id === 'qa-conversion-form-length')).toBeDefined();
  });

  it('should add template-specific checks', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    const qaPlan = generateVisualQaPlan({
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
      componentFirstPlan: plan,
    });

    expect(qaPlan.checks.find(c => c.id === 'qa-template-palette-automotive-premium')).toBeDefined();
  });

  it('should add component-specific checks', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    const qaPlan = generateVisualQaPlan({
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
      componentFirstPlan: plan,
    });

    for (const comp of plan.components) {
      expect(qaPlan.checks.find(c => c.id === `qa-component-${comp.name}`)).toBeDefined();
    }
  });

  it('each check should have severity', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    const qaPlan = generateVisualQaPlan({
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
      componentFirstPlan: plan,
    });

    for (const check of qaPlan.checks) {
      expect(['high', 'medium', 'low']).toContain(check.severity);
      expect(check.description).toBeTruthy();
      expect(check.howToCheck).toBeTruthy();
    }
  });

  it('checks should be sorted by severity (high first)', () => {
    const plan = generateComponentFirstPlan({
      userRequest: 'LP premium para Samar',
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
    });
    const qaPlan = generateVisualQaPlan({
      selectedVisualDirection: recommended,
      selectedBrandTemplate: baseTemplate,
      componentFirstPlan: plan,
    });

    const severityOrder = { high: 0, medium: 1, low: 2 };
    for (let i = 1; i < qaPlan.checks.length; i++) {
      expect(
        severityOrder[qaPlan.checks[i - 1].severity] <= severityOrder[qaPlan.checks[i].severity]
      ).toBe(true);
    }
  });
});

describe('generateIterationReport', () => {
  const ctx = createProductMarketingContext({ userRequest: 'LP premium para Samar Veículos' });
  const { directions, recommended } = generateVisualDirections({ userRequest: 'LP Samar', productMarketingContext: ctx });

  const baseTemplate = {
    id: 'automotive-premium', name: 'Automotive Premium',
    segments: [], bestForBrands: [], visualPersonality: ['premium'],
    recommendedPalette: { primary: '#1a1a2e', accent: '#e94560', background: '#f8f9fa' },
    typography: { headline: 'Inter Tight', body: 'Inter' },
    componentStyle: { buttons: 'rounded-lg', cards: 'shadow', sections: 'py-20' },
    recommendedSections: ['Hero', 'Benefícios', 'CTA'], avoid: [],
  };

  const designMd = {
    path: '/tmp/DESIGN.md',
    content: '# DESIGN.md content',
    wouldCreate: true,
    sections: [{ title: 'Test', content: 'content' }],
  };

  const plan = generateComponentFirstPlan({
    userRequest: 'LP premium para Samar',
    productMarketingContext: ctx,
    selectedVisualDirection: recommended,
    selectedBrandTemplate: baseTemplate,
  });

  const qaPlan = generateVisualQaPlan({
    selectedVisualDirection: recommended,
    selectedBrandTemplate: baseTemplate,
    componentFirstPlan: plan,
  });

  it('should generate iteration report with all sections', () => {
    const report = generateIterationReport({
      userRequest: 'LP premium para Samar Veículos',
      intent: 'create-landing-page',
      productMarketingContext: ctx,
      visualDirections: directions,
      selectedDirection: recommended,
      brandTemplate: baseTemplate,
      designMd,
      componentFirstPlan: plan,
      visualQaPlan: qaPlan,
    });

    expect(report.userRequest).toBe('LP premium para Samar Veículos');
    expect(report.intent).toBe('create-landing-page');
    expect(report.productMarketingContext).toBeDefined();
    expect(report.visualDirections).toHaveLength(3);
    expect(report.selectedDirection.id).toBe('premium-commercial');
    expect(report.brandTemplate).toBeDefined();
    expect(report.designMd).toBeDefined();
    expect(report.componentFirstPlan).toBeDefined();
    expect(report.visualQaPlan).toBeDefined();
  });

  it('should have next steps', () => {
    const report = generateIterationReport({
      userRequest: 'LP premium para Samar',
      intent: 'create-landing-page',
      productMarketingContext: ctx,
      visualDirections: directions,
      selectedDirection: recommended,
      brandTemplate: baseTemplate,
      designMd,
      componentFirstPlan: plan,
      visualQaPlan: qaPlan,
    });

    expect(report.nextSteps.length).toBeGreaterThan(0);
    expect(report.nextSteps.some(s => s.includes('DESIGN.md'))).toBe(true);
  });

  it('should have risks for editorial direction', () => {
    const report = generateIterationReport({
      userRequest: 'LP premium para Samar',
      intent: 'create-landing-page',
      productMarketingContext: ctx,
      visualDirections: directions,
      selectedDirection: directions[1], // editorial
      brandTemplate: baseTemplate,
      designMd,
      componentFirstPlan: plan,
      visualQaPlan: qaPlan,
    });

    expect(report.risks.some(r => r.includes('editorial'))).toBe(true);
  });

  it('should warn on generic template', () => {
    const report = generateIterationReport({
      userRequest: 'LP genérica',
      intent: 'create-landing-page',
      productMarketingContext: ctx,
      visualDirections: directions,
      selectedDirection: recommended,
      brandTemplate: { ...baseTemplate, id: 'tech-product-lp' },
      designMd,
      componentFirstPlan: plan,
      visualQaPlan: qaPlan,
    });

    expect(report.warnings.some(w => w.includes('genérico') || w.includes('fallback'))).toBe(true);
  });
});

describe('runLovableStylePipeline', () => {
  it('should run full pipeline in dry-run mode', async () => {
    const result = await runLovableStylePipeline({
      projectPath: LP_FIXTURE,
      userRequest: 'LP premium para Destaque Agro',
      dryRun: true,
      confirm: false,
    });

    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(true);
    expect(result.productMarketingContext.brand).toBe('Destaque Agro');
    expect(result.visualDirections).toHaveLength(3);
    expect(result.selectedVisualDirection).toBeDefined();
    expect(result.designMd.wouldCreate).toBe(true);
    expect(result.selectedBrandTemplate).toBeDefined();
    expect(result.componentFirstPlan.components.length).toBeGreaterThan(0);
    expect(result.visualQaPlan.checks.length).toBeGreaterThan(0);
    expect(result.iterationReport.nextSteps.length).toBeGreaterThan(0);
  });

  it('should require confirm when dryRun is true', async () => {
    const result = await runLovableStylePipeline({
      projectPath: LP_FIXTURE,
      userRequest: 'LP para Samar Veículos',
      dryRun: true,
      confirm: false,
    });

    expect(result.requiresConfirm).toBe(true);
  });

  it('should include changes array', async () => {
    const result = await runLovableStylePipeline({
      projectPath: LP_FIXTURE,
      userRequest: 'LP para Samar Veículos',
      dryRun: true,
      confirm: false,
    });

    expect(Array.isArray(result.changes)).toBe(true);
    if (result.dryRun) {
      expect(result.changes.some(c => c.action.includes('dry-run'))).toBe(true);
    }
  });

  it('should work with known brands', async () => {
    const brands = ['Samar Veículos', 'NanoAI', 'Ellegance', 'ELIZÊ'];
    for (const brand of brands) {
      const result = await runLovableStylePipeline({
        projectPath: LP_FIXTURE,
        userRequest: `LP premium para ${brand}`,
        dryRun: true,
        confirm: false,
      });

      expect(result.success).toBe(true);
      // Brand should be detected and match the requested brand
      expect(result.productMarketingContext.brand.toLowerCase()).toContain(brand.toLowerCase().split(' ')[0]);
    }
  });
});
