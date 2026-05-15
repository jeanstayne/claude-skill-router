import { z } from 'zod';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  userRequest: z.string().min(1).describe('Description of what copy is needed'),
  variantCount: z.number().min(1).max(10).default(5).describe('Number of variants per category'),
});

export const generateCopyVariantsTool = {
  name: 'generate_copy_variants',
  description: 'Generate copy variants — headlines, subheadlines, CTAs, and messaging angles. Content recommendation only.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const n = input.variantCount;

    const result = {
      headlines: Array.from({ length: n }, (_, i) => {
        const options = [
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
        return options[i % options.length];
      }),
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
      recommendedExternalSkills: ['copywriting', 'marketing-psychology', 'page-cro'],
      requiresExternalExecution: false,
      note: 'Copy variants generated as reference. Adapt based on brand voice and audience research.',
    };

    return result;
  },
};
