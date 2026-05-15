import type { ExternalSkill, ExternalSkillRecommendation } from '../schemas/externalSkillSchema.js';
import { loadExternalSkills } from './loadExternalSkills.js';
import * as path from 'node:path';

interface RecommendExternalInput {
  intent: string;
  userRequest: string;
  projectType?: string;
  requestSignals?: Record<string, unknown>;
  maxResults?: number;
}

interface RecommendExternalOutput {
  externalSkills: ExternalSkillRecommendation[];
  warnings: string[];
}

function getDefaultRegistryPath(): string {
  const dirname = import.meta.dirname;
  return path.resolve(dirname, '../../../../registry');
}

const INTENT_SKILL_MAP: Record<string, Array<{ id: string; reason: string }>> = {
  'generate-site-images': [
    { id: 'ai-image-generation', reason: 'Geração de imagens via inference.sh para assets visuais do site.' },
    { id: 'gpt-image-2', reason: 'Geração de imagens via DALL-E para hero e banners.' },
    { id: 'canvas-design', reason: 'Design canvas para planejar composição visual das imagens.' },
  ],
  'create-hero-visual': [
    { id: 'gpt-image-2', reason: 'Geração de hero visual com DALL-E.' },
    { id: 'ai-image-generation', reason: 'Geração de hero visual com AI.' },
    { id: 'frontend-design', reason: 'Design do hero section e composição visual.' },
    { id: 'high-end-visual-design', reason: 'Direção visual premium para hero.' },
  ],
  'create-image-prompts': [
    { id: 'ai-image-generation', reason: 'Prompts otimizados para geração de imagem.' },
    { id: 'gpt-image-2', reason: 'Prompts para DALL-E com estilo e composição.' },
    { id: 'enhance-prompt', reason: 'Aprimoramento de prompts para melhor resultado visual.' },
  ],
  'improve-headlines': [
    { id: 'copywriting', reason: 'Copywriting de conversão para headlines e CTAs.' },
    { id: 'marketing-psychology', reason: 'Gatilhos éticos de psicologia para headlines mais persuasivas.' },
    { id: 'page-cro', reason: 'Otimização de headlines para conversão.' },
    { id: 'product-marketing-context', reason: 'Contexto de produto para headlines alinhadas ao posicionamento.' },
  ],
  'improve-marketing-copy': [
    { id: 'copywriting', reason: 'Copywriting para landing pages e sites.' },
    { id: 'marketing-psychology', reason: 'Framing e gatilhos éticos de persuasão.' },
    { id: 'product-marketing-context', reason: 'Contexto de produto e posicionamento de mercado.' },
    { id: 'pricing-strategy', reason: 'Estratégia de precificação e comunicação de valor.' },
  ],
  'audit-page-cro': [
    { id: 'page-cro', reason: 'Auditoria CRO completa da página.' },
    { id: 'form-cro', reason: 'Otimização de formulários para conversão.' },
    { id: 'popup-cro', reason: 'Otimização de popups e modais.' },
    { id: 'marketing-psychology', reason: 'Análise de gatilhos psicológicos na página.' },
  ],
  'optimize-form-cro': [
    { id: 'form-cro', reason: 'Otimização específica de formulários.' },
    { id: 'page-cro', reason: 'Contexto de CRO da página para o formulário.' },
  ],
  'optimize-popup-cro': [
    { id: 'popup-cro', reason: 'Otimização de popups e timing.' },
    { id: 'page-cro', reason: 'Contexto de CRO da página para popups.' },
  ],
  'optimize-seo': [
    { id: 'seo-audit', reason: 'Auditoria SEO completa (on-page, technical, content).' },
    { id: 'schema-markup', reason: 'Schema markup para rich results no Google.' },
    { id: 'content-strategy', reason: 'Estratégia de conteúdo para SEO.' },
    { id: 'programmatic-seo', reason: 'SEO programático para escala.' },
  ],
  'add-schema-markup': [
    { id: 'schema-markup', reason: 'Geração de schema JSON-LD para rich results.' },
    { id: 'seo-audit', reason: 'Auditoria para identificar oportunidades de schema.' },
  ],
  'create-content-strategy': [
    { id: 'content-strategy', reason: 'Estratégia de conteúdo completa.' },
    { id: 'seo-audit', reason: 'Base de SEO para estratégia de conteúdo.' },
    { id: 'competitor-alternatives', reason: 'Análise competitiva para conteúdo.' },
  ],
  'create-programmatic-seo-pages': [
    { id: 'programmatic-seo', reason: 'Estratégia de páginas SEO programáticas.' },
    { id: 'content-strategy', reason: 'Templates de conteúdo para escala.' },
  ],
  'create-ad-creative': [
    { id: 'ad-creative', reason: 'Criação de criativos para anúncios (headlines, visuais, ângulos).' },
    { id: 'paid-ads', reason: 'Estrutura de campanhas pagas.' },
    { id: 'marketing-psychology', reason: 'Gatilhos para criativos de alta performance.' },
  ],
  'create-paid-ads': [
    { id: 'paid-ads', reason: 'Estratégia de campanhas pagas.' },
    { id: 'ad-creative', reason: 'Criativos para os anúncios.' },
    { id: 'launch-strategy', reason: 'Coordenação de campanha com lançamento.' },
  ],
  'create-social-content': [
    { id: 'social-content', reason: 'Conteúdo para redes sociais (posts, Reels, stories).' },
    { id: 'ad-creative', reason: 'Adaptação de criativos para social.' },
    { id: 'marketing-ideas', reason: 'Ideias criativas para conteúdo social.' },
  ],
  'create-email-sequence': [
    { id: 'email-sequence', reason: 'Sequência de emails (welcome, nurture, onboarding).' },
    { id: 'copywriting', reason: 'Copy para emails de alta conversão.' },
  ],
  'create-launch-strategy': [
    { id: 'launch-strategy', reason: 'Estratégia completa de lançamento.' },
    { id: 'marketing-ideas', reason: 'Ideias criativas para o lançamento.' },
    { id: 'email-sequence', reason: 'Sequência de emails do lançamento.' },
  ],
  'create-product-marketing-context': [
    { id: 'product-marketing-context', reason: 'Contexto de produto e posicionamento.' },
    { id: 'pricing-strategy', reason: 'Estratégia de precificação.' },
    { id: 'marketing-psychology', reason: 'Framing para comunicação de produto.' },
  ],
  'extract-design-system': [
    { id: 'extract-design-system', reason: 'Extração de design tokens de referência.' },
    { id: 'tailwind-design-system', reason: 'Config Tailwind a partir dos tokens extraídos.' },
    { id: 'theme-factory', reason: 'Tema completo com tokens e variáveis.' },
    { id: 'stitch-design-taste', reason: 'Design taste e tokens para Stitch.' },
  ],
  'audit-website': [
    { id: 'audit-website', reason: 'Auditoria completa do site (performance, a11y, SEO).' },
    { id: 'seo-audit', reason: 'Componente SEO da auditoria.' },
    { id: 'page-cro', reason: 'Componente CRO da auditoria.' },
  ],
};

const FALLBACK_MAP: Record<string, Array<{ id: string; reason: string }>> = {
  image: [
    { id: 'ai-image-generation', reason: 'Pedido menciona imagem/visual.' },
    { id: 'gpt-image-2', reason: 'Alternativa para geração de imagem.' },
    { id: 'canvas-design', reason: 'Planejamento visual da imagem.' },
  ],
  copy: [
    { id: 'copywriting', reason: 'Pedido menciona copy/texto/headline.' },
    { id: 'marketing-psychology', reason: 'Psicologia para copy persuasiva.' },
    { id: 'page-cro', reason: 'Otimização de conversão do texto.' },
  ],
  cro: [
    { id: 'page-cro', reason: 'Pedido menciona conversão/CRO.' },
    { id: 'form-cro', reason: 'Otimização de formulários.' },
  ],
  seo: [
    { id: 'seo-audit', reason: 'Pedido menciona SEO/busca/tráfego.' },
    { id: 'schema-markup', reason: 'Schema para rich results.' },
    { id: 'content-strategy', reason: 'Conteúdo para SEO.' },
  ],
  social: [
    { id: 'social-content', reason: 'Pedido menciona redes sociais.' },
    { id: 'ad-creative', reason: 'Criativos para social.' },
  ],
  ads: [
    { id: 'ad-creative', reason: 'Pedido menciona anúncios/ads.' },
    { id: 'paid-ads', reason: 'Campanhas pagas.' },
  ],
  email: [
    { id: 'email-sequence', reason: 'Pedido menciona email.' },
    { id: 'copywriting', reason: 'Copy para emails.' },
  ],
  launch: [
    { id: 'launch-strategy', reason: 'Pedido menciona lançamento.' },
    { id: 'marketing-ideas', reason: 'Ideias para lançamento.' },
  ],
  designSystem: [
    { id: 'extract-design-system', reason: 'Pedido menciona design system.' },
    { id: 'tailwind-design-system', reason: 'Design tokens Tailwind.' },
    { id: 'frontend-design', reason: 'Design system frontend.' },
  ],
};

function detectFallbackCategory(userRequest: string): string | null {
  const lower = userRequest.toLowerCase();
  if (/imagem|imagens|hero visual|banner|asset visual|mockup|prompt de imagem/.test(lower)) return 'image';
  if (/headline|copy\b|cta\b|subheadline|proposta de valor|copywriting/.test(lower)) return 'copy';
  if (/cro\b|conversão|formulário|popup|modal/.test(lower)) return 'cro';
  if (/seo\b|schema|rich results|google|tráfego orgânico/.test(lower)) return 'seo';
  if (/instagram|reels|social|conteúdo|post\b/.test(lower)) return 'social';
  if (/ads\b|anúncio|meta ads|google ads|campanha/.test(lower)) return 'ads';
  if (/email|sequência|nutrição|onboarding/.test(lower)) return 'email';
  if (/lançamento|campanha|go.to.market/.test(lower)) return 'launch';
  if (/design system|referência visual|extrair estilo/.test(lower)) return 'designSystem';
  return null;
}

export async function recommendExternalSkills(
  input: RecommendExternalInput,
  registryPath?: string
): Promise<RecommendExternalOutput> {
  const { intent, userRequest, maxResults = 5 } = input;
  const warnings: string[] = [];
  const registryDir = registryPath || getDefaultRegistryPath();

  let allSkills: ExternalSkill[] = [];
  try {
    allSkills = await loadExternalSkills(registryDir);
  } catch {
    // Registry not available yet
  }

  let recommended: ExternalSkillRecommendation[] = [];
  const intentMap = INTENT_SKILL_MAP[intent];

  if (intentMap) {
    for (const rec of intentMap) {
      const skill = allSkills.find((s) => s.id === rec.id);
      if (skill) {
        recommended.push({
          id: skill.id,
          reason: rec.reason,
          riskLevel: skill.riskLevel,
          requiresExternalExecution: skill.requiresExternalCli || skill.requiresNetwork,
          installCommand: skill.installCommand,
          warning: skill.riskLevel === 'high'
            ? `AVISO: Esta skill requer execução externa (${skill.requiresExternalCli ? 'CLI' : ''}${skill.requiresExternalCli && skill.requiresLogin ? ' + ' : ''}${skill.requiresLogin ? 'login' : ''}). NUNCA execute automaticamente.`
            : undefined,
        });
      } else {
        recommended.push({
          id: rec.id,
          reason: `${rec.reason} (skill externa — não instalada)`,
          riskLevel: 'low',
          requiresExternalExecution: false,
          warning: 'Skill ainda não registrada no registry local.',
        });
      }
    }
  }

  if (recommended.length === 0) {
    const fallback = detectFallbackCategory(userRequest);
    if (fallback && FALLBACK_MAP[fallback]) {
      for (const rec of FALLBACK_MAP[fallback]) {
        const skill = allSkills.find((s) => s.id === rec.id);
        recommended.push({
          id: rec.id,
          reason: rec.reason,
          riskLevel: skill?.riskLevel || 'low',
          requiresExternalExecution: skill ? skill.requiresExternalCli || skill.requiresNetwork : false,
          installCommand: skill?.installCommand,
          warning: skill?.riskLevel === 'high'
            ? 'AVISO: Skill de risco alto. Requer confirmação explícita.'
            : undefined,
        });
      }
    }
  }

  recommended = recommended.slice(0, maxResults);

  const highRiskSkills = recommended.filter((s) => s.riskLevel === 'high');
  if (highRiskSkills.length > 0) {
    warnings.push(`${highRiskSkills.length} skill(s) de risco alto detectada(s). Skills de imagem e auditoria exigem CLI/login externo e NUNCA devem executar automaticamente.`);
  }

  const imageSkills = recommended.filter((s) => ['ai-image-generation', 'gpt-image-2'].includes(s.id));
  if (imageSkills.length > 0) {
    warnings.push('Skills de geração de imagem requerem CLI externo e login. Gere apenas o brief/prompt — nunca execute a geração automaticamente.');
  }

  return { externalSkills: recommended, warnings };
}
