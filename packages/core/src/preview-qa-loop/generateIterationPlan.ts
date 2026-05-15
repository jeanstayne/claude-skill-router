// Phase 16.6 — Generate iteration plan from visual regressions

import type { VisualRegression } from './detectVisualRegressions.js';

export interface IterationStep {
  priority: number;
  regression: VisualRegression;
  fix: string;
  estimatedEffort: 'small' | 'medium' | 'large';
}

export interface PreviewIterationPlan {
  steps: IterationStep[];
  rule: string;
}

export function generateIterationPlan(regressions: VisualRegression[]): PreviewIterationPlan {
  const steps: IterationStep[] = [];
  let priority = 0;

  const sorted = [...regressions].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  for (const r of sorted) {
    priority++;
    steps.push({
      priority,
      regression: r,
      fix: suggestIterationFix(r),
      estimatedEffort: estimateEffort(r),
    });
  }

  return {
    steps,
    rule: 'Corrigir primeiro regressões high em todos viewports, depois medium, depois low. Cada iteração deve ser verificada novamente nos 3 viewports prioritários.',
  };
}

function suggestIterationFix(r: VisualRegression): string {
  switch (r.checkId) {
    case 'qa-preview-01': return 'Ajustar altura da hero (min-h-screen ou min-h-[90vh]). Reduzir padding vertical se necessário.';
    case 'qa-preview-02': return 'Reposicionar CTA principal para ficar acima da dobra em todos os viewports.';
    case 'qa-preview-03': return 'Remover overflow-x. Verificar imagens e elementos com width fixo que excedem 100vw.';
    case 'qa-preview-06': return 'Substituir cores hardcoded por tokens (--color-primary, --color-accent).';
    case 'qa-preview-07': return 'Ajustar contraste: escurecer texto ou clarear fundo. Usar tokens --color-text-primary.';
    case 'qa-preview-10': return 'Revisar copy com contexto de marketing. Headline deve comunicar proposta de valor.';
    case 'qa-preview-13': return 'Adicionar focus-visible:ring-2 e hover:brightness-105 em elementos interativos.';
    case 'qa-preview-15': return 'Ajustar layout mobile: cards empilhados, fontes com clamp(), padding py-12.';
    case 'qa-preview-16': return 'Ajustar layout tablet: grid 2 colunas, hero single column.';
    default: return 'Corrigir manualmente conforme a descrição da checklist.';
  }
}

function estimateEffort(r: VisualRegression): 'small' | 'medium' | 'large' {
  if (r.severity === 'low') return 'small';
  if (r.severity === 'medium') return 'medium';
  if (r.checkId === 'qa-preview-03' || r.checkId === 'qa-preview-06') return 'medium';
  return 'small';
}
