// Phase 15.4 — Product Marketing Context Generator
// Generates product marketing context from user request + optional scan/route data by heuristic.

import type { ProductMarketingContext } from '../schemas/lovablePipelineSchema.js';
import type { ProjectScanResult } from '../schemas/projectScanSchema.js';
import type { RouteRequestResult } from '../schemas/requestRouterSchema.js';

const KNOWN_BRANDS: Record<string, Partial<ProductMarketingContext>> = {
  samar: {
    brand: 'Samar Veículos',
    productOrService: 'Atendimento consultivo para compra de veículos',
    audience: 'Pessoas com medo de comprar por incerteza econômica',
    primaryPain: 'Insegurança para decidir compra em cenário econômico incerto',
    primaryDesire: 'Comprar com segurança, orientação e confiança',
    offer: 'Consultoria personalizada para encontrar o veículo ideal',
    differentiators: ['consultores treinados', 'atendimento personalizado', 'especialistas na necessidade do cliente', 'processo consultivo sem pressão'],
    objections: ['medo do mercado', 'medo de financiar', 'incerteza econômica', 'receio de errar na escolha'],
    toneOfVoice: 'confiante, humano, consultivo e direto',
    conversionGoal: 'gerar contato ou visita',
  },
  ativaagro: {
    brand: 'Ativaagro',
    productOrService: 'Soluções integradas para o agronegócio',
    audience: 'Produtores rurais e gestores do agro',
    primaryPain: 'Complexidade operacional e gestão de insumos',
    primaryDesire: 'Eficiência, previsibilidade e rentabilidade na produção',
    offer: 'Plataforma integrada de gestão agrícola',
    differentiators: ['tecnologia de ponta', 'dados em tempo real', 'suporte especializado em agronegócio', 'ROI comprovado'],
    objections: ['custo de implementação', 'curva de aprendizado', 'dependência de tecnologia'],
    toneOfVoice: 'técnico, confiável, parceiro do produtor',
    conversionGoal: 'solicitar demonstração',
  },
  optoscreen: {
    brand: 'OptoScreen',
    productOrService: 'Tecnologia de otimização de campanhas digitais',
    audience: 'Empresas e agências que investem em mídia digital',
    primaryPain: 'Desperdício de budget em campanhas mal otimizadas',
    primaryDesire: 'Maximizar ROI de campanhas com dados e automação',
    offer: 'Plataforma de otimização de campanhas com IA',
    differentiators: ['IA proprietária', 'dashboards em tempo real', 'ROI médio 3x', 'onboarding rápido'],
    objections: ['já tenho ferramenta', 'custo adicional', 'resultado incerto'],
    toneOfVoice: 'data-driven, direto, focado em resultado',
    conversionGoal: 'iniciar teste gratuito',
  },
  'destaque agro': {
    brand: 'Destaque Agro',
    productOrService: 'Consultoria agrícola especializada para o Oeste Baiano',
    audience: 'Produtores rurais do Oeste da Bahia',
    primaryPain: 'Falta de consultoria técnica especializada na região',
    primaryDesire: 'Aumentar produtividade com suporte técnico local',
    offer: 'Consultoria agronômica com especialistas locais',
    differentiators: ['presença local', 'especialistas regionais', 'resultados na safra', 'atendimento personalizado'],
    objections: ['custo da consultoria', 'resultado a longo prazo', 'já tenho agrônomo'],
    toneOfVoice: 'técnico, próximo, parceiro do campo',
    conversionGoal: 'agendar consultoria',
  },
  'destaque system': {
    brand: 'Destaque System',
    productOrService: 'Sistema de gestão de RH e recrutamento',
    audience: 'Empresas de médio e grande porte com desafios de contratação',
    primaryPain: 'Processos de RH manuais, demorados e ineficientes',
    primaryDesire: 'Automatizar recrutamento e gestão de pessoas',
    offer: 'Plataforma completa de RH e recrutamento',
    differentiators: ['IA para matching', 'onboarding automatizado', 'dashboards de People Analytics'],
    objections: ['migrar de planilha', 'custo de software', 'treinar equipe'],
    toneOfVoice: 'profissional, moderno, eficiente',
    conversionGoal: 'solicitar demo',
  },
  nanoai: {
    brand: 'NanoAI',
    productOrService: 'Consultoria e soluções de IA para empresas',
    audience: 'Executivos e líderes de tecnologia',
    primaryPain: 'Não saber por onde começar com IA na empresa',
    primaryDesire: 'Implementar IA de forma estratégica e com ROI claro',
    offer: 'Consultoria de IA estratégica com implementação',
    differentiators: ['metodologia proprietária', 'casos reais comprovados', 'time sênior', 'ROI em 90 dias'],
    objections: ['IA é hype', 'custo alto', 'incerteza de resultado'],
    toneOfVoice: 'estratégico, visionário, pragmático',
    conversionGoal: 'agendar diagnóstico de IA',
  },
  ellegance: {
    brand: 'Ellegance',
    productOrService: 'Produtos premium de saúde e beleza',
    audience: 'Mulheres que valorizam autocuidado e qualidade premium',
    primaryPain: 'Dificuldade de encontrar produtos de beleza realmente eficazes',
    primaryDesire: 'Beleza com resultados visíveis e experiência premium',
    offer: 'Linha premium de saúde e beleza com ativos comprovados',
    differentiators: ['ingredientes importados', 'dermatologicamente testado', 'embalagem premium', 'resultados em 30 dias'],
    objections: ['preço premium', 'já tenho minha marca', 'resultado incerto'],
    toneOfVoice: 'sofisticado, aspiracional, acolhedor',
    conversionGoal: 'comprar primeira unidade',
  },
  'jk perfumes': {
    brand: 'JK Perfumes',
    productOrService: 'Perfumaria de luxo com essências exclusivas',
    audience: 'Homens e mulheres que buscam exclusividade e sofisticação',
    primaryPain: 'Perfumes comuns que não traduzem personalidade',
    primaryDesire: 'Encontrar uma assinatura olfativa única e marcante',
    offer: 'Perfumes de luxo com essências raras e personalização',
    differentiators: ['essências importadas', 'consultoria olfativa', 'edições limitadas', 'embalagem artesanal'],
    objections: ['preço elevado', 'não conheço a marca', 'compro só online?'],
    toneOfVoice: 'luxuoso, exclusivo, sensorial',
    conversionGoal: 'comprar ou visitar loja',
  },
  elizê: {
    brand: 'ELIZÊ',
    productOrService: 'Moda feminina premium com design exclusivo',
    audience: 'Mulheres que valorizam estilo, exclusividade e qualidade',
    primaryPain: 'Roupas de fast fashion sem personalidade e baixa durabilidade',
    primaryDesire: 'Peças exclusivas que expressam estilo pessoal com qualidade',
    offer: 'Coleções exclusivas de moda feminina premium',
    differentiators: ['design autoral', 'produção limitada', 'tecido premium', 'consultoria de estilo'],
    objections: ['preço', 'tamanho online', 'troca/devolução'],
    toneOfVoice: 'elegante, aspiracional, íntimo',
    conversionGoal: 'comprar coleção',
  },
};

interface CreateProductMarketingContextInput {
  userRequest: string;
  routeResult?: RouteRequestResult;
  projectScan?: ProjectScanResult;
}

export function createProductMarketingContext(input: CreateProductMarketingContextInput): ProductMarketingContext {
  const { userRequest } = input;
  const lower = userRequest.toLowerCase();

  // Detect known brands
  for (const [key, data] of Object.entries(KNOWN_BRANDS)) {
    if (lower.includes(key)) {
      return {
        proofAssets: [],
        ...data,
      } as ProductMarketingContext;
    }
  }

  // Heuristic fallback — extract signals from request
  const detectedBrand = extractBrand(userRequest);
  const isLP = /(?:landing page|lp|landpage|página de (?:vendas|captura|conversão))/i.test(lower);
  const isSaaS = /(?:saas|sistema|plataforma|software|dashboard)/i.test(lower);
  const isConsulting = /(?:consultoria|consultivo|consultor)/i.test(lower);
  const isAgro = /(?:agro|agrícola|produtor|plantação|soja|safra)/i.test(lower);

  return {
    brand: detectedBrand,
    productOrService: isConsulting ? 'Consultoria especializada' : isSaaS ? 'Plataforma/SaaS' : 'Produto ou serviço',
    audience: isAgro ? 'Produtores e profissionais do agronegócio' : 'Pessoas buscando solução para um problema específico',
    primaryPain: 'Dor principal a ser identificada com pesquisa de audiência',
    primaryDesire: 'Resolver o problema de forma eficaz e confiável',
    offer: 'Proposta de valor principal (refinar com product-marketing-context)',
    differentiators: ['qualidade', 'atendimento', 'resultados'],
    objections: ['preço', 'confiança', 'urgência'],
    proofAssets: [],
    toneOfVoice: isConsulting ? 'consultivo e humano' : isLP ? 'persuasivo e direto' : 'profissional e confiável',
    conversionGoal: isLP ? 'converter lead' : 'gerar contato',
  };
}

function extractBrand(userRequest: string): string {
  const words = userRequest.split(/\s+/);
  // Simple heuristic: capitalize first meaningful word or use "para X" pattern
  const paraMatch = userRequest.match(/para\s+(?:a\s+|o\s+)?([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+)?)/);
  if (paraMatch) return paraMatch[1];
  // Return the longest capitalized word
  const capitalized = words.filter(w => /^[A-ZÀ-Ú][a-zà-ú]{2,}$/.test(w));
  if (capitalized.length > 0) return capitalized.reduce((a, b) => a.length >= b.length ? a : b);
  return 'a marca';
}
