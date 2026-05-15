import { describe, it, expect } from 'vitest';
import { analyzeDesignSystem } from '../src/design-system-enforcer/analyzeDesignSystem.js';
import { detectHardcodedVisualClasses } from '../src/design-system-enforcer/detectHardcodedVisualClasses.js';
import { generateDesignTokensPlan } from '../src/design-system-enforcer/generateDesignTokensPlan.js';
import { generateShadcnVariantPlan } from '../src/design-system-enforcer/generateShadcnVariantPlan.js';
import { generateDesignSystemFirstChecklist } from '../src/design-system-enforcer/generateDesignSystemFirstChecklist.js';
import { runDesignSystemEnforcer } from '../src/design-system-enforcer/runDesignSystemEnforcer.js';
import type { BrandTemplate, VisualDirection } from '../src/schemas/lovablePipelineSchema.js';

const mockBrandTemplate: BrandTemplate = {
  id: 'modern-saas',
  name: 'Modern SaaS',
  segments: ['SaaS', 'Tecnologia'],
  bestForBrands: [],
  visualPersonality: ['profissional', 'inovador'],
  recommendedPalette: { primary: '#2563eb', accent: '#f59e0b', background: '#ffffff' },
  typography: { headline: 'Inter', body: 'Inter' },
  componentStyle: { buttons: 'rounded-lg', cards: 'shadow-sm', sections: 'py-16' },
  recommendedSections: ['Hero', 'Benefícios', 'CTA'],
  avoid: [],
};

const mockVisualDirection: VisualDirection = {
  id: 'premium-commercial',
  name: 'Premium Commercial',
  summary: 'Luxury feel with conversion focus',
  mood: ['elegante', 'confiável'],
  colorStrategy: 'Blue primary with gold accent',
  typographyStrategy: 'Clean sans-serif',
  layoutStrategy: 'Spaced sections',
  imageStyle: 'Clean photography',
  motionStyle: 'Smooth transitions',
  componentStyle: 'Rounded cards with shadows',
  bestFor: ['Landing pages premium'],
  avoid: ['Cores muito vibrantes'],
};

describe('analyzeDesignSystem', () => {
  it('should detect tailwind config in project', async () => {
    const result = await analyzeDesignSystem('.');
    expect(result).toHaveProperty('hasDesignSystem');
    expect(result).toHaveProperty('hasTailwindConfig');
    expect(result).toHaveProperty('hasCssVariables');
    expect(result).toHaveProperty('hasComponentVariants');
    expect(result).toHaveProperty('hasDesignTokens');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('gaps');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('should detect project files', async () => {
    const result = await analyzeDesignSystem('.');
    expect(result.files).toBeInstanceOf(Array);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
  });

  it('should return gaps when design system is missing', async () => {
    const result = await analyzeDesignSystem('.');
    if (!result.hasDesignSystem) {
      expect(result.gaps.length).toBeGreaterThan(0);
    }
  });
});

describe('detectHardcodedVisualClasses', () => {
  it('should scan project for hardcoded classes', async () => {
    const issues = await detectHardcodedVisualClasses('.');
    expect(Array.isArray(issues)).toBe(true);
    for (const issue of issues) {
      expect(issue).toHaveProperty('file');
      expect(issue).toHaveProperty('className');
      expect(issue).toHaveProperty('line');
      expect(issue).toHaveProperty('severity');
      expect(issue).toHaveProperty('recommendation');
      expect(['high', 'medium', 'low']).toContain(issue.severity);
    }
  });
});

describe('generateDesignTokensPlan', () => {
  it('should generate color tokens from brand template', () => {
    const plan = generateDesignTokensPlan(mockBrandTemplate, mockVisualDirection);
    expect(plan.colors).toBeDefined();
    expect(plan.colors.tokens.length).toBeGreaterThan(0);
    expect(plan.colors.tokens[0]).toHaveProperty('name');
    expect(plan.colors.tokens[0]).toHaveProperty('value');
    expect(plan.colors.tokens[0]).toHaveProperty('description');
  });

  it('should generate all 6 token groups', () => {
    const plan = generateDesignTokensPlan(mockBrandTemplate, mockVisualDirection);
    expect(plan.colors.name).toBe('Colors');
    expect(plan.gradients.name).toBe('Gradients');
    expect(plan.shadows.name).toBe('Shadows');
    expect(plan.radius.name).toBe('Border Radius');
    expect(plan.motion.name).toBe('Motion');
    expect(plan.typography.name).toBe('Typography');
  });

  it('should use brand palette primary color', () => {
    const plan = generateDesignTokensPlan(mockBrandTemplate, mockVisualDirection);
    const primary = plan.colors.tokens.find(t => t.name === '--color-primary');
    expect(primary?.value).toBe('#2563eb');
  });

  it('should have typography from brand template', () => {
    const plan = generateDesignTokensPlan(mockBrandTemplate, mockVisualDirection);
    const headline = plan.typography.tokens.find(t => t.name === '--font-headline');
    expect(headline?.value).toBe('Inter');
  });
});

describe('generateShadcnVariantPlan', () => {
  it('should generate 5 component variants', () => {
    const plan = generateShadcnVariantPlan(mockBrandTemplate);
    expect(plan.length).toBe(5);
  });

  it('should include Button with 5 variants', () => {
    const plan = generateShadcnVariantPlan(mockBrandTemplate);
    const button = plan.find(c => c.component === 'Button');
    expect(button).toBeDefined();
    expect(button!.variants.length).toBe(5);
  });

  it('should include Card with interactive variant', () => {
    const plan = generateShadcnVariantPlan(mockBrandTemplate);
    const card = plan.find(c => c.component === 'Card');
    expect(card).toBeDefined();
    expect(card!.variants.some(v => v.name === 'interactive')).toBe(true);
  });
});

describe('generateDesignSystemFirstChecklist', () => {
  it('should return 15 checklist items', () => {
    const result = generateDesignSystemFirstChecklist();
    expect(result.checklist.length).toBe(15);
  });

  it('should have items in all 4 categories', () => {
    const result = generateDesignSystemFirstChecklist();
    const cats = new Set(result.checklist.map(i => i.category));
    expect(cats.has('tokens')).toBe(true);
    expect(cats.has('components')).toBe(true);
    expect(cats.has('consistency')).toBe(true);
    expect(cats.has('a11y')).toBe(true);
  });

  it('should have rule defined', () => {
    const result = generateDesignSystemFirstChecklist();
    expect(result.rule).toBeTruthy();
    expect(result.rule).toContain('Design system');
  });
});

describe('runDesignSystemEnforcer', () => {
  it('should run without brand template and return summary', async () => {
    const result = await runDesignSystemEnforcer('.');
    expect(result).toHaveProperty('analysis');
    expect(result).toHaveProperty('hardcodedIssues');
    expect(result).toHaveProperty('tokenPlan');
    expect(result).toHaveProperty('shadcnVariantPlan');
    expect(result).toHaveProperty('checklist');
    expect(result).toHaveProperty('summary');
    expect(typeof result.summary).toBe('string');
  });

  it('should generate token plan when brand template and direction provided', async () => {
    const result = await runDesignSystemEnforcer('.', mockBrandTemplate, mockVisualDirection);
    expect(result.tokenPlan).not.toBeNull();
    expect(result.shadcnVariantPlan.length).toBeGreaterThan(0);
  });

  it('should count high and medium issues in summary', async () => {
    const result = await runDesignSystemEnforcer('.');
    expect(result.summary).toContain('classes hardcoded');
  });
});
