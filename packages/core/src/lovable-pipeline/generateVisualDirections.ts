// Phase 15.5 — Visual Direction Generator
// Generates 3 visual directions: Premium Comercial, Editorial Clean, Conversão de Impacto

import type { VisualDirection } from '../schemas/lovablePipelineSchema.js';
import type { ProductMarketingContext } from '../schemas/lovablePipelineSchema.js';

interface GenerateVisualDirectionsInput {
  userRequest: string;
  productMarketingContext: ProductMarketingContext;
  stylePreference?: string;
}

function buildPremiumComercial(ctx: ProductMarketingContext): VisualDirection {
  return {
    id: 'premium-commercial',
    name: 'Premium Comercial',
    summary: `Visual comercial premium para ${ctx.brand} — confiança, profissionalismo e conversão com paleta sofisticada.`,
    mood: ['confiante', 'premium', 'comercial', 'acolhedor', 'profissional'],
    colorStrategy: `Paleta dominante com cor principal da marca ${ctx.brand} + neutros quentes (off-white, warm gray) + accent contrastante para CTAs. Fundo claro premium com profundidade sutil.`,
    typographyStrategy: 'Headlines em sans-serif bold condensado (ex: Plus Jakarta Sans, Inter Tight). Body em sans-serif de alta legibilidade (ex: Inter, SF Pro). Contraste tipográfico claro com scale generoso.',
    layoutStrategy: 'Hero full-height com imagem de fundo ou gradiente premium. Seções com bastante espaço negativo. Cards com bordas suaves e sombras sutis. Grid de 12 colunas com max-width 1280px.',
    imageStyle: 'Fotografia profissional com iluminação natural, pessoas reais em contexto, profundidade de campo, composição com espaço para copy. Evitar stock photos genéricas.',
    motionStyle: 'Animações sutis de entrada (fade-in + slide-up). Scroll-triggered reveals. Hover states com transições suaves (200-300ms ease-out). Parallax sutil no hero.',
    componentStyle: 'Botões com border-radius 8-12px, cores contrastantes. Cards com glass morphism sutil ou bordas finas. Seções alternando fundo claro/neutro.',
    bestFor: ['Landing pages de conversão', 'Sites institucionais premium', 'Marcas que querem transmitir confiança e profissionalismo'],
    avoid: ['cores muito vibrantes', 'tipografia decorativa', 'animações agressivas', 'layout muito carregado', 'stock photos genéricas'],
  };
}

function buildEditorialClean(ctx: ProductMarketingContext): VisualDirection {
  return {
    id: 'editorial-clean',
    name: 'Editorial Clean',
    summary: `Design editorial limpo para ${ctx.brand} — tipografia forte, espaços generosos, foco em conteúdo e narrativa visual.`,
    mood: ['editorial', 'clean', 'sofisticado', 'minimalista', 'narrativo'],
    colorStrategy: 'Paleta monocromática com um accent pontual. Preto, branco e cinzas como base. Uma cor de destaque usada com moderação (CTA, links, detalhes). Alto contraste tipográfico.',
    typographyStrategy: 'Headlines em serif display ou sans-serif geométrica com tracking negativo. Body com line-height generoso (1.6-1.8). Hierarquia clara com scale modular. Uso de weight contrast (bold headlines vs regular body).',
    layoutStrategy: 'Layout assimétrico controlado. Largura máxima de texto 680px para legibilidade. Imagens full-bleed intercaladas com texto. Bastante espaço negativo. Grid editorial com colunas variáveis.',
    imageStyle: 'Fotografia editorial com composição cuidada. Preto e branco ou dessaturado. Close-ups e detalhes. Iluminação dramática controlada. Aspect ratios não convencionais (3:2, 4:5).',
    motionStyle: 'Animações mínimas e elegantes. Fade-in simples. Parallax de baixa intensidade. Transições de página suaves. Scroll progressivo sem distrações.',
    componentStyle: 'Componentes minimalistas. Bordas finas ou sem bordas. Shadow minimal ou flat. Inputs com underline simples. CTAs com animação sutil de hover (expand ou color shift).',
    bestFor: ['Sites de marca/portfolio', 'Landing pages de produto premium', 'Sites institucionais com foco em conteúdo', 'Marcas de luxo e lifestyle'],
    avoid: ['glass morphism', 'gradientes chamativos', 'muitas cores', 'animações complexas', 'layout muito comercial'],
  };
}

function buildConversaoImpacto(ctx: ProductMarketingContext): VisualDirection {
  return {
    id: 'conversao-impacto',
    name: 'Conversão de Impacto',
    summary: `Design focado em conversão para ${ctx.brand} — CTAs fortes, prova social proeminente, urgência ética e fluxo persuasivo.`,
    mood: ['impactante', 'persuasivo', 'direto', 'confiante', 'enérgico'],
    colorStrategy: 'Paleta de alto contraste. Cores vibrantes para CTAs e elementos de conversão. Fundo claro ou escuro com bastante contraste. Uso estratégico de cores quentes (laranja, vermelho) para urgência e CTAs.',
    typographyStrategy: 'Headlines curtas e impactantes em bold/black. Números e stats em display grande. CTAs com verbos de ação. Body direto e scannable com bullet points e destaque em bold.',
    layoutStrategy: 'Layout vertical direto com seções de conversão empilhadas. Hero com headline + CTA visível sem scroll. Seções: Hero → Prova Social → Benefícios → Objeções → Garantia → CTA Final. Cada seção com um CTA visível.',
    imageStyle: 'Imagens de resultado/transformação. Antes/depois. Pessoas reais usando o produto. Infográficos e dados visuais. Fotos de clientes reais (evitar stock).',
    motionStyle: 'Animações de atenção em CTAs (pulse sutil, glow). Count-up em números/stats. Scroll progressivo com sticky CTA. Micro-interações em elementos clicáveis.',
    componentStyle: 'CTAs grandes, coloridos e com alta prioridade visual. Cards de depoimentos com foto real. Seções de prova social com logos e números. Formulários curtos e diretos. Contador ou indicador de urgência (se ético).',
    bestFor: ['Landing pages de venda direta', 'Páginas de captura de lead', 'Lançamentos de produto', 'Campanhas de alta conversão'],
    avoid: ['design muito sutil', 'CTAs escondidos', 'tipografia pequena', 'falta de prova social', 'formulários longos'],
  };
}

export function generateVisualDirections(input: GenerateVisualDirectionsInput): {
  directions: VisualDirection[];
  recommended: VisualDirection;
} {
  const { productMarketingContext: ctx, stylePreference } = input;

  const premium = buildPremiumComercial(ctx);
  const editorial = buildEditorialClean(ctx);
  const conversao = buildConversaoImpacto(ctx);

  const directions = [premium, editorial, conversao];

  // Select recommended based on style preference or context
  let recommended = premium;
  const pref = (stylePreference || '').toLowerCase();
  if (pref.includes('editorial') || pref.includes('clean') || pref.includes('framer') || pref.includes('minimal')) {
    recommended = editorial;
  } else if (pref.includes('conversão') || pref.includes('impacto') || pref.includes('venda') || pref.includes('cro')) {
    recommended = conversao;
  }

  return { directions, recommended };
}
