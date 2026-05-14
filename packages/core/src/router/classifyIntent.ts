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
