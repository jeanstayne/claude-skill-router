// Phase 16.4 — Load all sandbox templates from registry/

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface SandboxTemplate {
  id: string;
  name: string;
  framework: string;
  language: string;
  ui: string[];
  version: string;
  recommendedFor: string[];
  requiredFiles: string[];
  recommendedDependencies: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  cssStrategy: string;
  componentStrategy: string;
  buildCommand: string;
  devCommand: string;
  port: number;
}

let templateCache: SandboxTemplate[] | null = null;

export async function loadSandboxTemplates(registryPath?: string): Promise<SandboxTemplate[]> {
  if (templateCache) return templateCache;

  const dir = registryPath ?? path.resolve(import.meta.dirname, '..', '..', '..', '..', 'registry', 'sandbox-templates');

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const templates: SandboxTemplate[] = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.json')) {
      const content = await fs.readFile(path.join(dir, entry.name), 'utf-8');
      const parsed = JSON.parse(content) as SandboxTemplate;
      templates.push(parsed);
    }
  }

  templateCache = templates;
  return templates;
}

export function clearTemplateCache(): void {
  templateCache = null;
}
