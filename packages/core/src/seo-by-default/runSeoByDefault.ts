// Phase 16.3 — SEO by Default orchestrator
// Analyzes project, generates SEO plan, metadata plan, JSON-LD, and semantic HTML checklist.

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { generateSeoPlan, type SeoPlan } from './generateSeoPlan.js';
import { generateMetadataPlan, type MetadataPlan } from './generateMetadataPlan.js';
import { generateJsonLdPlan, type JsonLdPlan } from './generateJsonLdPlan.js';
import { generateSemanticHtmlChecklist, type SemanticHtmlChecklist } from './generateSemanticHtmlChecklist.js';
import type { ProductMarketingContext } from '../schemas/lovablePipelineSchema.js';

export interface SeoByDefaultResult {
  seoPlan: SeoPlan;
  metadataPlan: MetadataPlan;
  jsonLdPlan: JsonLdPlan;
  semanticHtmlChecklist: SemanticHtmlChecklist;
  missingTags: string[];
  summary: string;
}

export async function runSeoByDefault(
  projectPath: string,
  ctx: ProductMarketingContext,
  opts?: {
    baseUrl?: string;
    imageUrl?: string;
    phone?: string;
    email?: string;
    address?: { street?: string; city?: string; state?: string; zip?: string; country?: string };
    price?: string;
    faqs?: Array<{ question: string; answer: string }>;
    applicationCategory?: string;
  },
): Promise<SeoByDefaultResult> {
  const seoPlan = generateSeoPlan({
    brand: ctx.brand,
    productOrService: ctx.productOrService,
    audience: ctx.audience,
    primaryPain: ctx.primaryPain,
    primaryDesire: ctx.primaryDesire,
    offer: ctx.offer,
    imageUrl: opts?.imageUrl,
  });

  const metadataPlan = generateMetadataPlan({
    baseUrl: opts?.baseUrl,
    brand: ctx.brand,
  });

  const jsonLdPlan = generateJsonLdPlan({
    brand: ctx.brand,
    productOrService: ctx.productOrService,
    url: opts?.baseUrl,
    description: ctx.offer,
    phone: opts?.phone,
    email: opts?.email,
    streetAddress: opts?.address?.street,
    city: opts?.address?.city,
    state: opts?.address?.state,
    zip: opts?.address?.zip,
    country: opts?.address?.country,
    price: opts?.price,
    imageUrl: opts?.imageUrl,
    faqs: opts?.faqs,
    applicationCategory: opts?.applicationCategory,
  });

  const semanticHtmlChecklist = generateSemanticHtmlChecklist();

  const missingTags = await checkExistingMetaTags(projectPath);

  const summary = `SEO plan gerado: ${seoPlan.title.content.slice(0, 50)}... | ${jsonLdPlan.blocks.length} JSON-LD blocks | ${seoPlan.warnings.length} warnings`;

  return { seoPlan, metadataPlan, jsonLdPlan, semanticHtmlChecklist, missingTags, summary };
}

async function checkExistingMetaTags(projectPath: string): Promise<string[]> {
  const missing: string[] = [];
  const checks = [
    { file: 'index.html', patterns: [{ regex: /<title[^>]*>/i, label: 'Tag <title>' }, { regex: /meta\s+name=["']description["']/i, label: 'Meta description' }, { regex: /meta\s+property=["']og:title["']/i, label: 'og:title' }, { regex: /meta\s+property=["']og:description["']/i, label: 'og:description' }, { regex: /meta\s+property=["']og:image["']/i, label: 'og:image' }, { regex: /meta\s+name=["']twitter:card["']/i, label: 'twitter:card' }, { regex: /link\s+rel=["']canonical["']/i, label: 'Canonical link' }, { regex: /application\/ld\+json/i, label: 'JSON-LD' }] },
  ];

  for (const { file, patterns } of checks) {
    try {
      const content = await fs.readFile(path.join(projectPath, file), 'utf-8');
      for (const { regex, label } of patterns) {
        if (!regex.test(content)) missing.push(label);
      }
    } catch {
      missing.push(...patterns.map(p => p.label));
    }
  }

  return missing;
}
