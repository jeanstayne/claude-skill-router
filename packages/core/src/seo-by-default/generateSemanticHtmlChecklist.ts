// Phase 16.3 — Generate Semantic HTML checklist

export interface SemanticHtmlCheckItem {
  id: string;
  category: 'structure' | 'headings' | 'images' | 'links' | 'forms' | 'aria' | 'performance';
  severity: 'high' | 'medium' | 'low';
  description: string;
  check: string;
}

export interface SemanticHtmlChecklist {
  checklist: SemanticHtmlCheckItem[];
  rule: string;
}

export function generateSemanticHtmlChecklist(): SemanticHtmlChecklist {
  return {
    rule: 'HTML semântico primeiro. Use elementos nativos antes de divs genéricas. Cada página deve ter uma hierarquia de headings clara e landmarks ARIA.',
    checklist: [
      { id: 'seo-html-01', category: 'structure', severity: 'high', description: 'Elemento <main> presente', check: 'A página deve ter exatamente um elemento <main> envolvendo o conteúdo principal.' },
      { id: 'seo-html-02', category: 'structure', severity: 'high', description: 'Landmarks ARIA definidas', check: '<header>, <main>, <footer> presentes. <nav> para navegação, <aside> para conteúdo complementar.' },
      { id: 'seo-html-03', category: 'headings', severity: 'high', description: 'Hierarquia de headings correta', check: 'Exatamente um <h1>. Headings não pulam níveis (h1 → h2 → h3, nunca h1 → h3).' },
      { id: 'seo-html-04', category: 'headings', severity: 'medium', description: 'Headings com texto descritivo', check: 'Headings devem conter texto relevante, não genéricos como "Saiba mais" ou "Clique aqui".' },
      { id: 'seo-html-05', category: 'images', severity: 'high', description: 'Todas imagens com alt text', check: 'Toda <img> deve ter atributo alt. Imagens decorativas: alt="". Imagens de conteúdo: alt descritivo.' },
      { id: 'seo-html-06', category: 'images', severity: 'medium', description: 'Imagens responsivas com srcset', check: 'Usar srcset e sizes para servir tamanhos adequados por viewport.' },
      { id: 'seo-html-07', category: 'images', severity: 'low', description: 'Lazy loading em imagens abaixo da fold', check: 'Imagens abaixo da dobra devem usar loading="lazy".' },
      { id: 'seo-html-08', category: 'links', severity: 'high', description: 'Links com texto âncora descritivo', check: 'Evitar "clique aqui", "saiba mais", "leia mais". Usar texto descritivo do destino.' },
      { id: 'seo-html-09', category: 'links', severity: 'medium', description: 'Links externos com rel adequado', check: 'Links para outros domínios devem usar rel="noopener noreferrer". Links patrocinados: rel="sponsored".' },
      { id: 'seo-html-10', category: 'forms', severity: 'high', description: 'Labels associadas a inputs', check: 'Todo <input>, <select>, <textarea> deve ter <label> associado via for ou estar aninhado.' },
      { id: 'seo-html-11', category: 'forms', severity: 'medium', description: 'Formulários com autocomplete', check: 'Inputs devem usar atributo autocomplete adequado (name, email, tel, organization).' },
      { id: 'seo-html-12', category: 'aria', severity: 'high', description: 'Elementos interativos acessíveis por teclado', check: 'Todo botão/link deve ser focável e acionável via teclado (Tab, Enter, Space).' },
      { id: 'seo-html-13', category: 'aria', severity: 'medium', description: 'aria-label em elementos sem texto visível', check: 'Botões só com ícone devem ter aria-label. Links com target="_blank" devem avisar que abre nova janela.' },
      { id: 'seo-html-14', category: 'performance', severity: 'high', description: 'Meta viewport para responsividade', check: '<meta name="viewport" content="width=device-width, initial-scale=1"> presente.' },
      { id: 'seo-html-15', category: 'performance', severity: 'medium', description: 'Fontes com preconnect/preload', check: 'Google Fonts e outros domínios de fonte devem usar <link rel="preconnect"> no <head>.' },
    ],
  };
}
