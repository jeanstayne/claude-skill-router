import { describe, it, expect } from 'vitest';
import { generatePreviewChecklist } from '../src/preview-qa-loop/generatePreviewChecklist.js';
import { createViewportMatrix, getDefaultViewports, recordViewportResult, summarizeViewportResults } from '../src/preview-qa-loop/responsiveViewportMatrix.js';
import { detectVisualRegressions } from '../src/preview-qa-loop/detectVisualRegressions.js';
import { generateIterationPlan } from '../src/preview-qa-loop/generateIterationPlan.js';

describe('generatePreviewChecklist', () => {
  it('should return 20 checklist items', () => {
    const result = generatePreviewChecklist();
    expect(result.checklist.length).toBe(20);
  });

  it('should have items in all categories', () => {
    const result = generatePreviewChecklist();
    const cats = new Set(result.checklist.map(i => i.category));
    expect(cats.has('layout')).toBe(true);
    expect(cats.has('visual')).toBe(true);
    expect(cats.has('content')).toBe(true);
    expect(cats.has('interaction')).toBe(true);
    expect(cats.has('responsive')).toBe(true);
    expect(cats.has('performance')).toBe(true);
  });

  it('should have high severity items', () => {
    const result = generatePreviewChecklist();
    const high = result.checklist.filter(i => i.severity === 'high');
    expect(high.length).toBeGreaterThanOrEqual(5);
  });

  it('should have rule about viewport verification', () => {
    const result = generatePreviewChecklist();
    expect(result.rule).toContain('viewport');
  });
});

describe('responsiveViewportMatrix', () => {
  it('should return 6 default viewports', () => {
    const viewports = getDefaultViewports();
    expect(viewports.length).toBe(6);
  });

  it('should have 3 high priority viewports', () => {
    const viewports = getDefaultViewports();
    const high = viewports.filter(v => v.priority === 'high');
    expect(high.length).toBe(3);
  });

  it('should include mobile, tablet, and desktop', () => {
    const viewports = getDefaultViewports();
    const devices = new Set(viewports.map(v => v.device));
    expect(devices.has('mobile')).toBe(true);
    expect(devices.has('tablet')).toBe(true);
    expect(devices.has('desktop')).toBe(true);
  });

  it('should create empty matrix', () => {
    const matrix = createViewportMatrix();
    expect(matrix.viewports.length).toBe(6);
    expect(matrix.results.length).toBe(0);
  });

  it('should record and summarize viewport results', () => {
    const matrix = createViewportMatrix();
    recordViewportResult(matrix, matrix.viewports[0], [
      { checkId: 'qa-preview-01', passed: true, note: 'OK' },
      { checkId: 'qa-preview-02', passed: false, note: 'CTA below fold' },
    ]);
    expect(matrix.results.length).toBe(1);
    const summary = summarizeViewportResults(matrix);
    expect(summary).toContain('falha');
  });

  it('should report all passed for clean results', () => {
    const matrix = createViewportMatrix();
    for (const vp of matrix.viewports.filter(v => v.priority === 'high')) {
      recordViewportResult(matrix, vp, [
        { checkId: 'qa-preview-01', passed: true, note: 'OK' },
      ]);
    }
    const summary = summarizeViewportResults(matrix);
    expect(summary).toContain('passaram');
  });
});

describe('detectVisualRegressions', () => {
  it('should detect regressions from failed checks', () => {
    const results = [
      {
        viewport: { name: 'iPhone 14 Pro', width: 390, height: 844, device: 'mobile', orientation: 'portrait' as const, priority: 'high' as const },
        checks: [{ checkId: 'qa-preview-01', passed: false, note: 'Hero not above fold' }],
        passed: 0, failed: 1, total: 1,
      },
    ];
    const checklistMap = new Map([
      ['qa-preview-01', { description: 'Hero above fold', severity: 'high' as const, category: 'layout' }],
    ]);
    const report = detectVisualRegressions(results, checklistMap);
    expect(report.regressions.length).toBe(1);
    expect(report.bySeverity.high.length).toBe(1);
  });

  it('should return empty for all-passed results', () => {
    const results = [
      {
        viewport: { name: 'iPhone 14 Pro', width: 390, height: 844, device: 'mobile', orientation: 'portrait' as const, priority: 'high' as const },
        checks: [{ checkId: 'qa-preview-01', passed: true, note: 'OK' }],
        passed: 1, failed: 0, total: 1,
      },
    ];
    const report = detectVisualRegressions(results, new Map());
    expect(report.regressions.length).toBe(0);
  });
});

describe('generateIterationPlan', () => {
  it('should sort high severity regressions first', () => {
    const regressions = [
      { viewport: 'Desktop', checkId: 'qa-preview-18', description: 'Lazy loading missing', severity: 'low' as const, category: 'performance' },
      { viewport: 'Mobile', checkId: 'qa-preview-03', description: 'Horizontal overflow', severity: 'high' as const, category: 'layout' },
      { viewport: 'Tablet', checkId: 'qa-preview-05', description: 'Grid misalignment', severity: 'medium' as const, category: 'layout' },
    ];
    const plan = generateIterationPlan(regressions);
    expect(plan.steps[0].regression.severity).toBe('high');
  });

  it('should return rule about fixing high first', () => {
    const plan = generateIterationPlan([]);
    expect(plan.rule).toContain('high');
  });

  it('should assign estimated effort', () => {
    const regressions = [
      { viewport: 'Mobile', checkId: 'qa-preview-03', description: 'Overflow', severity: 'high' as const, category: 'layout' },
    ];
    const plan = generateIterationPlan(regressions);
    expect(plan.steps[0]).toHaveProperty('estimatedEffort');
  });
});
