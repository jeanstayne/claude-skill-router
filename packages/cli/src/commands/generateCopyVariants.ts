export async function generateCopyVariantsCommand(
  projectPath: string,
  userRequest: string,
  options: { json?: boolean; variantCount?: number } = {}
) {
  const n = options.variantCount || 5;
  const headlines = [
    'Transforme seu negócio com inteligência e estratégia',
    'Resultados reais, entregues com método e tecnologia',
    'A solução definitiva para escalar sua operação',
    'Mais resultados, menos complexidade — descubra como',
    'O futuro do seu negócio começa com a decisão certa',
    'Cresça de forma sustentável com quem entende do seu mercado',
    'Sua empresa merece uma estratégia à altura dos seus objetivos',
    'Tecnologia e conhecimento unidos para impulsionar seu crescimento',
    'Dê o próximo passo com confiança e metodologia comprovada',
    'A parceria que faltava para o seu negócio chegar mais longe',
  ];

  const result = {
    headlines: Array.from({ length: n }, (_, i) => headlines[i % headlines.length]),
    subheadlines: [
      'Metodologia validada por centenas de clientes em todo o Brasil.',
      'Atendimento consultivo com foco em resultados mensuráveis.',
      'Soluções personalizadas para cada etapa do seu crescimento.',
    ],
    ctas: [
      'Fale com um especialista',
      'Quero acelerar meu crescimento',
      'Solicitar diagnóstico gratuito',
      'Começar agora',
      'Agendar conversa estratégica',
    ],
    angles: [
      'Economia de tempo e recursos com processos otimizados',
      'Crescimento sustentável baseado em dados',
      'Parceria estratégica com especialistas do setor',
      'Tecnologia de ponta aplicada ao seu negócio',
      'Resultados comprovados em múltiplos segmentos',
    ],
  };

  if (options.json) {
    console.log(JSON.stringify({
      ...result,
      recommendedExternalSkills: ['copywriting', 'marketing-psychology', 'page-cro'],
      requiresExternalExecution: false,
    }, null, 2));
  } else {
    console.log(`Copy Variants for: "${userRequest}"\n`);
    console.log('Headlines:');
    result.headlines.forEach((h, i) => console.log(`  ${i + 1}. ${h}`));
    console.log('\nSubheadlines:');
    result.subheadlines.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
    console.log('\nCTAs:');
    result.ctas.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
    console.log('\nAngles:');
    result.angles.forEach((a, i) => console.log(`  ${i + 1}. ${a}`));
  }

  return { ...result, requiresExternalExecution: false };
}
