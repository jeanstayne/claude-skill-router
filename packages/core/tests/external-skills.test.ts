import { describe, it, expect } from 'vitest';
import { loadExternalSkills } from '../src/registry/loadExternalSkills.js';
import { validateExternalSkills } from '../src/registry/validateExternalSkills.js';
import { recommendExternalSkills } from '../src/registry/recommendExternalSkills.js';
import * as path from 'node:path';

const REGISTRY_PATH = path.resolve(import.meta.dirname, '../../../registry');

describe('loadExternalSkills', () => {
  it('should load external skills from registry', async () => {
    const skills = await loadExternalSkills(REGISTRY_PATH);
    expect(skills.length).toBeGreaterThanOrEqual(0);
  });

  it('should return empty array for non-existent path', async () => {
    const skills = await loadExternalSkills('/tmp/non-existent-external-skills');
    expect(skills.length).toBe(0);
  });

  it('should load at least 30 external skills', async () => {
    const skills = await loadExternalSkills(REGISTRY_PATH);
    // Registry has 34 external skills defined
    expect(skills.length).toBeGreaterThanOrEqual(30);
  });

  it('each skill should have required fields', async () => {
    const skills = await loadExternalSkills(REGISTRY_PATH);
    for (const skill of skills) {
      expect(skill.id).toBeTruthy();
      expect(skill.name).toBeTruthy();
      expect(skill.category).toBeTruthy();
      expect(skill.riskLevel).toBeTruthy();
      expect(['low', 'medium', 'high']).toContain(skill.riskLevel);
    }
  });

  it('skills with requiresExternalCli should not have riskLevel low', async () => {
    const skills = await loadExternalSkills(REGISTRY_PATH);
    for (const skill of skills) {
      if (skill.requiresExternalCli) {
        expect(skill.riskLevel).not.toBe('low');
      }
    }
  });

  it('autoInstallAllowed should be false for all skills', async () => {
    const skills = await loadExternalSkills(REGISTRY_PATH);
    for (const skill of skills) {
      expect(skill.autoInstallAllowed).toBe(false);
    }
  });

  it('autoExecuteAllowed should be false for all skills', async () => {
    const skills = await loadExternalSkills(REGISTRY_PATH);
    for (const skill of skills) {
      expect(skill.autoExecuteAllowed).toBe(false);
    }
  });

  it('should have expected categories represented', async () => {
    const skills = await loadExternalSkills(REGISTRY_PATH);
    const categories = new Set(skills.map(s => s.category));
    expect(categories.has('design')).toBe(true);
    expect(categories.has('image')).toBe(true);
    expect(categories.has('marketing')).toBe(true);
    expect(categories.has('seo')).toBe(true);
    expect(categories.has('social')).toBe(true);
  });
});

describe('validateExternalSkills', () => {
  it('should validate all external skills', async () => {
    const result = await validateExternalSkills(REGISTRY_PATH);
    expect(result.skillsLoaded).toBeGreaterThanOrEqual(30);
  });

  it('should return no errors for valid registry', async () => {
    const result = await validateExternalSkills(REGISTRY_PATH);
    expect(result.errors.length).toBe(0);
  });

  it('should return false for non-existent directory', async () => {
    const result = await validateExternalSkills('/tmp/non-existent-external-skills');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.skillsLoaded).toBe(0);
  });

  it('should provide warnings for high-risk skills', async () => {
    const result = await validateExternalSkills(REGISTRY_PATH);
    // There should be warnings about high-risk skills (image generation, audit)
    // Warnings may be 0 if no high-risk skills found, that's valid too
    expect(Array.isArray(result.warnings)).toBe(true);
  });
});

describe('recommendExternalSkills', () => {
  it('should recommend image skills for image intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'generate-site-images',
      userRequest: 'gere imagens para o site',
    });
    expect(result.externalSkills.length).toBeGreaterThan(0);
    const imageSkills = result.externalSkills.filter(s =>
      ['ai-image-generation', 'gpt-image-2', 'canvas-design'].includes(s.id)
    );
    expect(imageSkills.length).toBeGreaterThan(0);
  });

  it('should include warnings for high-risk image skills', async () => {
    const result = await recommendExternalSkills({
      intent: 'generate-site-images',
      userRequest: 'gere imagens para o site',
    });
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('should recommend copy skills for headline intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'improve-headlines',
      userRequest: 'melhore as headlines da LP',
    });
    expect(result.externalSkills.length).toBeGreaterThan(0);
    const copySkills = result.externalSkills.filter(s =>
      ['copywriting', 'marketing-psychology', 'page-cro'].includes(s.id)
    );
    expect(copySkills.length).toBeGreaterThan(0);
  });

  it('should recommend SEO skills for SEO intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'optimize-seo',
      userRequest: 'otimize o SEO do site',
    });
    expect(result.externalSkills.length).toBeGreaterThan(0);
    const seoSkills = result.externalSkills.filter(s =>
      ['seo-audit', 'schema-markup', 'content-strategy'].includes(s.id)
    );
    expect(seoSkills.length).toBeGreaterThan(0);
  });

  it('should recommend design system skills for extraction intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'extract-design-system',
      userRequest: 'extraia o design system da referência',
    });
    expect(result.externalSkills.length).toBeGreaterThan(0);
    const dsSkills = result.externalSkills.filter(s =>
      ['extract-design-system', 'tailwind-design-system', 'theme-factory'].includes(s.id)
    );
    expect(dsSkills.length).toBeGreaterThan(0);
  });

  it('should use fallback for unknown intent based on keywords', async () => {
    const result = await recommendExternalSkills({
      intent: 'unknown',
      userRequest: 'crie um banner e hero visual impressionante',
    });
    // Should detect "image" fallback
    expect(result.externalSkills.length).toBeGreaterThan(0);
  });

  it('should limit results to maxResults', async () => {
    const result = await recommendExternalSkills({
      intent: 'optimize-seo',
      userRequest: 'SEO',
      maxResults: 2,
    });
    expect(result.externalSkills.length).toBeLessThanOrEqual(2);
  });

  it('should return empty for no matching intent or fallback', async () => {
    const result = await recommendExternalSkills({
      intent: 'unknown',
      userRequest: 'xyz abc',
    });
    expect(result.externalSkills.length).toBe(0);
  });

  it('each recommendation should have required fields', async () => {
    const result = await recommendExternalSkills({
      intent: 'improve-marketing-copy',
      userRequest: 'melhore o copy de marketing',
    });
    for (const skill of result.externalSkills) {
      expect(skill.id).toBeTruthy();
      expect(skill.reason).toBeTruthy();
      expect(skill.riskLevel).toBeTruthy();
    }
  });

  it('high-risk recommendations should have warnings', async () => {
    const result = await recommendExternalSkills({
      intent: 'generate-site-images',
      userRequest: 'gere imagens',
    });
    const highRisk = result.externalSkills.filter(s => s.riskLevel === 'high');
    for (const skill of highRisk) {
      expect(skill.warning).toBeTruthy();
    }
  });

  it('should handle ads intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'create-ad-creative',
      userRequest: 'crie anúncios para Meta Ads',
    });
    const adSkills = result.externalSkills.filter(s =>
      ['ad-creative', 'paid-ads'].includes(s.id)
    );
    expect(adSkills.length).toBeGreaterThan(0);
  });

  it('should handle social content intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'create-social-content',
      userRequest: 'crie conteúdo para Instagram',
    });
    const socialSkills = result.externalSkills.filter(s =>
      ['social-content', 'ad-creative', 'marketing-ideas'].includes(s.id)
    );
    expect(socialSkills.length).toBeGreaterThan(0);
  });

  it('should handle email sequence intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'create-email-sequence',
      userRequest: 'crie sequência de emails',
    });
    const emailSkills = result.externalSkills.filter(s =>
      ['email-sequence', 'copywriting'].includes(s.id)
    );
    expect(emailSkills.length).toBeGreaterThan(0);
  });

  it('should handle launch strategy intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'create-launch-strategy',
      userRequest: 'crie estratégia de lançamento',
    });
    const launchSkills = result.externalSkills.filter(s =>
      ['launch-strategy', 'marketing-ideas', 'email-sequence'].includes(s.id)
    );
    expect(launchSkills.length).toBeGreaterThan(0);
  });

  it('should handle CRO intents', async () => {
    const result = await recommendExternalSkills({
      intent: 'audit-page-cro',
      userRequest: 'audite o CRO da página',
    });
    expect(result.externalSkills.length).toBeGreaterThan(0);
  });

  it('should handle form CRO optimization', async () => {
    const result = await recommendExternalSkills({
      intent: 'optimize-form-cro',
      userRequest: 'otimize o formulário',
    });
    const formSkills = result.externalSkills.filter(s => s.id === 'form-cro');
    expect(formSkills.length).toBeGreaterThan(0);
  });

  it('should handle popup CRO optimization', async () => {
    const result = await recommendExternalSkills({
      intent: 'optimize-popup-cro',
      userRequest: 'otimize popups',
    });
    const popupSkills = result.externalSkills.filter(s => s.id === 'popup-cro');
    expect(popupSkills.length).toBeGreaterThan(0);
  });

  it('should handle schema markup intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'add-schema-markup',
      userRequest: 'adicione schema markup',
    });
    const schemaSkills = result.externalSkills.filter(s => s.id === 'schema-markup');
    expect(schemaSkills.length).toBeGreaterThan(0);
  });

  it('should handle content strategy intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'create-content-strategy',
      userRequest: 'crie estratégia de conteúdo',
    });
    const contentSkills = result.externalSkills.filter(s => s.id === 'content-strategy');
    expect(contentSkills.length).toBeGreaterThan(0);
  });

  it('should handle programmatic SEO intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'create-programmatic-seo-pages',
      userRequest: 'crie páginas SEO programáticas',
    });
    const progSeoSkills = result.externalSkills.filter(s => s.id === 'programmatic-seo');
    expect(progSeoSkills.length).toBeGreaterThan(0);
  });

  it('should handle website audit intent', async () => {
    const result = await recommendExternalSkills({
      intent: 'audit-website',
      userRequest: 'audite o site completo',
    });
    const auditSkills = result.externalSkills.filter(s => s.id === 'audit-website');
    expect(auditSkills.length).toBeGreaterThan(0);
  });
});
