import { describe, it, expect } from 'vitest';
import { classifyIntent } from '../src/router/classifyIntent.js';
import { selectPackForIntent } from '../src/router/selectPackForIntent.js';
import { routeRequest } from '../src/router/routeRequest.js';
import * as path from 'node:path';

const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../fixtures');
const LP_FIXTURE = path.join(FIXTURES_DIR, 'react-vite-tailwind-lp');

function sig() {
  return {
    visualStyle: [] as string[],
    businessGoal: [] as string[],
    keywords: [] as string[],
    mentionsDesignEngine: [] as string[],
    mentionsStack: [] as string[],
    confidence: 0,
  };
}

describe('classifyIntent — Marketplace Phase 14', () => {
  it('should classify "gere imagens para o site" as generate-site-images', () => {
    const result = classifyIntent({ userRequest: 'gere imagens para o site', signals: sig() });
    expect(result.intent).toBe('generate-site-images');
  });

  it('should classify "crie hero visual para LP" as create-hero-visual', () => {
    const result = classifyIntent({ userRequest: 'crie hero visual para LP', signals: sig() });
    expect(result.intent).toBe('create-hero-visual');
  });

  it('should classify "crie prompts de imagem" as create-image-prompts', () => {
    const result = classifyIntent({ userRequest: 'crie prompts de imagem para o banner', signals: sig() });
    expect(result.intent).toBe('create-image-prompts');
  });

  it('should classify "melhore as headlines" as improve-headlines', () => {
    const result = classifyIntent({ userRequest: 'melhore as headlines da página', signals: sig() });
    expect(result.intent).toBe('improve-headlines');
  });

  it('should classify "melhore a copy de marketing" as improve-marketing-copy', () => {
    const result = classifyIntent({ userRequest: 'melhore a copy de marketing do site', signals: sig() });
    expect(result.intent).toBe('improve-marketing-copy');
  });

  it('should classify "audite o CRO da página" as audit-page-cro', () => {
    const result = classifyIntent({ userRequest: 'audite o CRO da página de vendas', signals: sig() });
    expect(result.intent).toBe('audit-page-cro');
  });

  it('should classify "otimize formulário" as optimize-form-cro', () => {
    const result = classifyIntent({ userRequest: 'otimize o formulário de lead', signals: sig() });
    expect(result.intent).toBe('optimize-form-cro');
  });

  it('should classify "otimize popup" as optimize-popup-cro', () => {
    const result = classifyIntent({ userRequest: 'otimize o popup de saída', signals: sig() });
    expect(result.intent).toBe('optimize-popup-cro');
  });

  it('should classify "otimize SEO" as optimize-seo', () => {
    const result = classifyIntent({ userRequest: 'otimize o SEO do site', signals: sig() });
    expect(result.intent).toBe('optimize-seo');
  });

  it('should classify "adicione schema markup" as add-schema-markup', () => {
    const result = classifyIntent({ userRequest: 'adicione schema markup JSON-LD', signals: sig() });
    expect(result.intent).toBe('add-schema-markup');
  });

  it('should classify "crie estratégia de conteúdo" as create-content-strategy', () => {
    const result = classifyIntent({ userRequest: 'crie uma estratégia de conteúdo', signals: sig() });
    expect(result.intent).toBe('create-content-strategy');
  });

  it('should classify "crie páginas SEO programáticas" as create-programmatic-seo-pages', () => {
    const result = classifyIntent({ userRequest: 'crie páginas de SEO programáticas', signals: sig() });
    expect(result.intent).toBe('create-programmatic-seo-pages');
  });

  it('should classify "crie criativos de anúncio" as create-ad-creative', () => {
    const result = classifyIntent({ userRequest: 'crie criativos de anúncio para campanha', signals: sig() });
    expect(result.intent).toBe('create-ad-creative');
  });

  it('should classify "crie campanha paga" as create-paid-ads', () => {
    const result = classifyIntent({ userRequest: 'crie uma campanha de Google Ads', signals: sig() });
    expect(result.intent).toBe('create-paid-ads');
  });

  it('should classify "crie conteúdo para redes sociais" as create-social-content', () => {
    const result = classifyIntent({ userRequest: 'crie conteúdo para Instagram e LinkedIn', signals: sig() });
    expect(result.intent).toBe('create-social-content');
  });

  it('should classify "crie sequência de emails" as create-email-sequence', () => {
    const result = classifyIntent({ userRequest: 'crie uma sequência de emails de nutrição', signals: sig() });
    expect(result.intent).toBe('create-email-sequence');
  });

  it('should classify "crie estratégia de lançamento" as create-launch-strategy', () => {
    const result = classifyIntent({ userRequest: 'crie estratégia de lançamento do produto', signals: sig() });
    expect(result.intent).toBe('create-launch-strategy');
  });
});

describe('selectPackForIntent — Marketplace Phase 14', () => {
  const baseInput = {
    projectType: 'landing-page',
    framework: 'vite',
    ui: ['tailwind'],
    signals: { visualStyle: [], businessGoal: [], keywords: [], mentionsDesignEngine: [], mentionsStack: [], confidence: 0 },
    allowAdvanced: true,
  };

  it('should select visual-asset-generation-stack for generate-site-images', () => {
    const result = selectPackForIntent({ ...baseInput, intent: 'generate-site-images', signals: { ...baseInput.signals } });
    expect(result.packId).toBe('visual-asset-generation-stack');
  });

  it('should select marketing-copy-optimization-stack for improve-headlines', () => {
    const result = selectPackForIntent({ ...baseInput, intent: 'improve-headlines', signals: { ...baseInput.signals } });
    expect(result.packId).toBe('marketing-copy-optimization-stack');
  });

  it('should select seo-cro-growth-stack for optimize-seo', () => {
    const result = selectPackForIntent({ ...baseInput, intent: 'optimize-seo', signals: { ...baseInput.signals } });
    expect(result.packId).toBe('seo-cro-growth-stack');
  });

  it('should select paid-campaign-stack for create-ad-creative', () => {
    const result = selectPackForIntent({ ...baseInput, intent: 'create-ad-creative', signals: { ...baseInput.signals } });
    expect(result.packId).toBe('paid-campaign-stack');
  });

  it('should select social-launch-stack for create-social-content', () => {
    const result = selectPackForIntent({ ...baseInput, intent: 'create-social-content', signals: { ...baseInput.signals } });
    expect(result.packId).toBe('social-launch-stack');
  });

  it('should select design-system-extraction-stack for extract-design-system', () => {
    const result = selectPackForIntent({ ...baseInput, intent: 'extract-design-system', signals: { ...baseInput.signals } });
    expect(result.packId).toBe('design-system-extraction-stack');
  });
});

describe('routeRequest — Marketplace Phase 14', () => {
  it('should include externalSkillRecommendations for image intent', async () => {
    const result = await routeRequest({
      projectPath: LP_FIXTURE,
      userRequest: 'gere imagens e hero visuals para o site',
    });
    expect(result.success).toBe(true);
    // routeRequest should now populate externalSkillRecommendations
    if (result.externalSkillRecommendations) {
      expect(result.externalSkillRecommendations.externalSkills.length).toBeGreaterThan(0);
    }
  });

  it('should include externalSkillRecommendations for marketing copy intent', async () => {
    const result = await routeRequest({
      projectPath: LP_FIXTURE,
      userRequest: 'melhore as headlines e copy de marketing',
    });
    expect(result.success).toBe(true);
  });

  it('should include externalSkillRecommendations for CRO/SEO intent', async () => {
    const result = await routeRequest({
      projectPath: LP_FIXTURE,
      userRequest: 'otimize o SEO e a conversão da página',
    });
    expect(result.success).toBe(true);
  });
});
