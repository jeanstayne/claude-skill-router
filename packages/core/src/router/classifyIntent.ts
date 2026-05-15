import type { Intent } from '../schemas/requestRouterSchema.js';
import type { RequestSignals } from '../schemas/requestRouterSchema.js';

interface ClassificationInput {
  userRequest: string;
  signals: RequestSignals;
  projectScan?: { projectType: string };
}

const INTENT_PATTERNS: Array<{ intent: Intent; patterns: RegExp[]; priority: number }> = [
  {
    intent: 'create-landing-page',
    patterns: [
      /cri[eua]r?\s+(?:uma\s+)?(?:nova\s+)?(?:landing page|lp|landpage)/i,
      /(?:landing page|lp|landpage)\s+(?:premium|nova|do zero)/i,
      /prepar[ea]r?\s+(?:uma\s+)?(?:landing page|lp)/i,
    ],
    priority: 10,
  },
  {
    intent: 'improve-landing-page',
    patterns: [
      /melhor[ae]r?\s+(?:\w+\s+)?(?:landing page|lp)/i,
      /otimizar\s+(?:\w+\s+)?(?:landing page|lp)/i,
      /refatorar\s+(?:\w+\s+)?(?:landing page|lp)/i,
    ],
    priority: 9,
  },
  {
    intent: 'create-dashboard',
    patterns: [
      /cri[eua]r?\s+(?:um\s+)?(?:dashboard|painel)/i,
      /(?:dashboard|painel)\s+(?:novo|do zero)/i,
    ],
    priority: 10,
  },
  {
    intent: 'improve-dashboard',
    patterns: [
      /melhor[ae]r?\s+(?:\w+\s+)?(?:dashboard|painel)/i,
      /otimizar\s+(?:\w+\s+)?(?:dashboard|painel)/i,
    ],
    priority: 9,
  },
  {
    intent: 'plan-website-structure',
    patterns: [
      /(?:sitemap|wireframe|estrutura do site|arquitetura (?:de|do) (?:informação|site))/i,
      /planej[ae]r?\s+(?:o\s+)?(?:site|página)/i,
      /seções\s+(?:do|da)\s+(?:site|página)/i,
    ],
    priority: 8,
  },
  {
    intent: 'convert-visual-reference-to-code',
    patterns: [
      /transform[ae]r?\s+(?:esse\s+)?(?:print|imagem|referência|layout)/i,
      /converter\s+(?:print|imagem|referência)/i,
      /(?:print|screenshot|imagem)\s+(?:para|em)\s+(?:código|code|layout)/i,
    ],
    priority: 8,
  },
  {
    intent: 'review-visual-quality',
    patterns: [
      /(?:qa visual|revisão visual|revisar (?:o|a) (?:visual|design|ui))/i,
      /auditoria\s+(?:visual|de design)/i,
      /verificar\s+(?:o|a)\s+(?:visual|design|qualidade)/i,
    ],
    priority: 7,
  },
  {
    intent: 'improve-copy',
    patterns: [
      /melhor[ae]r?\s+(?:a\s+)?(?:copy|texto|copywriting)/i,
      /(?:copy|texto)\s+(?:de|da)\s+(?:conversão|oferta)/i,
      /reescrever\s+(?:o\s+)?(?:texto|copy)/i,
    ],
    priority: 7,
  },
  {
    intent: 'create-design-system',
    patterns: [
      /cri[eua]r?\s+(?:um\s+)?(?:design system|sistema de design)/i,
      /(?:design tokens|tokens de design)/i,
      /(?:design system|sistema de design)\s+(?:novo|do zero)/i,
    ],
    priority: 8,
  },
  {
    intent: 'create-institutional-site',
    patterns: [
      /cri[eua]r?\s+(?:um\s+)?(?:site institucional|site corporativo|site de empresa)/i,
      /(?:site institucional|institucional)\s+(?:novo|do zero)/i,
    ],
    priority: 9,
  },
  {
    intent: 'prepare-project',
    patterns: [
      /prepar[ae]r?\s+(?:o\s+)?(?:projeto|workspace)/i,
      /configurar\s+(?:o\s+)?(?:projeto|ambiente)/i,
    ],
    priority: 5,
  },
  // Phase 14 — Image generation
  {
    intent: 'generate-site-images',
    patterns: [
      /(?:cri[eua]r?|ger[ae]r?|gerar)\s+(?:imagens|imagem|assets? visuais?)/i,
      /(?:ger[ae]r?|fazer)\s+(?:uma\s+)?(?:imagem|imagens)\s+(?:para|do)\s+(?:site|lp|landing|hero)/i,
      /(?:preciso|quero)\s+(?:de\s+)?(?:imagens|imagem)/i,
    ],
    priority: 8,
  },
  {
    intent: 'create-hero-visual',
    patterns: [
      /(?:hero|banner)\s+(?:visual|image|imagem)/i,
      /(?:cri[eua]r?|fazer)\s+(?:o\s+)?(?:hero|banner)/i,
    ],
    priority: 8,
  },
  {
    intent: 'create-image-prompts',
    patterns: [
      /prompts?\s+(?:para|de)\s+(?:imagem|imagens)/i,
      /(?:prompt|brief)\s+(?:de|para)\s+(?:geração de\s+)?(?:imagem|visual)/i,
    ],
    priority: 7,
  },
  // Phase 14 — Copy/Marketing
  {
    intent: 'improve-headlines',
    patterns: [
      /melhor[ae]r?\s+(?:\w+\s+)?(?:headlines?|títulos?)/i,
      /(?:headline|título)\s+(?:de|da)\s+(?:lp|landing|página)/i,
      /cri[eua]r?\s+(?:nov[ao]s?\s+)?(?:headlines?|títulos?)/i,
    ],
    priority: 8,
  },
  {
    intent: 'improve-marketing-copy',
    patterns: [
      /melhor[ae]r?\s+(?:a\s+)?(?:copy|copywriting|marketing copy)\s+(?:de|da|do|para)\s+(?:marketing|conversão|oferta)/i,
      /(?:copy|copywriting)\s+(?:de|da)\s+(?:conversão|oferta|página)/i,
    ],
    priority: 8,
  },
  // Phase 14 — CRO
  {
    intent: 'audit-page-cro',
    patterns: [
      /(?:auditoria|análise)\s+(?:de\s+)?(?:cro|conversão)/i,
      /(?:cro|conversão)\s+(?:da|do|na)\s+(?:página|site|lp)/i,
      /otimizar\s+(?:a\s+)?(?:conversão|taxa de conversão)/i,
      /(?:audit[ae]r?|analis[ae]r?)\s+(?:o\s+)?(?:cro|conversão)/i,
    ],
    priority: 7,
  },
  {
    intent: 'optimize-form-cro',
    patterns: [
      /otimizar\s+(?:o\s+)?(?:formulário|form)/i,
      /(?:formulário|form)\s+(?:de|para)\s+(?:lead|captura)/i,
    ],
    priority: 7,
  },
  {
    intent: 'optimize-popup-cro',
    patterns: [
      /otimizar\s+(?:o\s+)?(?:popup|modal)/i,
      /(?:popup|modal)\s+(?:de|para)\s+(?:saída|conversão)/i,
    ],
    priority: 7,
  },
  // Phase 14 — SEO
  {
    intent: 'optimize-seo',
    patterns: [
      /(?:seo|otimização)\s+(?:para|de)\s+(?:busca|google|tráfego)/i,
      /melhor[ae]r?\s+(?:o\s+)?(?:seo|rankeamento)/i,
      /(?:auditoria|análise)\s+(?:de\s+)?(?:seo|search)/i,
      /otimiz[ae]r?\s+(?:o\s+)?(?:seo|search engine)/i,
    ],
    priority: 7,
  },
  {
    intent: 'create-content-strategy',
    patterns: [
      /estratégia\s+(?:de|para)\s+(?:conteúdo|conteudo|content)/i,
      /cri[eua]r?\s+(?:estratégia|planejamento)\s+(?:de|para)\s+(?:conteúdo|conteudo|content)/i,
    ],
    priority: 7,
  },
  {
    intent: 'create-programmatic-seo-pages',
    patterns: [
      /(?:páginas?|paginas?)\s+(?:de\s+)?(?:seo\s+)?programátic[ao]s?/i,
      /seo\s+programático/i,
    ],
    priority: 8,
  },
  {
    intent: 'add-schema-markup',
    patterns: [
      /(?:schema|rich results|dados estruturados|json.ld)/i,
      /adicionar\s+(?:schema|markup)/i,
    ],
    priority: 8,
  },
  // Phase 14 — Ads/Social
  {
    intent: 'create-ad-creative',
    patterns: [
      /cri[eua]r?\s+(?:anúncios?|ads?|criativos?)\s+(?:para|de)/i,
      /(?:criativo|creative)\s+(?:de|para)\s+(?:anúncio|ad)/i,
    ],
    priority: 7,
  },
  {
    intent: 'create-paid-ads',
    patterns: [
      /campanha\s+(?:paga|de\s+(?:ads?|anúncios?|tráfego pago))/i,
      /cri[eua]r?\s+(?:campanha|estratégia)\s+(?:de\s+)?(?:ads?|anúncios?|tráfego pago|m[ií]dia paga)/i,
      /(?:google ads|meta ads|facebook ads|tráfego pago)/i,
    ],
    priority: 8,
  },
  {
    intent: 'create-social-content',
    patterns: [
      /cri[eua]r?\s+(?:posts?|conteúdo)\s+(?:para|de)\s+(?:instagram|social|redes)/i,
      /(?:social media|redes sociais|instagram|reels)/i,
      /pacote\s+(?:de\s+)?(?:posts?|conteúdo)\s+(?:para|de)\s+(?:social|instagram)/i,
    ],
    priority: 7,
  },
  {
    intent: 'create-email-sequence',
    patterns: [
      /cri[eua]r?\s+(?:uma\s+)?(?:sequência|emails?)\s+(?:de|para)\s+(?:email|nutrição|onboarding)/i,
      /(?:email|newsletter)\s+(?:sequence|sequência)/i,
      /sequência\s+(?:de|para)\s+(?:emails?|nutrição|onboarding)/i,
    ],
    priority: 7,
  },
  {
    intent: 'create-launch-strategy',
    patterns: [
      /(?:lançamento|lançar|go.to.market|g2m)\s+(?:de|do|da)/i,
      /estratégia\s+(?:de|para)\s+(?:lançamento|go.to.market)/i,
    ],
    priority: 6,
  },
  // Phase 14 — Design system extraction
  {
    intent: 'extract-design-system',
    patterns: [
      /extrair\s+(?:o\s+)?(?:design system|estilo|tokens)/i,
      /(?:design system|sistema de design)\s+(?:de|da|do)\s+(?:referência|site)/i,
    ],
    priority: 7,
  },
  // Phase 14 — Website audit
  {
    intent: 'audit-website',
    patterns: [
      /audit[ae]r?\s+(?:o\s+)?(?:site|website|página)/i,
      /(?:auditoria|audit)\s+(?:completa|total)\s+(?:do|da)\s+(?:site|website)/i,
    ],
    priority: 6,
  },
];

export function classifyIntent(input: ClassificationInput): { intent: Intent; confidence: number } {
  const { userRequest, signals } = input;

  // Try patterns first
  const matches: Array<{ intent: Intent; priority: number }> = [];
  for (const rule of INTENT_PATTERNS) {
    for (const pattern of rule.patterns) {
      if (pattern.test(userRequest)) {
        matches.push({ intent: rule.intent, priority: rule.priority });
        break;
      }
    }
  }

  if (matches.length > 0) {
    matches.sort((a, b) => b.priority - a.priority);
    const top = matches[0];
    // Confidence based on signals + match count
    const baseConf = 0.6 + matches.length * 0.1 + signals.confidence * 0.3;
    return { intent: top.intent, confidence: Math.min(baseConf, 1) };
  }

  // Fallback: use signals to guess
  if (signals.requestedOutput === 'landing-page') {
    return { intent: 'create-landing-page', confidence: 0.55 + signals.confidence * 0.3 };
  }
  if (signals.requestedOutput === 'dashboard') {
    return { intent: 'create-dashboard', confidence: 0.55 + signals.confidence * 0.3 };
  }
  if (signals.requestedOutput === 'institutional-site') {
    return { intent: 'create-institutional-site', confidence: 0.55 + signals.confidence * 0.3 };
  }
  if (/(?:lp|landing|page|página)/i.test(userRequest)) {
    return { intent: 'create-landing-page', confidence: 0.4 };
  }
  if (/(?:dashboard|painel)/i.test(userRequest)) {
    return { intent: 'create-dashboard', confidence: 0.4 };
  }

  return { intent: 'unknown', confidence: 0.2 };
}
