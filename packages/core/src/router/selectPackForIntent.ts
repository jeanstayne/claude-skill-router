import type { Intent, RequestSignals } from '../schemas/requestRouterSchema.js';

interface SelectPackInput {
  intent: Intent;
  projectType: string;
  framework: string;
  ui: string[];
  signals: RequestSignals;
  explicitPack?: string;
  allowAdvanced?: boolean;
}

const INTENT_PACK_MAP: Record<string, { packId: string; conditions?: (signals: RequestSignals) => boolean }> = {
  'create-landing-page': {
    packId: 'lovable-premium-lp',
    conditions: (s) => s.visualStyle.includes('premium') || s.mentionsDesignEngine.includes('lovable'),
  },
  'create-landing-page-fallback': { packId: 'landing-page' },
  'improve-landing-page': { packId: 'landing-page' },
  'create-dashboard': {
    packId: 'v0-dashboard-ui',
    conditions: (s) => s.mentionsDesignEngine.includes('v0') || s.mentionsStack.includes('shadcn'),
  },
  'create-dashboard-fallback': { packId: 'dashboard-saas' },
  'improve-dashboard': { packId: 'dashboard-saas' },
  'create-institutional-site': { packId: 'institutional-site' },
  'convert-visual-reference-to-code': { packId: 'visual-reference-to-code' },
  'plan-website-structure': { packId: 'relume-website-planning' },
  'create-design-system': { packId: 'stitch-visual-system' },
  'review-visual-quality': { packId: 'landing-page' },
  'improve-copy': { packId: 'landing-page' },
  'prepare-project': { packId: 'landing-page' },
  // Phase 14 — New intent mappings
  'generate-site-images': { packId: 'visual-asset-generation-stack' },
  'create-hero-visual': { packId: 'visual-asset-generation-stack' },
  'create-image-prompts': { packId: 'visual-asset-generation-stack' },
  'improve-headlines': { packId: 'marketing-copy-optimization-stack' },
  'improve-marketing-copy': { packId: 'marketing-copy-optimization-stack' },
  'audit-page-cro': { packId: 'seo-cro-growth-stack' },
  'optimize-form-cro': { packId: 'seo-cro-growth-stack' },
  'optimize-popup-cro': { packId: 'seo-cro-growth-stack' },
  'optimize-seo': { packId: 'seo-cro-growth-stack' },
  'add-schema-markup': { packId: 'seo-cro-growth-stack' },
  'create-content-strategy': { packId: 'seo-cro-growth-stack' },
  'create-programmatic-seo-pages': { packId: 'seo-cro-growth-stack' },
  'create-ad-creative': { packId: 'paid-campaign-stack' },
  'create-paid-ads': { packId: 'paid-campaign-stack' },
  'create-social-content': { packId: 'social-launch-stack' },
  'create-email-sequence': { packId: 'social-launch-stack' },
  'create-launch-strategy': { packId: 'social-launch-stack' },
  'create-product-marketing-context': { packId: 'marketing-copy-optimization-stack' },
  'extract-design-system': { packId: 'design-system-extraction-stack' },
  'audit-website': { packId: 'seo-cro-growth-stack' },
  'unknown': { packId: 'none' },
};

export function selectPackForIntent(input: SelectPackInput): {
  packId: string;
  reason: string;
  confidence: number;
} {
  const { intent, signals, explicitPack, allowAdvanced } = input;

  if (explicitPack) {
    return { packId: explicitPack, reason: 'Pack explicitamente solicitado', confidence: 1 };
  }

  if (intent === 'unknown') {
    return { packId: 'none', reason: 'Intenção desconhecida — não aplicar automaticamente', confidence: 0 };
  }

  // Check if premium/advanced conditions are met
  if (intent === 'create-landing-page') {
    const premiumCondition = INTENT_PACK_MAP['create-landing-page'].conditions;
    if (premiumCondition && premiumCondition(signals) && allowAdvanced !== false) {
      return {
        packId: 'lovable-premium-lp',
        reason: 'Pedido premium detectado (estilo visual premium + design engine Lovable)',
        confidence: 0.85,
      };
    }
    return { packId: 'landing-page', reason: 'Pack padrão para landing page', confidence: 0.75 };
  }

  if (intent === 'create-dashboard') {
    const dashCondition = INTENT_PACK_MAP['create-dashboard'].conditions;
    if (dashCondition && dashCondition(signals) && allowAdvanced !== false) {
      return {
        packId: 'v0-dashboard-ui',
        reason: 'Dashboard com Shadcn/UI e v0 detectado',
        confidence: 0.85,
      };
    }
    return { packId: 'dashboard-saas', reason: 'Pack padrão para dashboard', confidence: 0.75 };
  }

  // Direct mapping
  const mapping = INTENT_PACK_MAP[intent];
  if (mapping && !mapping.conditions) {
    return { packId: mapping.packId, reason: `Pack correspondente para intenção: ${intent}`, confidence: 0.8 };
  }

  return { packId: 'none', reason: `Nenhum pack mapeado para intenção: ${intent}`, confidence: 0.1 };
}
