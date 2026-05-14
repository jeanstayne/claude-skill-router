import type { RequestSignals } from '../schemas/requestRouterSchema.js';

interface ExtractInput {
  userRequest: string;
  projectPath?: string;
  explicitGoal?: string;
}

const DESIGN_ENGINE_KEYWORDS: Record<string, string[]> = {
  lovable: ['lovable', 'lovable.dev', 'estilo lovable', 'visual lovable'],
  'google-stitch': ['stitch', 'google stitch', 'design tokens', 'multi-tema'],
  v0: ['v0', 'vercel', 'shadcn', 'shadcn/ui'],
  framer: ['framer', 'marketing site', 'editorial', 'animação'],
  relume: ['relume', 'sitemap', 'wireframe', 'estrutura de seções'],
  figma: ['figma', 'design-to-code', 'pixel-perfect'],
};

const VISUAL_STYLES: Record<string, string[]> = {
  premium: ['premium', 'luxo', 'alto nível', 'sofisticado', 'elegante'],
  modern: ['moderno', 'contemporâneo', 'atual', 'clean'],
  bold: ['bold', 'impactante', 'forte', 'marcante'],
  minimal: ['minimal', 'minimalista', 'limpo', 'simples'],
  tech: ['tech', 'tecnologia', 'tecnológico', 'inovador'],
  'lovable-style': ['lovable', 'experiência completa', 'visual premium'],
};

const BUSINESS_GOALS: Record<string, string[]> = {
  conversion: ['conversão', 'converter', 'vender', 'venda', 'lead', 'capturar'],
  'lead-generation': ['lead', 'captura', 'formulário', 'contato'],
  branding: ['marca', 'brand', 'identidade', 'posicionamento'],
  engagement: ['engajar', 'engajamento', 'interação', 'comunidade'],
};

export function extractRequestSignals(input: ExtractInput): RequestSignals {
  const { userRequest, explicitGoal } = input;
  const lower = userRequest.toLowerCase();

  // Extract brand (capitalized words at start or after "para a/para o")
  let brand: string | undefined;
  const brandMatch = lower.match(/para (?:a|o) ([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/) ||
    lower.match(/(?:da|do) ([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/);
  if (brandMatch) {
    brand = brandMatch[1];
  }

  // Detect design engines mentioned
  const mentionsDesignEngine: string[] = [];
  for (const [engine, kws] of Object.entries(DESIGN_ENGINE_KEYWORDS)) {
    if (kws.some(k => lower.includes(k))) {
      mentionsDesignEngine.push(engine);
    }
  }

  // Detect visual style
  const visualStyle: string[] = [];
  for (const [style, kws] of Object.entries(VISUAL_STYLES)) {
    if (kws.some(k => lower.includes(k))) {
      visualStyle.push(style);
    }
  }

  // Detect business goals
  const businessGoal: string[] = [];
  for (const [goal, kws] of Object.entries(BUSINESS_GOALS)) {
    if (kws.some(k => lower.includes(k))) {
      businessGoal.push(goal);
    }
  }

  // Detect requested output
  let requestedOutput: string | undefined;
  if (/landing page|lp\b|landpage/.test(lower)) requestedOutput = 'landing-page';
  else if (/dashboard|painel|admin/.test(lower)) requestedOutput = 'dashboard';
  else if (/site institucional|institucional|corporativo/.test(lower)) requestedOutput = 'institutional-site';
  else if (/design system|design tokens|sistema de design/.test(lower)) requestedOutput = 'design-system';
  else if (/ecommerce|e-commerce|loja virtual|produto/.test(lower)) requestedOutput = 'ecommerce-page';

  // Keywords
  const keywords = lower.split(/[\s,;.!?]+/).filter(w => w.length > 3);

  // Stack mentions
  const mentionsStack: string[] = [];
  const stackKeywords = ['react', 'next', 'vite', 'vue', 'tailwind', 'shadcn', 'typescript'];
  for (const s of stackKeywords) {
    if (lower.includes(s)) mentionsStack.push(s);
  }

  // Confidence based on signal density
  let confidence = 0;
  if (requestedOutput) confidence += 0.3;
  if (brand) confidence += 0.1;
  if (visualStyle.length > 0) confidence += 0.15;
  if (businessGoal.length > 0) confidence += 0.1;
  if (mentionsDesignEngine.length > 0) confidence += 0.1;
  if (explicitGoal) confidence += 0.15;
  confidence = Math.min(confidence + 0.1, 1);

  return {
    brand,
    requestedOutput,
    visualStyle,
    businessGoal,
    keywords,
    mentionsDesignEngine,
    mentionsStack,
    confidence: Math.round(confidence * 100) / 100,
  };
}
