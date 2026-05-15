export async function generateCROSEOPlanCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean } = {}
) {
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

  if (options.json) {
    console.log(JSON.stringify({
      plan,
      recommendedExternalSkills: ['page-cro', 'seo-audit', 'schema-markup'],
      requiresExternalExecution: false,
      note: 'Plano de auditoria gerado como checklist. Execute as verificações manualmente.',
    }, null, 2));
  } else {
    console.log(`CRO/SEO Audit Plan for: "${userRequest}"\n`);
    console.log('CRO Checklist:');
    for (const item of plan.cro) {
      console.log(`  [${item.priority}] ${item.category}: ${item.action}`);
    }
    console.log('\nSEO Checklist:');
    for (const item of plan.seo) {
      console.log(`  [${item.priority}] ${item.category}: ${item.action}`);
    }
    console.log('\nSchema Markup Suggestions:');
    for (const item of plan.schema) {
      console.log(`  [${item.priority}] ${item.type}`);
    }
    console.log('\nExternal skills recommended: page-cro, seo-audit, schema-markup');
  }

  return { plan, requiresExternalExecution: false };
}
