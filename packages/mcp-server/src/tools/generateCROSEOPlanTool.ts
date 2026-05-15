import { z } from 'zod';
import { CROSEOPlanSchema } from '@claude-skill-router/core/schemas/externalSkillSchema';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  userRequest: z.string().min(1).describe('Description of the audit needed'),
});

export const generateCROSEOPlanTool = {
  name: 'generate_cro_seo_audit_plan',
  description: 'Generate a prioritized CRO/SEO audit plan with actionable checklist. Audit strategy only — does not execute external tools.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    InputSchema.parse(rawInput);

    const plan = {
      cro: [
        { category: 'Headline & Above Fold', action: 'Verificar se headline comunica valor em < 3 segundos', priority: 'high' as const },
        { category: 'CTA', action: 'Garantir que CTA principal está visível sem scroll e tem cor contrastante', priority: 'high' as const },
        { category: 'Form', action: 'Reduzir campos ao mínimo essencial para conversão inicial', priority: 'high' as const },
        { category: 'Social Proof', action: 'Adicionar depoimentos, cases, números ou logos de clientes', priority: 'high' as const },
        { category: 'Mobile', action: 'Verificar layout mobile — CTAs acessíveis, texto legível sem zoom', priority: 'medium' as const },
        { category: 'Load Speed', action: 'Otimizar imagens e verificar tempo de carregamento < 3s', priority: 'medium' as const },
        { category: 'Trust Signals', action: 'Adicionar garantias, selos, política de privacidade', priority: 'medium' as const },
        { category: 'Objections', action: 'Mapear objeções e respondê-las na página', priority: 'low' as const },
      ],
      seo: [
        { category: 'Title Tag', action: 'Otimizar title tag com keyword principal — 50-60 caracteres', priority: 'high' as const },
        { category: 'Meta Description', action: 'Criar meta description persuasiva com CTA — 150-160 caracteres', priority: 'high' as const },
        { category: 'H1', action: 'Garantir H1 único, descritivo e com keyword principal', priority: 'high' as const },
        { category: 'Images', action: 'Adicionar alt text descritivo em todas as imagens', priority: 'medium' as const },
        { category: 'URL', action: 'Verificar URLs amigáveis e com keywords', priority: 'medium' as const },
        { category: 'Content', action: 'Garantir conteúdo mínimo de 300 palavras com keywords relevantes', priority: 'medium' as const },
        { category: 'Internal Links', action: 'Adicionar links internos para páginas relacionadas', priority: 'low' as const },
        { category: 'Mobile', action: 'Verificar mobile-friendliness no Google Search Console', priority: 'low' as const },
      ],
      schema: [
        { type: 'Organization', priority: 'high' as const },
        { type: 'LocalBusiness (se aplicável)', priority: 'medium' as const },
        { type: 'FAQ (se houver FAQ na página)', priority: 'medium' as const },
        { type: 'BreadcrumbList', priority: 'low' as const },
      ],
    };

    const parsed = CROSEOPlanSchema.parse(plan);

    return {
      plan: parsed,
      recommendedExternalSkills: ['page-cro', 'seo-audit', 'schema-markup'],
      requiresExternalExecution: false,
      note: 'Plano de auditoria gerado como checklist. Execute as verificações manualmente ou com ferramentas de SEO.',
    };
  },
};
