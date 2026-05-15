// Phase 16.2 — Detect hardcoded visual classes that should be semantic tokens
// Scans source files for direct color/spacing/shadow classes and flags them.

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface HardcodedClassIssue {
  type: 'hardcoded-color-class' | 'hardcoded-spacing-class' | 'hardcoded-shadow-class' | 'hardcoded-radius-class';
  file: string;
  className: string;
  line?: number;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
}

const HARDCODED_PATTERNS: Array<{ regex: RegExp; type: HardcodedClassIssue['type']; severity: HardcodedClassIssue['severity']; recommendation: string }> = [
  { regex: /text-white(?!\S)/g, type: 'hardcoded-color-class', severity: 'medium', recommendation: 'Use semantic token: text-on-primary ou text-on-dark em vez de text-white diretamente.' },
  { regex: /text-black(?!\S)/g, type: 'hardcoded-color-class', severity: 'medium', recommendation: 'Use semantic token: text-primary ou text-on-light em vez de text-black diretamente.' },
  { regex: /bg-white(?!\S)/g, type: 'hardcoded-color-class', severity: 'medium', recommendation: 'Use semantic token: bg-surface ou bg-card em vez de bg-white diretamente.' },
  { regex: /bg-black(?!\S)/g, type: 'hardcoded-color-class', severity: 'medium', recommendation: 'Use semantic token: bg-inverse ou bg-dark em vez de bg-black diretamente.' },
  { regex: /text-gray-\d{3}(?!\S)/g, type: 'hardcoded-color-class', severity: 'low', recommendation: 'Use semantic token: text-muted, text-secondary ou text-body.' },
  { regex: /bg-gray-\d{3}(?!\S)/g, type: 'hardcoded-color-class', severity: 'low', recommendation: 'Use semantic token: bg-muted, bg-subtle ou bg-section-alt.' },
  { regex: /border-gray-\d{3}(?!\S)/g, type: 'hardcoded-color-class', severity: 'low', recommendation: 'Use semantic token: border-subtle ou border-muted.' },
  { regex: /shadow-lg(?!\S)/g, type: 'hardcoded-shadow-class', severity: 'low', recommendation: 'Use semantic token: shadow-card ou shadow-elevated.' },
  { regex: /rounded-lg(?!\S)/g, type: 'hardcoded-radius-class', severity: 'low', recommendation: 'Use semantic token: rounded-card ou rounded-component.' },
];

const IGNORE_PATTERNS = [
  /\/node_modules\//,
  /\/dist\//,
  /\/\.git\//,
  /\.test\./,
  /\.spec\./,
];

export async function detectHardcodedVisualClasses(projectPath: string): Promise<HardcodedClassIssue[]> {
  const issues: HardcodedClassIssue[] = [];

  const sourceDir = path.join(projectPath, 'src');
  let files: string[] = [];
  try {
    files = await walkDir(sourceDir, ['.tsx', '.jsx', '.css']);
  } catch {
    return issues;
  }

  for (const file of files) {
    if (IGNORE_PATTERNS.some(p => p.test(file))) continue;
    try {
      const content = await fs.readFile(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        for (const pattern of HARDCODED_PATTERNS) {
          pattern.regex.lastIndex = 0;
          let match;
          while ((match = pattern.regex.exec(lines[i])) !== null) {
            const isInComment = /\/\/.*$/.test(lines[i]) && lines[i].indexOf(match[0]) > lines[i].indexOf('//');
            if (!isInComment) {
              issues.push({
                type: pattern.type,
                file: path.relative(projectPath, file).replace(/\\/g, '/'),
                className: match[0],
                line: i + 1,
                severity: pattern.severity,
                recommendation: pattern.recommendation,
              });
            }
          }
        }
      }
    } catch {}
  }

  return issues;
}

async function walkDir(dir: string, extensions: string[]): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        results.push(...await walkDir(fullPath, extensions));
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  } catch {}
  return results;
}
