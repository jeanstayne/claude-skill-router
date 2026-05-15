// Phase 16.5 — Generate fix plan from classified issues

import type { ClassifiedIssue } from './classifyRuntimeIssues.js';

export interface FixAction {
  issue: string;
  action: string;
  file?: string;
  priority: number;
}

export interface FixPlan {
  actions: FixAction[];
  priorityOrder: string[];
}

export function generateFixPlan(issues: ClassifiedIssue[]): FixPlan {
  const actions: FixAction[] = [];
  let counter = 0;

  for (const issue of issues) {
    const action = suggestFix(issue, ++counter);
    if (action) actions.push(action);
  }

  actions.sort((a, b) => a.priority - b.priority);

  return {
    actions,
    priorityOrder: [
      '1. Erros de JS / Hydration (high)',
      '2. Erros de rede (high)',
      '3. Core Web Vitals / Perf (high)',
      '4. Acessibilidade (high/medium)',
      '5. Imagens e Fontes (medium)',
      '6. SEO warnings (medium)',
      '7. Depreciações (low)',
      '8. Outros (low)',
    ],
  };
}

function suggestFix(issue: ClassifiedIssue, index: number): FixAction | null {
  const base = { issue: issue.message, priority: index };

  switch (issue.category) {
    case 'hydration-error':
      return { ...base, action: 'Verificar mismatch entre server/client render. Usar suppressHydrationWarning ou useEffect para conteúdo dinâmico. Verificar tags condicionais no <head>.' };
    case 'a11y-violation':
      return { ...base, action: 'Adicionar atributos aria-* necessários. Garantir contraste mínimo AA. Adicionar focus-visible em elementos interativos.' };
    case 'network-error':
      return { ...base, action: 'Verificar endpoint. Adicionar try/catch. Implementar retry com backoff. Adicionar fallback UI para estado de erro (ErrorBoundary).' };
    case 'image-error':
      return { ...base, action: 'Adicionar alt text em imagens. Usar next/image ou <img> com loading="lazy". Verificar URLs de imagens quebradas.' };
    case 'font-error':
      return { ...base, action: 'Adicionar font-display: swap. Usar preconnect para Google Fonts. Verificar formatos woff2.' };
    case 'perf-warning':
      return { ...base, action: 'Auditar bundle size. Adicionar lazy loading. Otimizar imagens. Verificar CLS/LCP/INP com Lighthouse.' };
    case 'seo-warning':
      return { ...base, action: 'Verificar meta tags (title, description, og:*). Adicionar canonical. Verificar robots.txt e sitemap.xml.' };
    case 'js-error':
      return { ...base, action: 'Adicionar try/catch. Verificar chamadas assíncronas. Adicionar ErrorBoundary no componente afetado. Corrigir referências indefinidas.' };
    case 'deprecation':
      return { ...base, action: 'Substituir API depreciada pela versão recomendada na documentação do framework.' };
    default:
      return { ...base, action: 'Investigar manualmente. Considerar adicionar monitoramento estruturado (Sentry, LogRocket).' };
  }
}
