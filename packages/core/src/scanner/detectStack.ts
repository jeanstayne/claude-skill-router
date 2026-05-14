import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface StackResult {
  framework: string;
  language: string;
  ui: string[];
  tests: string[];
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const FRAMEWORK_PATTERNS: Array<{ name: string; deps: string[] }> = [
  { name: 'next', deps: ['next'] },
  { name: 'react', deps: ['react', 'react-dom'] },
  { name: 'vue', deps: ['vue'] },
  { name: 'astro', deps: ['astro'] },
  { name: 'vite', deps: ['vite'] },
  { name: 'express', deps: ['express'] },
  { name: 'fastify', deps: ['fastify'] },
];

const UI_PATTERNS: Array<{ name: string; deps: string[] }> = [
  { name: 'tailwind', deps: ['tailwindcss'] },
  { name: 'shadcn', deps: ['@shadcn/ui', 'shadcn-ui', '@radix-ui/react-dialog'] },
  { name: 'radix', deps: ['@radix-ui/react-primitive'] },
  { name: 'framer-motion', deps: ['framer-motion'] },
  { name: 'styled-components', deps: ['styled-components'] },
  { name: 'css-modules', deps: [] }, // detected by file scan
];

const TEST_PATTERNS: Array<{ name: string; deps: string[] }> = [
  { name: 'vitest', deps: ['vitest'] },
  { name: 'jest', deps: ['jest'] },
  { name: 'playwright', deps: ['@playwright/test'] },
  { name: 'cypress', deps: ['cypress'] },
  { name: 'testing-library', deps: ['@testing-library/react'] },
];

export async function detectStack(projectPath: string): Promise<StackResult> {
  const allDeps = new Set<string>();

  // Read package.json
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    const pkgContent = await fs.readFile(pkgPath, 'utf-8');
    const pkg: PackageJson = JSON.parse(pkgContent);

    for (const dep of Object.keys(pkg.dependencies || {})) {
      allDeps.add(dep);
    }
    for (const dep of Object.keys(pkg.devDependencies || {})) {
      allDeps.add(dep);
    }
  } catch {
    // No package.json found — not a JS/TS project
  }

  // Detect framework
  let framework = 'unknown';
  for (const fw of FRAMEWORK_PATTERNS) {
    if (fw.deps.every(d => allDeps.has(d))) {
      if (fw.name === 'react' && allDeps.has('next')) {
        continue; // Next.js takes priority over React
      }
      if (fw.name === 'vite' && (allDeps.has('next') || allDeps.has('vue') || allDeps.has('astro'))) {
        continue; // Vite is often a transitive dep
      }
      framework = fw.name;
      break;
    }
  }

  // Detect language
  let language = 'unknown';
  const hasTsConfig = await fileExists(path.join(projectPath, 'tsconfig.json'));
  const hasTsxFiles = await hasFilesWithExt(projectPath, '.tsx');
  const hasTsFiles = await hasFilesWithExt(projectPath, '.ts');
  const hasJsxFiles = await hasFilesWithExt(projectPath, '.jsx');

  if (hasTsConfig || hasTsxFiles) {
    language = 'typescript';
  } else if (hasTsFiles) {
    language = 'typescript';
  } else if (hasJsxFiles) {
    language = 'javascript';
  } else if (allDeps.size > 0) {
    language = 'javascript';
  }

  // If it's HTML-static, detect differently
  if (allDeps.size === 0 && !hasTsConfig) {
    const htmlFiles = await hasFilesWithExt(projectPath, '.html');
    if (htmlFiles) {
      language = 'html';
      framework = 'html-static';
    }
  }

  // Detect UI libraries
  const ui: string[] = [];
  for (const uip of UI_PATTERNS) {
    if (uip.name === 'css-modules') {
      const hasCssModules = await hasFilesWithPattern(projectPath, /\.module\.css$/);
      if (hasCssModules) ui.push('css-modules');
      continue;
    }
    if (uip.deps.some(d => allDeps.has(d))) {
      ui.push(uip.name);
    }
  }

  // Detect test frameworks
  const tests: string[] = [];
  for (const tp of TEST_PATTERNS) {
    if (tp.deps.some(d => allDeps.has(d))) {
      tests.push(tp.name);
    }
  }

  return { framework, language, ui, tests };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function hasFilesWithExt(dirPath: string, ext: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(ext)) return true;
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        const found = await hasFilesWithExt(path.join(dirPath, entry.name), ext);
        if (found) return true;
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }
  return false;
}

async function hasFilesWithPattern(dirPath: string, pattern: RegExp): Promise<boolean> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && pattern.test(entry.name)) return true;
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        const found = await hasFilesWithPattern(path.join(dirPath, entry.name), pattern);
        if (found) return true;
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }
  return false;
}
