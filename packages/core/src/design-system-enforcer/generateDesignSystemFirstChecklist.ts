// Phase 16.2 — Generate Design System First checklist

export interface DesignSystemChecklistItem {
  id: string;
  category: 'tokens' | 'components' | 'consistency' | 'a11y';
  severity: 'high' | 'medium' | 'low';
  description: string;
  check: string;
}

export interface DesignSystemFirstChecklist {
  checklist: DesignSystemChecklistItem[];
  rule: string;
}

export function generateDesignSystemFirstChecklist(): DesignSystemFirstChecklist {
  return {
    rule: 'Design system primeiro, componentes depois. Tokens semânticos antes de variantes visuais.',
    checklist: [
      { id: 'ds-check-01', category: 'tokens', severity: 'high', description: 'Definir tokens de cor semânticos', check: 'Verificar se --color-primary, --color-accent, --color-background, --color-text-* estão definidos em index.css ou tailwind.config' },
      { id: 'ds-check-02', category: 'tokens', severity: 'high', description: 'Definir tokens de tipografia', check: 'Verificar se --font-headline e --font-body estão definidos e carregados (Google Fonts ou locais)' },
      { id: 'ds-check-03', category: 'tokens', severity: 'medium', description: 'Definir tokens de spacing', check: 'Usar escala de 4px. Valores em Tailwind via spacing config ou CSS custom properties.' },
      { id: 'ds-check-04', category: 'tokens', severity: 'medium', description: 'Definir tokens de shadow', check: 'Verificar --shadow-sm, --shadow-card, --shadow-elevated, --shadow-premium' },
      { id: 'ds-check-05', category: 'tokens', severity: 'medium', description: 'Definir tokens de radius', check: 'Verificar --radius-sm, --radius-card, --radius-component, --radius-full' },
      { id: 'ds-check-06', category: 'tokens', severity: 'medium', description: 'Definir tokens de motion', check: 'Verificar --motion-duration-* e --motion-ease-* tokens' },
      { id: 'ds-check-07', category: 'components', severity: 'high', description: 'Definir variantes de botão', check: 'Pelo menos 3 variantes: primary, secondary/outline, ghost' },
      { id: 'ds-check-08', category: 'components', severity: 'high', description: 'Definir variantes de card', check: 'Pelo menos 2 variantes: default e elevated/premium' },
      { id: 'ds-check-09', category: 'components', severity: 'medium', description: 'Definir variantes de seção', check: 'Pelo menos 3 variantes: default, alt, cta' },
      { id: 'ds-check-10', category: 'consistency', severity: 'high', description: 'Classes hardcoded substituídas por tokens', check: 'Buscar text-white, bg-white, text-black, bg-black, text-gray-*, bg-gray-*. Devem usar tokens quando disponível.' },
      { id: 'ds-check-11', category: 'consistency', severity: 'medium', description: 'Consistência de border-radius', check: 'Todos os elementos devem usar tokens de radius, não valores arbitrários (exceto fully rounded e casos específicos)' },
      { id: 'ds-check-12', category: 'consistency', severity: 'medium', description: 'Consistência de padding/seções', check: 'Seções devem usar py-20 md:py-28 ou tokens equivalentes' },
      { id: 'ds-check-13', category: 'a11y', severity: 'high', description: 'Contraste mínimo AA', check: 'Texto normal 4.5:1, texto grande 3:1 contra fundo' },
      { id: 'ds-check-14', category: 'a11y', severity: 'high', description: 'Focus visible em todos elementos interativos', check: 'Navegar com Tab pela página — todo elemento deve ter outline visível' },
      { id: 'ds-check-15', category: 'a11y', severity: 'medium', description: 'prefers-reduced-motion respeitado', check: 'Ativar prefers-reduced-motion — animações devem ser reduzidas ou desativadas' },
    ],
  };
}
