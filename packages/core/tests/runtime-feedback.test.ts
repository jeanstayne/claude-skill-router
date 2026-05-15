import { describe, it, expect } from 'vitest';
import { parseConsoleLogs } from '../src/runtime-feedback/parseConsoleLogs.js';
import { parseNetworkRequests } from '../src/runtime-feedback/parseNetworkRequests.js';
import { classifyRuntimeIssues } from '../src/runtime-feedback/classifyRuntimeIssues.js';
import { generateFixPlan } from '../src/runtime-feedback/generateFixPlan.js';
import type { ConsoleLogEntry } from '../src/runtime-feedback/parseConsoleLogs.js';
import type { NetworkRequestEntry } from '../src/runtime-feedback/parseNetworkRequests.js';

describe('parseConsoleLogs', () => {
  it('should parse Chrome-style log lines', () => {
    const raw = 'ERROR [main.js:10:5] Uncaught TypeError: x is not a function\nWARN [app.tsx:23] Deprecated API usage';
    const result = parseConsoleLogs(raw);
    expect(result.totalErrors).toBe(1);
    expect(result.totalWarnings).toBe(1);
  });

  it('should handle structured entries', () => {
    const entries: ConsoleLogEntry[] = [
      { type: 'error', message: 'Hydration failed', source: 'layout.tsx', line: 5 },
      { type: 'warn', message: 'Image missing alt text', source: 'Hero.tsx', line: 12 },
      { type: 'log', message: 'Page loaded', source: 'page.tsx', line: 1 },
    ];
    const result = parseConsoleLogs(entries);
    expect(result.totalErrors).toBe(1);
    expect(result.totalWarnings).toBe(1);
    expect(result.totalLogs).toBe(1);
  });

  it('should deduplicate unique errors', () => {
    const entries: ConsoleLogEntry[] = [
      { type: 'error', message: 'Same error' },
      { type: 'error', message: 'Same error' },
      { type: 'error', message: 'Different error' },
    ];
    const result = parseConsoleLogs(entries);
    expect(result.uniqueErrors.length).toBe(2);
  });
});

describe('parseNetworkRequests', () => {
  it('should separate failed, slow, and ok requests', () => {
    const requests: NetworkRequestEntry[] = [
      { url: 'https://api.example.com/data', method: 'GET', status: 200, duration: 100, type: 'fetch', ok: true },
      { url: 'https://api.example.com/error', method: 'POST', status: 500, duration: 200, type: 'fetch', ok: false },
      { url: 'https://cdn.example.com/font.woff2', method: 'GET', status: 200, duration: 5000, type: 'font', ok: true },
    ];
    const result = parseNetworkRequests(requests);
    expect(result.failed.length).toBe(1);
    expect(result.slow.length).toBe(1);
    expect(result.ok.length).toBe(1);
    expect(result.totalRequests).toBe(3);
  });

  it('should count errors by URL', () => {
    const requests: NetworkRequestEntry[] = [
      { url: '/api/fail', method: 'GET', status: 500, duration: 100, type: 'fetch', ok: false },
      { url: '/api/fail', method: 'GET', status: 500, duration: 100, type: 'fetch', ok: false },
    ];
    const result = parseNetworkRequests(requests);
    expect(result.errorsByUrl.get('/api/fail')).toBe(2);
  });

  it('should calculate total size and duration', () => {
    const requests: NetworkRequestEntry[] = [
      { url: '/a', method: 'GET', status: 200, duration: 100, size: 5000, type: 'script', ok: true },
      { url: '/b', method: 'GET', status: 200, duration: 200, size: 3000, type: 'stylesheet', ok: true },
    ];
    const result = parseNetworkRequests(requests);
    expect(result.totalSize).toBe(8000);
    expect(result.totalDuration).toBe(300);
  });
});

describe('classifyRuntimeIssues', () => {
  it('should classify hydration errors', () => {
    const console = parseConsoleLogs([{ type: 'error', message: 'Hydration mismatch in div', source: 'layout.tsx' }]);
    const network = parseNetworkRequests([]);
    const report = classifyRuntimeIssues(console, network);
    expect(report.issues.some(i => i.category === 'hydration-error')).toBe(true);
  });

  it('should classify network errors', () => {
    const console = parseConsoleLogs([]);
    const network = parseNetworkRequests([
      { url: 'https://api.example.com/500', method: 'GET', status: 500, duration: 100, type: 'fetch', ok: false },
    ]);
    const report = classifyRuntimeIssues(console, network);
    expect(report.issues.some(i => i.category === 'network-error')).toBe(true);
  });

  it('should classify JS errors', () => {
    const console = parseConsoleLogs([{ type: 'error', message: 'TypeError: x is not a function' }]);
    const network = parseNetworkRequests([]);
    const report = classifyRuntimeIssues(console, network);
    expect(report.issues.some(i => i.category === 'js-error')).toBe(true);
  });

  it('should classify accessibility violations', () => {
    const console = parseConsoleLogs([{ type: 'error', message: 'Missing ARIA role on interactive element' }]);
    const network = parseNetworkRequests([]);
    const report = classifyRuntimeIssues(console, network);
    expect(report.issues.some(i => i.category === 'a11y-violation')).toBe(true);
  });
});

describe('generateFixPlan', () => {
  it('should generate fix actions sorted by priority', () => {
    const issues = [
      { category: 'hydration-error' as const, severity: 'high' as const, message: 'Hydration failed', context: 'layout.tsx' },
      { category: 'a11y-violation' as const, severity: 'high' as const, message: 'Missing aria-label', context: 'Button.tsx' },
      { category: 'deprecation' as const, severity: 'low' as const, message: 'Old API', context: 'old.ts' },
    ];
    const plan = generateFixPlan(issues);
    expect(plan.actions.length).toBe(3);
    expect(plan.actions[0].priority).toBeLessThan(plan.actions[2].priority);
  });

  it('should generate priority order list', () => {
    const plan = generateFixPlan([]);
    expect(plan.priorityOrder.length).toBeGreaterThan(0);
  });

  it('should suggest specific fixes for hydration errors', () => {
    const issues = [
      { category: 'hydration-error' as const, severity: 'high' as const, message: 'Hydration failed', context: 'test.tsx' },
    ];
    const plan = generateFixPlan(issues);
    expect(plan.actions[0].action).toContain('mismatch');
  });
});
