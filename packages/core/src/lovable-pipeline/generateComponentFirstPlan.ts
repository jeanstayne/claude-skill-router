// Phase 15.9 — Component-First UI Plan Generator
// Generates component-level specifications, recommended file structure, and implementation order.

import type { ComponentFirstPlan, ComponentSpec, ProductMarketingContext, VisualDirection, BrandTemplate } from '../schemas/lovablePipelineSchema.js';

interface GenerateComponentFirstPlanInput {
  userRequest: string;
  productMarketingContext: ProductMarketingContext;
  selectedVisualDirection: VisualDirection;
  selectedBrandTemplate: BrandTemplate;
}

function generateLandingPageComponents(ctx: ProductMarketingContext, dir: VisualDirection): ComponentSpec[] {
  const isPremium = dir.id === 'premium-commercial';
  const isImpact = dir.id === 'conversao-impacto';
  const isEditorial = dir.id === 'editorial-clean';

  const components: ComponentSpec[] = [
    {
      name: 'HeroSection',
      purpose: 'Seção principal acima da dobra — headline, subheadline, CTA primário e visual de apoio',
      props: ['headline', 'subheadline', 'ctaText', 'ctaHref', 'backgroundVariant'],
      visualNotes: isImpact
        ? 'Headline grande em bold/black (3-4rem). CTA com cor vibrante contrastante. Fundo com gradiente ou cor sólida forte. Badge de "Oferta" ou "Novo" opcional.'
        : isEditorial
          ? 'Headline em serif display com tracking negativo. Espaço negativo generoso. CTA sutil com underline ou borda fina. Fundo claro neutro.'
          : 'Headline em sans-serif bold condensado. Fundo com foto profissional ou gradiente premium. CTA com border-radius 8-12px e cor contrastante.',
      copyNotes: 'Headline deve abordar o desejo principal. Subheadline reforça a oferta. CTA com verbo de ação (Solicitar, Agendar, Começar).',
      accessibilityNotes: 'Heading hierarchy: h1 para headline. Imagem de fundo com role="presentation". Contraste do CTA mínimo 3:1 contra fundo.',
    },
    {
      name: 'BenefitsSection',
      purpose: 'Grid de 3-4 cards com os principais benefícios/diferenciadores da oferta',
      props: ['benefits', 'columns', 'withIcons'],
      visualNotes: isEditorial
        ? 'Cards minimalistas com borda fina ou sem borda. Ícones line-art. Espaçamento generoso entre cards.'
        : 'Cards com glass morphism sutil ou bordas suaves. Ícones coloridos. Hover: leve lift com shadow.',
      copyNotes: 'Cada benefício: título curto (3-5 palavras) + descrição de 1-2 linhas. Foco no resultado, não na feature.',
      accessibilityNotes: 'Cards devem ser focáveis por teclado. Ícones decorativos com aria-hidden="true".',
    },
    {
      name: 'SocialProofSection',
      purpose: 'Prova social com números, logos de clientes ou métricas de resultado',
      props: ['stats', 'logos', 'testimonials', 'variant'],
      visualNotes: isImpact
        ? 'Números em display grande (3-4rem) com count-up animation. Fundo contrastante. Logos em linha com opacidade reduzida.'
        : 'Números com tipografia destaque. Fundo neutro. Logos em grid com opacidade uniforme.',
      copyNotes: 'Números reais e específicos (+500, não "centenas"). Logos de empresas reconhecíveis. "Empresas que confiam" como headline.',
      accessibilityNotes: 'Números com texto alternativo descritivo. Logos com alt text com nome da empresa.',
    },
    {
      name: 'TestimonialsSection',
      purpose: 'Depoimentos de clientes reais em cards com foto, nome e cargo',
      props: ['testimonials', 'variant', 'autoplay'],
      visualNotes: isPremium
        ? 'Cards com aspas grandes decorativas. Foto com border-radius circular. Fundo levemente diferente do resto da página.'
        : 'Cards em carrossel horizontal. Aspas sutis. Foto + nome + cargo alinhados.',
      copyNotes: 'Depoimentos autênticos com resultados concretos. Nome real + cargo + empresa. Evitar genéricos como "Cliente satisfeito".',
      accessibilityNotes: 'Carrossel com controles de pausa e navegação por teclado. aria-label nos cards.',
    },
    {
      name: 'FAQSection',
      purpose: 'Accordion de perguntas frequentes abordando objeções principais',
      props: ['questions', 'variant', 'defaultOpen'],
      visualNotes: 'Accordion limpo com ícone de expand/colapsar. Transição suave de altura (200ms ease-out). Divisores finos entre itens.',
      copyNotes: `Perguntas baseadas nas objeções mapeadas: ${ctx.objections.join(', ')}. Respostas diretas e honestas. Máximo 2-3 parágrafos por resposta.`,
      accessibilityNotes: 'Usar elementos details/summary nativos ou accordion com aria-expanded. Navegação por teclado completa.',
    },
    {
      name: 'CTASection',
      purpose: 'Seção final de call-to-action com fundo destacado',
      props: ['headline', 'subheadline', 'ctaText', 'ctaHref', 'variant'],
      visualNotes: isImpact
        ? 'Fundo com gradiente vibrante ou cor sólida forte. CTA grande com alto contraste. Elementos de urgência ética (se aplicável).'
        : 'Fundo com gradiente sutil da cor da marca. CTA com animação sutil de hover. Espaço negativo ao redor do CTA.',
      copyNotes: 'Headline final reforçando o desejo principal. Subheadline eliminando última objeção. CTA com verbo de ação + benefício imediato.',
      accessibilityNotes: 'Contraste alto entre CTA e fundo. Foco visível no botão. Formulário (se houver) com labels claros.',
    },
    {
      name: 'Footer',
      purpose: 'Rodapé com logo, links de navegação, contato e copyright',
      props: ['logo', 'links', 'contact', 'socialLinks'],
      visualNotes: 'Fundo escuro ou com cor da marca. Tipografia menor. Divisor sutil entre conteúdo principal e footer.',
      copyNotes: 'Links organizados em colunas. Informações de contato claras. Copyright com ano atual.',
      accessibilityNotes: 'Links com contraste mínimo 4.5:1. Navegação por teclado em todos os links.',
    },
  ];

  return components;
}

function generateDashboardComponents(_ctx: ProductMarketingContext, _dir: VisualDirection): ComponentSpec[] {
  return [
    {
      name: 'DashboardLayout',
      purpose: 'Layout principal do dashboard com sidebar, header e área de conteúdo',
      props: ['sidebarItems', 'userMenu', 'breadcrumbs', 'contentArea'],
      visualNotes: 'Sidebar com fundo escuro ou brand-color. Header com search + user menu. Conteúdo em grid flexível.',
      copyNotes: 'Labels claros e concisos. Navegação por ícones + texto. Breadcrumbs para orientação.',
      accessibilityNotes: 'Skip link para conteúdo principal. Sidebar com role="navigation". Estados de foco visíveis.',
    },
    {
      name: 'StatsOverview',
      purpose: 'Grid de cards com métricas principais (KPI cards)',
      props: ['metrics', 'period', 'trend', 'onClick'],
      visualNotes: 'Cards com shadow sutil. Números grandes com indicador de tendência (seta para cima/baixo). Cor de destaque para métricas positivas.',
      copyNotes: 'Nomes de métricas descritivos. Período de comparação claro. Tooltips com explicação.',
      accessibilityNotes: 'Indicadores de tendência com texto alternativo. Cards focáveis com informação completa.',
    },
    {
      name: 'DataTable',
      purpose: 'Tabela de dados com ordenação, filtro e paginação',
      props: ['columns', 'rows', 'sortable', 'filterable', 'paginated', 'onRowClick'],
      visualNotes: 'Header fixo com fundo diferenciado. Zebra striping sutil. Hover state nas linhas. Paginação no rodapé.',
      copyNotes: 'Cabeçalhos de coluna descritivos. Dados formatados (data, moeda, percentual). Estado vazio com mensagem.',
      accessibilityNotes: 'Tabela com caption e scope nos headers. Ordenação anunciada por screen reader. Paginação navegável.',
    },
    {
      name: 'ChartCard',
      purpose: 'Card com gráfico para visualização de dados',
      props: ['title', 'chartType', 'data', 'period', 'actions'],
      visualNotes: 'Gráficos limpos com cores da marca. Grid lines sutis. Tooltip no hover. Legendas claras.',
      copyNotes: 'Título descritivo do gráfico. Labels dos eixos. Formatação de valores consistente.',
      accessibilityNotes: 'Dados do gráfico em tabela escondida para screen readers. Cores com contraste distinguível.',
    },
    {
      name: 'FormDialog',
      purpose: 'Modal ou drawer para formulários de criação/edição',
      props: ['title', 'fields', 'onSubmit', 'onCancel', 'loading', 'errors'],
      visualNotes: 'Modal centrado com overlay escuro. Drawer lateral em telas menores. Campos com label flutuante ou acima.',
      copyNotes: 'Título claro da ação. Placeholders com exemplos. Mensagens de erro específicas. Botão de submit com verbo descritivo.',
      accessibilityNotes: 'Trap focus dentro do modal. Fechar com Escape. aria-labelledby no título. Erro anunciado com aria-live.',
    },
  ];
}

function generateInstitutionalComponents(_ctx: ProductMarketingContext, _dir: VisualDirection): ComponentSpec[] {
  return [
    {
      name: 'Navbar',
      purpose: 'Navegação principal com logo, links e CTA',
      props: ['logo', 'navItems', 'ctaText', 'ctaHref', 'transparent'],
      visualNotes: 'Transparente no topo, sólido no scroll. Links com underline sutil no hover. CTA em botão destacado.',
      copyNotes: 'Links com nomes curtos e descritivos. CTA com verbo de ação.',
      accessibilityNotes: 'Skip link. Navegação com role="navigation". Menu mobile com aria-expanded.',
    },
    {
      name: 'AboutSection',
      purpose: 'Seção sobre a empresa com missão, visão e valores',
      props: ['mission', 'vision', 'values', 'history', 'team'],
      visualNotes: 'Layout com texto à esquerda e imagem à direita (alternado). Timeline para história. Grid de cards para valores.',
      copyNotes: 'Tom institucional e aspiracional. Números e fatos relevantes. História em ordem cronológica.',
      accessibilityNotes: 'Imagens com alt text. Timeline navegável por teclado.',
    },
    {
      name: 'TeamSection',
      purpose: 'Grid de cards com fotos e biografias do time',
      props: ['members', 'columns'],
      visualNotes: 'Fotos profissionais com estilo consistente. Hover com info adicional. Grid responsivo (2-4 colunas).',
      copyNotes: 'Nome + cargo + mini bio (2-3 linhas). Links para LinkedIn opcionais.',
      accessibilityNotes: 'Fotos com alt text (nome da pessoa). Cards focáveis.',
    },
    {
      name: 'ContactSection',
      purpose: 'Seção de contato com formulário e informações',
      props: ['address', 'phone', 'email', 'mapUrl', 'formFields'],
      visualNotes: 'Layout em duas colunas: info + formulário. Mapa embutido opcional. Campos com estilo consistente.',
      copyNotes: 'Informações de contato completas. Formulário com campos essenciais. Mensagem de confirmação pós-envio.',
      accessibilityNotes: 'Formulário com labels, error states e aria-required. Mapa com endereço em texto.',
    },
    {
      name: 'Footer',
      purpose: 'Rodapé completo com logo, links, contato e redes sociais',
      props: ['logo', 'columns', 'socialLinks', 'newsletter'],
      visualNotes: 'Fundo escuro. Múltiplas colunas de links. Ícones de redes sociais. Campo de newsletter opcional.',
      copyNotes: 'Links organizados por categoria. Copyright com ano atual. Política de privacidade e termos.',
      accessibilityNotes: 'Links com contraste 4.5:1. Ícones com aria-label. Newsletter com label claro.',
    },
  ];
}

export function generateComponentFirstPlan(input: GenerateComponentFirstPlanInput): ComponentFirstPlan {
  const { productMarketingContext: ctx, selectedVisualDirection: dir, userRequest } = input;
  const lower = userRequest.toLowerCase();

  let components: ComponentSpec[];
  let recommendedFileStructure: string[];
  let projectPrefix: string;

  if (/(?:dashboard|painel|sistema|plataforma)/i.test(lower)) {
    components = generateDashboardComponents(ctx, dir);
    projectPrefix = 'src/components/dashboard/';
    recommendedFileStructure = [
      `${projectPrefix}DashboardLayout.tsx`,
      `${projectPrefix}StatsOverview.tsx`,
      `${projectPrefix}DataTable.tsx`,
      `${projectPrefix}ChartCard.tsx`,
      `${projectPrefix}FormDialog.tsx`,
    ];
  } else if (/(?:institucional|corporativo|empresa|sobre|quem somos)/i.test(lower)) {
    components = generateInstitutionalComponents(ctx, dir);
    projectPrefix = 'src/components/site/';
    recommendedFileStructure = [
      `${projectPrefix}Navbar.tsx`,
      `${projectPrefix}HeroSection.tsx`,
      `${projectPrefix}AboutSection.tsx`,
      `${projectPrefix}TeamSection.tsx`,
      `${projectPrefix}ContactSection.tsx`,
      `${projectPrefix}Footer.tsx`,
    ];
  } else {
    components = generateLandingPageComponents(ctx, dir);
    projectPrefix = 'src/components/landing/';
    recommendedFileStructure = [
      `${projectPrefix}HeroSection.tsx`,
      `${projectPrefix}BenefitsSection.tsx`,
      `${projectPrefix}SocialProofSection.tsx`,
      `${projectPrefix}TestimonialsSection.tsx`,
      `${projectPrefix}FAQSection.tsx`,
      `${projectPrefix}CTASection.tsx`,
      `${projectPrefix}Footer.tsx`,
    ];
  }

  const implementationOrder = recommendedFileStructure.map((f) => {
    const name = f.replace(projectPrefix, '').replace('.tsx', '');
    return `Implementar ${name} com estrutura base → preencher copy → aplicar variantes visuais → testar responsivo`;
  });

  return {
    components,
    recommendedFileStructure,
    implementationOrder,
  };
}
