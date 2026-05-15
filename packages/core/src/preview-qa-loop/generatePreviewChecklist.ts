// Phase 16.6 — Generate preview QA checklist

export interface PreviewCheckItem {
  id: string;
  category: 'layout' | 'visual' | 'content' | 'interaction' | 'responsive' | 'performance';
  severity: 'high' | 'medium' | 'low';
  description: string;
  check: string;
}

export interface PreviewChecklist {
  checklist: PreviewCheckItem[];
  rule: string;
}

export function generatePreviewChecklist(): PreviewChecklist {
  return {
    rule: 'Toda alteração visual deve ser verificada em pelo menos 3 viewports antes de considerar o preview concluído.',
    checklist: [
      { id: 'qa-preview-01', category: 'layout', severity: 'high', description: 'Hero acima da dobra', check: 'Em 1440x900, a hero section inteira (headline, subtext, CTA principal) está visível sem scroll.' },
      { id: 'qa-preview-02', category: 'layout', severity: 'high', description: 'CTA principal visível', check: 'CTA principal (hero) deve estar visível sem scroll. CTAs secundários podem estar abaixo da dobra.' },
      { id: 'qa-preview-03', category: 'layout', severity: 'high', description: 'Sem overflow horizontal', check: 'Nenhum viewport deve ter scroll horizontal. Verificar mobile (390px), tablet (768px), desktop (1440px).' },
      { id: 'qa-preview-04', category: 'layout', severity: 'medium', description: 'Seções com espaçamento consistente', check: 'Padding/seções seguem py-20 md:py-28. Sem seções coladas umas nas outras.' },
      { id: 'qa-preview-05', category: 'layout', severity: 'medium', description: 'Grid consistente', check: 'Cards em grid devem ter mesma altura na mesma linha. Sem cards desalinhados.' },
      { id: 'qa-preview-06', category: 'visual', severity: 'high', description: 'Cores de marca aplicadas corretamente', check: 'Verificar que --color-primary e --color-accent estão sendo usados nos CTAs, headings e elementos de destaque.' },
      { id: 'qa-preview-07', category: 'visual', severity: 'high', description: 'Contraste de texto AA', check: 'Texto normal 4.5:1, texto grande 3:1 contra fundo. Verificar texto branco sobre gradientes e imagens.' },
      { id: 'qa-preview-08', category: 'visual', severity: 'medium', description: 'Tipografia consistente', check: 'Headings usam --font-headline, corpo usa --font-body. Sem font-family inconsistente.' },
      { id: 'qa-preview-09', category: 'visual', severity: 'medium', description: 'Sombras e elevações consistentes', check: 'Cards e elementos elevados usam tokens de shadow (shadow-sm, shadow-card, shadow-premium).' },
      { id: 'qa-preview-10', category: 'content', severity: 'high', description: 'Headlines e CTAs com copy correto', check: 'Verificar que headlines, subtext, CTAs e badges correspondem ao contexto de marketing definido.' },
      { id: 'qa-preview-11', category: 'content', severity: 'medium', description: 'Sem texto truncado', check: 'Em mobile, headlines longas não devem ser cortadas. Texto deve quebrar adequadamente com word-break.' },
      { id: 'qa-preview-12', category: 'content', severity: 'medium', description: 'Links funcionais', check: 'Todos links de navegação, CTAs, WhatsApp devem ter href correto e funcionar.' },
      { id: 'qa-preview-13', category: 'interaction', severity: 'high', description: 'Estados hover/focus visíveis', check: 'Botões e links devem ter estados hover e focus-visible distintos. Navegar com Tab verifica focus ring.' },
      { id: 'qa-preview-14', category: 'interaction', severity: 'medium', description: 'Animações respeitam prefers-reduced-motion', check: 'Ativar prefers-reduced-motion no DevTools — animações devem ser reduzidas ou desativadas.' },
      { id: 'qa-preview-15', category: 'responsive', severity: 'high', description: 'Breakpoint mobile (< 768px)', check: 'Cards empilham verticalmente. Fontes reduzem com clamp(). Padding reduz para py-12. Menu pode ser hamburger.' },
      { id: 'qa-preview-16', category: 'responsive', severity: 'high', description: 'Breakpoint tablet (768px-1024px)', check: 'Grid 2 colunas. Hero pode ser single column. Seções com py-20.' },
      { id: 'qa-preview-17', category: 'responsive', severity: 'medium', description: 'Breakpoint desktop (> 1280px)', check: 'Grid 3-4 colunas. Hero com 2 colunas (texto + imagem/form). Conteúdo com max-w-7xl.' },
      { id: 'qa-preview-18', category: 'performance', severity: 'medium', description: 'Imagens com lazy loading', check: 'Imagens abaixo da dobra devem usar loading="lazy". Imagens hero devem usar priority/eager.' },
      { id: 'qa-preview-19', category: 'performance', severity: 'low', description: 'Fontes com preconnect', check: 'Domínios externos de fontes devem usar <link rel="preconnect"> no <head>.' },
      { id: 'qa-preview-20', category: 'performance', severity: 'low', description: 'Sem layout shift durante carregamento', check: 'Imagens e fontes devem ter dimensões definidas para evitar CLS durante carregamento.' },
    ],
  };
}
