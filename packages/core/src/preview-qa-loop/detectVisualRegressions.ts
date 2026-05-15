// Phase 16.6 — Detect visual regression issues from checklist results

import type { ViewportCheckResult } from './responsiveViewportMatrix.js';

export interface VisualRegression {
  viewport: string;
  checkId: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
}

export interface VisualRegressionReport {
  regressions: VisualRegression[];
  bySeverity: { high: VisualRegression[]; medium: VisualRegression[]; low: VisualRegression[] };
  summary: string;
}

export function detectVisualRegressions(
  results: ViewportCheckResult[],
  checklistMap: Map<string, { description: string; severity: 'high' | 'medium' | 'low'; category: string }>,
): VisualRegressionReport {
  const regressions: VisualRegression[] = [];

  for (const result of results) {
    for (const check of result.checks) {
      if (!check.passed) {
        const info = checklistMap.get(check.checkId);
        regressions.push({
          viewport: result.viewport.name,
          checkId: check.checkId,
          description: info?.description ?? check.note,
          severity: info?.severity ?? 'medium',
          category: info?.category ?? 'visual',
        });
      }
    }
  }

  const bySeverity = {
    high: regressions.filter(r => r.severity === 'high'),
    medium: regressions.filter(r => r.severity === 'medium'),
    low: regressions.filter(r => r.severity === 'low'),
  };

  const summary = `${regressions.length} regressões detectadas: ${bySeverity.high.length} high, ${bySeverity.medium.length} medium, ${bySeverity.low.length} low`;

  return { regressions, bySeverity, summary };
}
