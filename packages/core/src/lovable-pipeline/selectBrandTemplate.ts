// Phase 15.7 — Brand Template Selector
// Selects brand template based on brand name, project type, intent, keywords, and segment hints.

import type { BrandTemplate } from '../schemas/lovablePipelineSchema.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

function getTemplatesDir(): string {
  return path.resolve(import.meta.dirname, '../../../../registry/brand-templates');
}

const BRAND_TEMPLATE_MAP: Record<string, string> = {
  samar: 'automotive-premium',
  ativaagro: 'agro-institutional',
  optoscreen: 'tech-product-lp',
  'destaque agro': 'agro-institutional',
  'destaque system': 'hr-consulting-saas',
  nanoai: 'ai-consulting',
  ellegance: 'health-beauty-premium',
  'jk perfumes': 'perfume-luxury',
  elizê: 'fashion-lifestyle',
};

const PROJECT_TYPE_TEMPLATE_MAP: Record<string, string> = {
  'landing-page': 'tech-product-lp',
  'dashboard-saas': 'b2b-saas',
  'institutional-site': 'agro-institutional',
  'ecommerce-page': 'fashion-lifestyle',
};

const KEYWORD_TEMPLATE_HINTS: Record<string, string> = {
  veículo: 'automotive-premium',
  veículos: 'automotive-premium',
  carro: 'automotive-premium',
  agro: 'agro-institutional',
  agrícola: 'agro-institutional',
  fazenda: 'agro-institutional',
  soja: 'agro-institutional',
  ia: 'ai-consulting',
  inteligência: 'ai-consulting',
  artificial: 'ai-consulting',
  saas: 'b2b-saas',
  software: 'b2b-saas',
  plataforma: 'b2b-saas',
  rh: 'hr-consulting-saas',
  recrutamento: 'hr-consulting-saas',
  perfume: 'perfume-luxury',
  beleza: 'health-beauty-premium',
  saúde: 'health-beauty-premium',
  moda: 'fashion-lifestyle',
  roupa: 'fashion-lifestyle',
  tech: 'tech-product-lp',
  tecnologia: 'tech-product-lp',
};

interface SelectBrandTemplateInput {
  brand?: string;
  projectType?: string;
  intent?: string;
  userRequest: string;
}

export async function selectBrandTemplate(input: SelectBrandTemplateInput): Promise<{
  template: BrandTemplate | null;
  templateId: string;
  confidence: number;
  warnings: string[];
}> {
  const { brand, projectType, userRequest } = input;
  const warnings: string[] = [];
  const lower = userRequest.toLowerCase();
  let templateId = '';
  let confidence = 0;

  // 1. Brand direct match
  if (brand) {
    const brandLower = brand.toLowerCase();
    for (const [key, id] of Object.entries(BRAND_TEMPLATE_MAP)) {
      if (brandLower.includes(key) || key.includes(brandLower)) {
        templateId = id;
        confidence = 0.9;
        break;
      }
    }
  }

  // 2. Brand from request
  if (!templateId) {
    for (const [key, id] of Object.entries(BRAND_TEMPLATE_MAP)) {
      if (lower.includes(key)) {
        templateId = id;
        confidence = 0.85;
        break;
      }
    }
  }

  // 3. Project type
  if (!templateId && projectType && PROJECT_TYPE_TEMPLATE_MAP[projectType]) {
    templateId = PROJECT_TYPE_TEMPLATE_MAP[projectType];
    confidence = 0.5;
  }

  // 4. Keyword heuristics
  if (!templateId) {
    for (const [keyword, id] of Object.entries(KEYWORD_TEMPLATE_HINTS)) {
      if (lower.includes(keyword)) {
        templateId = id;
        confidence = 0.4;
        break;
      }
    }
  }

  // 5. Fallback
  if (!templateId) {
    templateId = 'tech-product-lp';
    confidence = 0.2;
    warnings.push('Nenhum template de marca identificado. Usando fallback conservador (tech-product-lp).');
  }

  if (confidence < 0.5) {
    warnings.push(`Confiança baixa (${(confidence * 100).toFixed(0)}%) na seleção do template "${templateId}". Considere revisar.`);
  }

  // Load template from registry
  let template: BrandTemplate | null = null;
  try {
    const templatePath = path.join(getTemplatesDir(), `${templateId}.json`);
    const content = await fs.readFile(templatePath, 'utf-8');
    template = JSON.parse(content) as BrandTemplate;
  } catch {
    warnings.push(`Template "${templateId}" não encontrado no registry.`);
  }

  return { template, templateId, confidence, warnings };
}
