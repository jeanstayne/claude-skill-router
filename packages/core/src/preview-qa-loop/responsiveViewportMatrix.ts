// Phase 16.6 — Responsive viewport matrix for QA

export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
  device: string;
  orientation: 'portrait' | 'landscape';
  priority: 'high' | 'medium' | 'low';
}

export interface ViewportCheckResult {
  viewport: ViewportConfig;
  checks: Array<{ checkId: string; passed: boolean; note: string }>;
  passed: number;
  failed: number;
  total: number;
}

export interface ResponsiveViewportMatrix {
  viewports: ViewportConfig[];
  results: ViewportCheckResult[];
}

const DEFAULT_VIEWPORTS: ViewportConfig[] = [
  { name: 'iPhone 14 Pro', width: 390, height: 844, device: 'mobile', orientation: 'portrait', priority: 'high' },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, device: 'mobile', orientation: 'portrait', priority: 'medium' },
  { name: 'iPad Air', width: 768, height: 1024, device: 'tablet', orientation: 'portrait', priority: 'high' },
  { name: 'iPad Pro', width: 1024, height: 1366, device: 'tablet', orientation: 'landscape', priority: 'medium' },
  { name: 'Laptop (1440x900)', width: 1440, height: 900, device: 'desktop', orientation: 'landscape', priority: 'high' },
  { name: 'Full HD', width: 1920, height: 1080, device: 'desktop', orientation: 'landscape', priority: 'low' },
];

export function getDefaultViewports(): ViewportConfig[] {
  return DEFAULT_VIEWPORTS;
}

export function createViewportMatrix(customViewports?: ViewportConfig[]): ResponsiveViewportMatrix {
  const viewports = customViewports ?? getDefaultViewports();
  return { viewports, results: [] };
}

export function recordViewportResult(
  matrix: ResponsiveViewportMatrix,
  viewport: ViewportConfig,
  checks: Array<{ checkId: string; passed: boolean; note: string }>,
): ViewportCheckResult {
  const passed = checks.filter(c => c.passed).length;
  const failed = checks.length - passed;
  const result: ViewportCheckResult = { viewport, checks, passed, failed, total: checks.length };
  matrix.results.push(result);
  return result;
}

export function summarizeViewportResults(matrix: ResponsiveViewportMatrix): string {
  if (matrix.results.length === 0) return 'Nenhum resultado de viewport registrado.';

  const highPriority = matrix.results.filter(r => r.viewport.priority === 'high');
  const allPassed = highPriority.every(r => r.failed === 0);
  const totalFailed = highPriority.reduce((s, r) => s + r.failed, 0);

  if (allPassed) return 'Todos viewports prioritários passaram. ✅';
  return `${totalFailed} falhas em viewports prioritários. Verificar: ${highPriority.filter(r => r.failed > 0).map(r => r.viewport.name).join(', ')}`;
}
