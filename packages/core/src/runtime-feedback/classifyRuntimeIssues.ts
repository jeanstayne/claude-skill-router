// Phase 16.5 — Classify runtime issues into categories

import type { ConsoleLogSummary } from './parseConsoleLogs.js';
import type { NetworkSummary } from './parseNetworkRequests.js';

export type IssueCategory =
  | 'js-error'
  | 'hydration-error'
  | 'a11y-violation'
  | 'network-error'
  | 'image-error'
  | 'font-error'
  | 'perf-warning'
  | 'seo-warning'
  | 'deprecation'
  | 'unknown';

export interface ClassifiedIssue {
  category: IssueCategory;
  severity: 'high' | 'medium' | 'low';
  message: string;
  context: string;
}

export interface ClassificationReport {
  issues: ClassifiedIssue[];
  byCategory: Record<IssueCategory, ClassifiedIssue[]>;
  summary: string;
}

const PATTERNS: Array<{ regex: RegExp; category: IssueCategory; severity: 'high' | 'medium' | 'low' }> = [
  { regex: /hydration|hydrat/i, category: 'hydration-error', severity: 'high' },
  { regex: /accessibility|aria|a11y|role=/i, category: 'a11y-violation', severity: 'high' },
  { regex: /\[Image\]|next\/image|unoptimized|alt\s*=/i, category: 'image-error', severity: 'medium' },
  { regex: /font|@font-face|typeface|woff/i, category: 'font-error', severity: 'medium' },
  { regex: /deprecat/i, category: 'deprecation', severity: 'low' },
  { regex: /CLS|LCP|FID|INP|TTFB|Core Web Vital/i, category: 'perf-warning', severity: 'high' },
  { regex: /indexing|robots|crawl|sitemap|meta/i, category: 'seo-warning', severity: 'medium' },
  { regex: /script error|uncaught|typeerror|referenceerror|syntaxerror/i, category: 'js-error', severity: 'high' },
  { regex: /^https?:/, category: 'network-error', severity: 'high' },
];

export function classifyRuntimeIssues(console: ConsoleLogSummary, network: NetworkSummary): ClassificationReport {
  const issues: ClassifiedIssue[] = [];

  for (const entry of [...console.entries]) {
    const match = PATTERNS.find(p => p.regex.test(entry.message));
    if (match) {
      issues.push({ category: match.category, severity: match.severity, message: entry.message, context: `Console ${entry.type}: ${entry.source ?? 'unknown'}` });
    } else if (entry.type === 'error') {
      issues.push({ category: 'js-error', severity: 'medium', message: entry.message, context: `Console ${entry.type}: ${entry.source ?? 'unknown'}` });
    } else if (entry.type === 'warn') {
      issues.push({ category: 'unknown', severity: 'low', message: entry.message, context: `Console ${entry.type}: ${entry.source ?? 'unknown'}` });
    }
  }

  for (const req of network.failed) {
    issues.push({ category: 'network-error', severity: 'high', message: `HTTP ${req.status} — ${req.method} ${req.url}`, context: `${req.type} request (${req.duration}ms)` });
  }

  for (const req of network.slow) {
    issues.push({ category: 'perf-warning', severity: 'medium', message: `Slow request: ${req.method} ${req.url}`, context: `${req.type} request took ${req.duration}ms` });
  }

  const byCategory = {} as Record<IssueCategory, ClassifiedIssue[]>;
  for (const issue of issues) {
    (byCategory[issue.category] ??= []).push(issue);
  }

  const high = issues.filter(i => i.severity === 'high').length;
  const med = issues.filter(i => i.severity === 'medium').length;
  const low = issues.filter(i => i.severity === 'low').length;
  const cats = Object.entries(byCategory).map(([k, v]) => `${k} (${v.length})`).join(', ');
  const summary = `${issues.length} issues (${high} high, ${med} medium, ${low} low). Categorias: ${cats || 'nenhuma'}`;

  return { issues, byCategory, summary };
}
