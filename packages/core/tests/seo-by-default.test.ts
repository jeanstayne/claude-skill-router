import { describe, it, expect } from 'vitest';
import { generateSeoPlan } from '../src/seo-by-default/generateSeoPlan.js';
import { generateMetadataPlan } from '../src/seo-by-default/generateMetadataPlan.js';
import { generateJsonLdPlan } from '../src/seo-by-default/generateJsonLdPlan.js';
import { generateSemanticHtmlChecklist } from '../src/seo-by-default/generateSemanticHtmlChecklist.js';

describe('generateSeoPlan', () => {
  it('should generate title with brand and product', () => {
    const plan = generateSeoPlan({
      brand: 'Samar Veículos',
      productOrService: 'Landing Page Premium',
    });
    expect(plan.title.content).toContain('Samar Veículos');
    expect(plan.title.content).toContain('Landing Page Premium');
  });

  it('should enforce title max 60 chars', () => {
    const plan = generateSeoPlan({
      brand: 'Samar Veículos',
      productOrService: 'Landing Page Premium',
    });
    expect(plan.title.currentLength).toBeLessThanOrEqual(60);
  });

  it('should enforce meta description max 160 chars', () => {
    const plan = generateSeoPlan({
      brand: 'Samar Veículos',
      productOrService: 'Consultoria Premium em Agronegócio',
    });
    expect(plan.metaDescription.currentLength).toBeLessThanOrEqual(160);
  });

  it('should include offer in title when provided', () => {
    const plan = generateSeoPlan({
      brand: 'Destaque Agro',
      productOrService: 'Consultoria',
      offer: 'Resultados Garantidos',
    });
    expect(plan.title.content).toContain('Resultados Garantidos');
  });

  it('should generate OG and Twitter tags', () => {
    const plan = generateSeoPlan({
      brand: 'NanoAI',
      productOrService: 'IA para Diagnóstico',
    });
    expect(plan.ogTitle.name).toBe('og:title');
    expect(plan.ogType.content).toBe('website');
    expect(plan.twitterCard.content).toBe('summary_large_image');
  });

  it('should warn when title exceeds 60 chars', () => {
    const plan = generateSeoPlan({
      brand: 'Empresa com nome muito longo para caber no título de SEO',
      productOrService: 'Serviço com descrição extremamente detalhada e longa',
    });
    if (plan.title.currentLength > 60) {
      expect(plan.warnings.length).toBeGreaterThan(0);
    }
  });
});

describe('generateMetadataPlan', () => {
  it('should generate canonical when baseUrl provided', () => {
    const plan = generateMetadataPlan({
      baseUrl: 'https://samar.com.br',
      path: '/lp/premium',
    });
    expect(plan.canonical).not.toBeNull();
    expect(plan.canonical!.attributes.href).toContain('samar.com.br');
  });

  it('should include robots index,follow', () => {
    const plan = generateMetadataPlan({});
    expect(plan.robots.attributes.content).toBe('index, follow');
  });

  it('should include viewport meta', () => {
    const plan = generateMetadataPlan({});
    expect(plan.viewport.attributes.content).toContain('width=device-width');
  });

  it('should handle missing baseUrl gracefully', () => {
    const plan = generateMetadataPlan({});
    expect(plan.canonical).toBeNull();
    expect(plan.hreflang.length).toBe(0);
  });

  it('should add favicon links', () => {
    const plan = generateMetadataPlan({});
    expect(plan.favicon.length).toBeGreaterThan(0);
    expect(plan.favicon[0].attributes.rel).toBe('icon');
  });
});

describe('generateJsonLdPlan', () => {
  it('should always include Organization', () => {
    const plan = generateJsonLdPlan({
      brand: 'Samar',
      productOrService: 'Veículos',
    });
    const org = plan.blocks.find(b => b.type === 'Organization');
    expect(org).toBeDefined();
    expect(org!.priority).toBe('high');
    expect(org!.injectLocation).toBe('head');
  });

  it('should include LocalBusiness when address provided', () => {
    const plan = generateJsonLdPlan({
      brand: 'Samar',
      productOrService: 'Veículos',
      streetAddress: 'Av. Paulista, 1000',
      city: 'São Paulo',
    });
    const lb = plan.blocks.find(b => b.type === 'LocalBusiness');
    expect(lb).toBeDefined();
  });

  it('should include Product when price provided', () => {
    const plan = generateJsonLdPlan({
      brand: 'Destaque Agro',
      productOrService: 'Consultoria',
      price: 'R$ 5.000',
    });
    const product = plan.blocks.find(b => b.type === 'Product');
    expect(product).toBeDefined();
  });

  it('should include FAQPage when faqs provided', () => {
    const plan = generateJsonLdPlan({
      brand: 'NanoAI',
      productOrService: 'IA',
      faqs: [{ question: 'Como funciona?', answer: 'Funciona assim...' }],
    });
    const faq = plan.blocks.find(b => b.type === 'FAQPage');
    expect(faq).toBeDefined();
  });

  it('should include SoftwareApplication when category provided', () => {
    const plan = generateJsonLdPlan({
      brand: 'NanoAI',
      productOrService: 'IA Diagnóstico',
      applicationCategory: 'HealthApplication',
    });
    const app = plan.blocks.find(b => b.type === 'SoftwareApplication');
    expect(app).toBeDefined();
  });
});

describe('generateSemanticHtmlChecklist', () => {
  it('should return 15 checklist items', () => {
    const result = generateSemanticHtmlChecklist();
    expect(result.checklist.length).toBe(15);
  });

  it('should have items in all categories', () => {
    const result = generateSemanticHtmlChecklist();
    const cats = new Set(result.checklist.map(i => i.category));
    expect(cats.has('structure')).toBe(true);
    expect(cats.has('headings')).toBe(true);
    expect(cats.has('images')).toBe(true);
    expect(cats.has('links')).toBe(true);
    expect(cats.has('forms')).toBe(true);
    expect(cats.has('aria')).toBe(true);
    expect(cats.has('performance')).toBe(true);
  });

  it('should have rule about semantic HTML', () => {
    const result = generateSemanticHtmlChecklist();
    expect(result.rule).toContain('HTML');
  });
});
