import { z } from 'zod';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the project'),
  userRequest: z.string().min(1).describe('Description of the campaign or launch needed'),
});

export const generateMarketingPlanTool = {
  name: 'generate_marketing_plan',
  description: 'Generate a marketing campaign or launch plan. Content strategy only — does not execute campaigns.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    InputSchema.parse(rawInput);

    return {
      plan: {
        offer: 'Proposta de valor principal do produto/serviço (a ser refinado com product-marketing-context)',
        audience: 'Definir público-alvo: setor, cargo, dores, desejos, canais onde está',
        channels: ['Landing Page', 'Meta Ads (Facebook/Instagram)', 'Google Ads', 'LinkedIn', 'Email'],
        ads: [
          { channel: 'Meta Ads', headline: 'Headline principal com gancho de curiosidade', visualBrief: 'Imagem/vídeo com contraste visual, pessoas ou produto em contexto' },
          { channel: 'Google Ads', headline: 'Headline com keyword + benefício claro', visualBrief: 'N/A (search ad)' },
          { channel: 'LinkedIn', headline: 'Headline profissional com dados/resultados', visualBrief: 'Imagem corporativa premium, infográfico ou case' },
        ],
        social: [
          { platform: 'Instagram', contentIdea: 'Reels mostrando bastidores/resultados', format: 'Reels 9:16' },
          { platform: 'Instagram', contentIdea: 'Carrossel educativo sobre o problema que resolve', format: 'Carousel' },
          { platform: 'LinkedIn', contentIdea: 'Post de autoridade com dados do setor', format: 'Text + Image' },
        ],
        email: [
          { type: 'Welcome', subject: 'Bem-vindo(a) — sua jornada começa aqui', goal: 'Boas-vindas e primeiro valor' },
          { type: 'Nurture', subject: 'Como [empresa X] resolveu [problema Y]', goal: 'Prova social e caso de uso' },
          { type: 'Offer', subject: 'Está pronto para [benefício principal]?', goal: 'Conversão para conversa/demo' },
        ],
        launch: {
          phases: [
            'Pré-lançamento: teaser e expectativa (7 dias)',
            'Lançamento: oferta principal e campanhas ativas (14 dias)',
            'Pós-lançamento: follow-up, retargeting e nurture (30 dias)',
          ],
          timeline: '8 semanas (2 de preparação + 2 de lançamento + 4 de pós)',
        },
        assets: [
          'Landing page otimizada',
          '3 criativos para Meta Ads',
          '2 criativos para Google Ads',
          '5 posts para Instagram',
          '3 artigos/posts para LinkedIn',
          'Sequência de 4 emails',
          '1 lead magnet (e-book, checklist ou webinar)',
        ],
      },
      recommendedExternalSkills: ['launch-strategy', 'ad-creative', 'social-content', 'email-sequence', 'marketing-ideas'],
      requiresExternalExecution: false,
      note: 'Plano gerado como referência. Adapte ao contexto real do produto e audiência.',
    };
  },
};
