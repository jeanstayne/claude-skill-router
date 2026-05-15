// Phase 16.6 — Preview QA Loop orchestrator
// Generates checklist, viewport matrix, detects regressions, and creates iteration plan.

import { generatePreviewChecklist, type PreviewChecklist } from './generatePreviewChecklist.js';
import { createViewportMatrix, getDefaultViewports, recordViewportResult, summarizeViewportResults, type ViewportCheckResult } from './responsiveViewportMatrix.js';
import { detectVisualRegressions, type VisualRegressionReport } from './detectVisualRegressions.js';
import { generateIterationPlan, type PreviewIterationPlan } from './generateIterationPlan.js';

export interface PreviewQaLoopResult {
  checklist: PreviewChecklist;
  viewportResults: ViewportCheckResult[];
  viewportSummary: string;
  regressionReport: VisualRegressionReport | null;
  iterationPlan: PreviewIterationPlan | null;
  summary: string;
}

export async function runPreviewQaLoop(opts?: {
  viewportResults?: Array<{
    viewportName: string;
    checks: Array<{ checkId: string; passed: boolean; note: string }>;
  }>;
}): Promise<PreviewQaLoopResult> {
  const checklist = generatePreviewChecklist();
  const matrix = createViewportMatrix();

  const checklistMap = new Map<string, { description: string; severity: 'high' | 'medium' | 'low'; category: string }>();
  for (const item of checklist.checklist) {
    checklistMap.set(item.id, { description: item.description, severity: item.severity, category: item.category });
  }

  const results: ViewportCheckResult[] = [];

  if (opts?.viewportResults) {
    const allViewports = getDefaultViewports();
    for (const vr of opts.viewportResults) {
      const vp = allViewports.find(v => v.name === vr.viewportName);
      if (vp) {
        const result = recordViewportResult(matrix, vp, vr.checks);
        results.push(result);
      }
    }
  }

  const viewportSummary = summarizeViewportResults(matrix);

  let regressionReport: VisualRegressionReport | null = null;
  let iterationPlan: PreviewIterationPlan | null = null;

  if (results.length > 0) {
    regressionReport = detectVisualRegressions(results, checklistMap);
    iterationPlan = generateIterationPlan(regressionReport.regressions);
  }

  const summary = results.length === 0
    ? 'Preview QA Loop configurado. Execute os checks nos viewports e alimente os resultados para detectar regressões.'
    : `${viewportSummary} | ${regressionReport?.summary ?? 'Sem regressões'}`;

  return { checklist, viewportResults: results, viewportSummary, regressionReport, iterationPlan, summary };
}
