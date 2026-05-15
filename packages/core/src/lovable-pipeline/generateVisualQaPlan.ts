// Phase 15.10 — Visual QA Plan Generator
// Generates prioritized visual QA checklist based on visual direction, brand template, and component plan.

import type { VisualQaPlan, VisualQaCheck, VisualDirection, BrandTemplate, ComponentFirstPlan } from '../schemas/lovablePipelineSchema.js';

interface GenerateVisualQaPlanInput {
  selectedVisualDirection: VisualDirection;
  selectedBrandTemplate: BrandTemplate;
  componentFirstPlan: ComponentFirstPlan;
}

const BASE_CHECKS: VisualQaCheck[] = [
  {
    id: 'qa-color-contrast',
    severity: 'high',
    description: 'Verificar contraste de cores em todos os textos (mínimo 4.5:1 para body, 3:1 para headlines grandes)',
    howToCheck: 'Usar Chrome DevTools > Issues > Contrast ou ferramenta axe DevTools. Testar todos os pares de cor texto/fundo.',
  },
  {
    id: 'qa-typography-scale',
    severity: 'medium',
    description: 'Verificar consistência da escala tipográfica — tamanhos de headline, body, caption devem seguir a escala definida',
    howToCheck: 'Inspecionar elementos com DevTools. Verificar font-size, line-height, letter-spacing em cada nível tipográfico.',
  },
  {
    id: 'qa-responsive-layout',
    severity: 'high',
    description: 'Testar layout responsivo em breakpoints: 390px (mobile), 768px (tablet), 1280px (desktop)',
    howToCheck: 'Usar Chrome DevTools device toolbar. Verificar quebra de layout, overflow horizontal, e legibilidade em cada breakpoint.',
  },
  {
    id: 'qa-spacing-consistency',
    severity: 'medium',
    description: 'Verificar consistência de spacing (padding, margin, gap) — usar escala de 4px/8px',
    howToCheck: 'Inspecionar elementos e verificar valores de padding/margin. Valores devem ser múltiplos de 4 ou 8.',
  },
  {
    id: 'qa-hover-states',
    severity: 'medium',
    description: 'Verificar hover states em todos os elementos interativos (botões, links, cards clicáveis)',
    howToCheck: 'Passar o mouse sobre cada elemento interativo. Deve haver feedback visual claro (cor, shadow, scale).',
  },
  {
    id: 'qa-focus-states',
    severity: 'high',
    description: 'Verificar focus visible em todos os elementos interativos para navegação por teclado',
    howToCheck: 'Navegar pela página usando Tab. Cada elemento focado deve ter outline visível ou mudança de estilo.',
  },
  {
    id: 'qa-animation-performance',
    severity: 'medium',
    description: 'Verificar performance de animações — sem jank, 60fps, usar will-change e transform em vez de top/left',
    howToCheck: 'Chrome DevTools > Performance > Record enquanto scrolla. Verificar frame rate e identificar paint storms.',
  },
  {
    id: 'qa-image-loading',
    severity: 'medium',
    description: 'Verificar carregamento e fallback de imagens — lazy loading, placeholder, alt text, formatos modernos',
    howToCheck: 'Network tab > throttled connection. Verificar lazy loading, dimensões, e atributos alt em todas as imagens.',
  },
  {
    id: 'qa-form-validation',
    severity: 'high',
    description: 'Verificar validação de formulários — error states, success states, loading states, acessibilidade',
    howToCheck: 'Submeter formulário vazio → ver mensagens de erro. Preencher com dados inválidos → ver validação. Submeter corretamente → ver success.',
  },
  {
    id: 'qa-motion-respect',
    severity: 'low',
    description: 'Verificar preferência de redução de movimento (prefers-reduced-motion)',
    howToCheck: 'Ativar prefers-reduced-motion no DevTools (Rendering > Emulate CSS media). Animações devem ser desativadas ou reduzidas.',
  },
  {
    id: 'qa-empty-states',
    severity: 'low',
    description: 'Verificar estados vazios em componentes de lista, tabela e dados dinâmicos',
    howToCheck: 'Remover dados de teste e verificar se cada componente mostra um estado vazio adequado com mensagem e ação.',
  },
  {
    id: 'qa-loading-states',
    severity: 'low',
    description: 'Verificar estados de carregamento — skeleton screens ou spinners durante carregamento assíncrono',
    howToCheck: 'Throttle network e recarregar a página. Componentes devem mostrar skeleton ou spinner enquanto dados carregam.',
  },
];

function getDirectionSpecificChecks(dir: VisualDirection): VisualQaCheck[] {
  const checks: VisualQaCheck[] = [];

  if (dir.id === 'premium-commercial') {
    checks.push(
      {
        id: 'qa-premium-glass',
        severity: 'medium',
        description: 'Verificar consistência de glass morphism — blur, transparência e bordas consistentes',
        howToCheck: 'Inspecionar elementos com glass effect. backdrop-filter: blur() deve ser consistente. Background deve ter opacidade adequada.',
      },
      {
        id: 'qa-premium-shadow',
        severity: 'medium',
        description: 'Verificar hierarquia de sombras — elementos mais elevados com shadows mais pronunciadas',
        howToCheck: 'Mapear a hierarquia visual da página. Cards < Modals < Dropdowns devem ter shadows crescentes.',
      },
    );
  }

  if (dir.id === 'editorial-clean') {
    checks.push(
      {
        id: 'qa-editorial-whitespace',
        severity: 'high',
        description: 'Verificar uso de espaço negativo — conforto de leitura, densidade de conteúdo, proporção texto/espaço',
        howToCheck: 'Visualizar cada seção com atenção ao espaço vazio. Texto não deve ocupar mais de 60% da largura disponível em desktop.',
      },
      {
        id: 'qa-editorial-typography',
        severity: 'high',
        description: 'Verificar hierarquia tipográfica editorial — contraste de peso, proporção headline/body, tracking',
        howToCheck: 'Inspecionar todos os níveis de heading. Headlines devem ter peso e tracking claramente diferentes do body.',
      },
    );
  }

  if (dir.id === 'conversao-impacto') {
    checks.push(
      {
        id: 'qa-conversion-cta-visibility',
        severity: 'high',
        description: 'Verificar visibilidade dos CTAs — cada seção deve ter pelo menos um CTA visível sem scroll',
        howToCheck: 'Fazer screenshot de cada seção. Verificar se há um CTA claramente visível em cada uma.',
      },
      {
        id: 'qa-conversion-social-proof',
        severity: 'high',
        description: 'Verificar proeminência da prova social — depoimentos, números e logos com destaque visual',
        howToCheck: 'Elementos de prova social devem ser visíveis com tipografia de destaque. Números devem usar display grande.',
      },
      {
        id: 'qa-conversion-form-length',
        severity: 'medium',
        description: 'Verificar tamanho do formulário — máximo de campos essenciais, sem campos desnecessários',
        howToCheck: 'Contar campos do formulário. Ideal 3-5 campos. Remover campos que não sejam essenciais para o primeiro contato.',
      },
    );
  }

  return checks;
}

function getTemplateSpecificChecks(tmpl: BrandTemplate): VisualQaCheck[] {
  const checks: VisualQaCheck[] = [
    {
      id: `qa-template-palette-${tmpl.id}`,
      severity: 'high',
      description: `Verificar uso correto da paleta: primary=${tmpl.recommendedPalette.primary}, accent=${tmpl.recommendedPalette.accent}, background=${tmpl.recommendedPalette.background}`,
      howToCheck: 'Inspecionar cores usadas. Verificar se primary e accent correspondem às cores definidas no template.',
    },
    {
      id: `qa-template-typography-${tmpl.id}`,
      severity: 'medium',
      description: `Verificar fontes: headline=${tmpl.typography.headline}, body=${tmpl.typography.body}`,
      howToCheck: 'DevTools > Computed > font-family. Verificar se as fontes definidas estão sendo carregadas e aplicadas.',
    },
  ];

  return checks;
}

function getComponentChecks(plan: ComponentFirstPlan): VisualQaCheck[] {
  return plan.components.map((comp) => ({
    id: `qa-component-${comp.name}`,
    severity: 'medium' as const,
    description: `Verificar implementação do componente ${comp.name}: ${comp.purpose}`,
    howToCheck: `Validar props (${comp.props.join(', ')}), comportamento visual, estados hover/focus/empty/loading, e acessibilidade. ${comp.accessibilityNotes}`,
  }));
}

export function generateVisualQaPlan(input: GenerateVisualQaPlanInput): VisualQaPlan {
  const { selectedVisualDirection: dir, selectedBrandTemplate: tmpl, componentFirstPlan } = input;

  const directionChecks = getDirectionSpecificChecks(dir);
  const templateChecks = getTemplateSpecificChecks(tmpl);
  const componentChecks = getComponentChecks(componentFirstPlan);

  const allChecks = [...BASE_CHECKS, ...directionChecks, ...templateChecks, ...componentChecks];

  // Sort by severity priority
  const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  allChecks.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const recommendedTools = ['axe DevTools', 'Chrome DevTools', 'Lighthouse', 'manual-review'];
  if (dir.id === 'premium-commercial') {
    recommendedTools.push('Polypane (multi-viewport)');
  }
  if (dir.id === 'editorial-clean') {
    recommendedTools.push('Type Scale (verificação tipográfica)');
  }

  return {
    checks: allChecks,
    recommendedTools,
    manualFallback: true,
  };
}
