import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface ProjectTypeResult {
  type: string;
  confidence: number;
}

interface Signal {
  type: string;
  weight: number;
  match: (files: string[], dirs: string[]) => boolean;
}

const SIGNALS: Signal[] = [
  // Dashboard signals (check first — more specific)
  {
    type: 'dashboard-saas',
    weight: 0.35,
    match: (files, dirs) =>
      files.some(f => /(^|\/)dashboard/i.test(f)) ||
      dirs.some(d => /(^|\/)dashboard$/i.test(d) || /(^|\/)admin$/i.test(d)),
  },
  {
    type: 'dashboard-saas',
    weight: 0.2,
    match: (files) => files.some(f => /chart|datagrid|sidebar/i.test(f)),
  },
  {
    type: 'dashboard-saas',
    weight: 0.15,
    match: (files) => files.some(f => /(^|\/)(login|signup|auth)/i.test(f)),
  },

  // Landing page signals
  {
    type: 'landing-page',
    weight: 0.3,
    match: (files) =>
      files.some(f => /(^|\/)(index\.(html|tsx|jsx)|App\.(tsx|jsx))$/i.test(f)),
  },
  {
    type: 'landing-page',
    weight: 0.25,
    match: (files) => files.some(f => /hero|cta\./i.test(f)),
  },
  {
    type: 'landing-page',
    weight: 0.2,
    match: (files, dirs) =>
      dirs.some(d => /sections$/i.test(d)),
  },
  {
    type: 'landing-page',
    weight: 0.15,
    match: (files) => files.some(f => /benefits|testimonials|faq|pricing/i.test(f)),
  },

  // Ecommerce signals
  {
    type: 'ecommerce-page',
    weight: 0.3,
    match: (files, dirs) =>
      files.some(f => /cart|checkout|product\-detail/i.test(f)) ||
      dirs.some(d => /shop|store|products$/i.test(d)),
  },
  {
    type: 'ecommerce-page',
    weight: 0.2,
    match: (files) => files.some(f => /price|payment|order/i.test(f)),
  },

  // Institutional site signals
  {
    type: 'institutional-site',
    weight: 0.3,
    match: (files, dirs) =>
      (files.some(f => /(^|\/)about/i.test(f)) && files.some(f => /(^|\/)contact/i.test(f))) ||
      dirs.some(d => /(^|\/)about$/i.test(d) || /(^|\/)blog$/i.test(d)),
  },
  {
    type: 'institutional-site',
    weight: 0.2,
    match: (files) => files.some(f => /(^|\/)team|company/i.test(f)),
  },
  {
    type: 'institutional-site',
    weight: 0.15,
    match: (files) => files.some(f => /blog|post|article/i.test(f)),
  },

  // Library/package signals
  {
    type: 'library-package',
    weight: 0.3,
    match: (files) =>
      files.some(f => /(^|\/)index\.ts$/i.test(f)) &&
      !files.some(f2 => /\.html$/i.test(f2)),
  },
];

async function collectAllFiles(projectPath: string, maxDepth: number = 4): Promise<string[]> {
  const files: string[] = [];

  async function walk(dir: string, depth: number) {
    if (depth > maxDepth) return;
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(projectPath, fullPath);
        if (entry.isFile()) {
          files.push(relativePath);
        } else if (entry.isDirectory()) {
          files.push(relativePath); // also collect dir names for matching
          await walk(fullPath, depth + 1);
        }
      }
    } catch {
      // Can't read directory
    }
  }

  await walk(projectPath, 0);
  return files;
}

export async function detectProjectType(projectPath: string): Promise<ProjectTypeResult> {
  const allPaths = await collectAllFiles(projectPath);

  // Separate files and directories
  const filePaths = allPaths;
  const dirPaths = allPaths.filter(p => !p.includes('.')); // rough heuristic: dirs don't have extensions

  // Score each type
  const scores = new Map<string, number>();

  for (const signal of SIGNALS) {
    if (signal.match(filePaths, dirPaths)) {
      const current = scores.get(signal.type) || 0;
      scores.set(signal.type, current + signal.weight);
    }
  }

  // Find the highest scoring type
  let bestType = 'unknown';
  let bestScore = 0;

  for (const [type, score] of scores) {
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  // Convert score to confidence (0-1), using 0.8 as max expected score
  const confidence = Math.min(bestScore / 0.8, 1);

  return {
    type: bestType,
    confidence: Math.round(confidence * 100) / 100,
  };
}
