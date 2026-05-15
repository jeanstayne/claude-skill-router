// Phase 16.2 — Analyze whether a project has a design system in place
// Scans for CSS variables, Tailwind config, and component variants.

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface DesignSystemAnalysis {
  hasDesignSystem: boolean;
  hasCssVariables: boolean;
  hasTailwindConfig: boolean;
  hasComponentVariants: boolean;
  hasDesignTokens: boolean;
  files: string[];
  confidence: number;
  gaps: string[];
}

export async function analyzeDesignSystem(projectPath: string): Promise<DesignSystemAnalysis> {
  const analysis: DesignSystemAnalysis = {
    hasDesignSystem: false,
    hasCssVariables: false,
    hasTailwindConfig: false,
    hasComponentVariants: false,
    hasDesignTokens: false,
    files: [],
    confidence: 0,
    gaps: [],
  };

  // Check for tailwind config
  const tailwindFiles = ['tailwind.config.ts', 'tailwind.config.js', 'tailwind.config.mjs'];
  for (const f of tailwindFiles) {
    try {
      await fs.access(path.join(projectPath, f));
      analysis.hasTailwindConfig = true;
      analysis.files.push(f);
      break;
    } catch {}
  }

  // Check for CSS with custom properties
  const cssFiles = ['src/index.css', 'src/globals.css', 'src/styles/globals.css', 'src/app/globals.css'];
  for (const f of cssFiles) {
    try {
      const content = await fs.readFile(path.join(projectPath, f), 'utf-8');
      if (content.includes('--') && content.includes(':root') || content.includes('@theme')) {
        analysis.hasCssVariables = true;
        analysis.files.push(f);
      }
      break;
    } catch {}
  }

  // Check for component variants (class-variance-authority, cva, or variant patterns)
  try {
    const srcDir = path.join(projectPath, 'src');
    const hasVariants = await searchInDir(srcDir, /(?:cva|class-variance-authority|variant(?:s)?\s*[=:]\s*\{)/);
    analysis.hasComponentVariants = hasVariants;
  } catch {}

  // Check for DESIGN.md
  try {
    await fs.access(path.join(projectPath, '.claude', 'design', 'DESIGN.md'));
    analysis.hasDesignTokens = true;
    analysis.files.push('.claude/design/DESIGN.md');
  } catch {}

  // Compute confidence
  let score = 0;
  if (analysis.hasCssVariables) score++;
  if (analysis.hasTailwindConfig) score++;
  if (analysis.hasComponentVariants) score++;
  if (analysis.hasDesignTokens) score++;
  analysis.confidence = score / 4;
  analysis.hasDesignSystem = score >= 2;

  if (!analysis.hasCssVariables) analysis.gaps.push('Sem CSS custom properties (design tokens) encontrados.');
  if (!analysis.hasTailwindConfig) analysis.gaps.push('Sem tailwind.config encontrado.');
  if (!analysis.hasComponentVariants) analysis.gaps.push('Sem padrão de variantes de componente (cva ou similar) encontrado.');
  if (!analysis.hasDesignTokens) analysis.gaps.push('Sem DESIGN.md encontrado em .claude/design/.');

  return analysis;
}

async function searchInDir(dir: string, pattern: RegExp): Promise<boolean> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        if (await searchInDir(path.join(dir, entry.name), pattern)) return true;
      } else if (entry.isFile() && /\.(tsx?|jsx?|css)$/.test(entry.name)) {
        const content = await fs.readFile(path.join(dir, entry.name), 'utf-8');
        if (pattern.test(content)) return true;
      }
    }
  } catch {}
  return false;
}
