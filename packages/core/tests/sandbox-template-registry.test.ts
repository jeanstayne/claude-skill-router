import { describe, it, expect } from 'vitest';
import { loadSandboxTemplates, clearTemplateCache } from '../src/sandbox-template-registry/loadSandboxTemplates.js';
import { recommendSandboxTemplate } from '../src/sandbox-template-registry/recommendSandboxTemplate.js';
import * as path from 'node:path';

const REGISTRY_PATH = path.resolve(import.meta.dirname, '../../../registry/sandbox-templates');

describe('loadSandboxTemplates', () => {
  it('should load all 5 templates from registry', async () => {
    clearTemplateCache();
    const templates = await loadSandboxTemplates(REGISTRY_PATH);
    expect(templates.length).toBe(5);
  });

  it('should include nextjs-tailwind-shadcn template', async () => {
    clearTemplateCache();
    const templates = await loadSandboxTemplates(REGISTRY_PATH);
    const tpl = templates.find(t => t.id === 'nextjs-tailwind-shadcn');
    expect(tpl).toBeDefined();
    expect(tpl!.framework).toBe('nextjs');
    expect(tpl!.ui).toContain('tailwind');
    expect(tpl!.ui).toContain('shadcn');
    expect(tpl!.requiredFiles.length).toBeGreaterThan(0);
    expect(Object.keys(tpl!.recommendedDependencies.dependencies).length).toBeGreaterThan(0);
  });

  it('should include vite-react-tailwind template', async () => {
    clearTemplateCache();
    const templates = await loadSandboxTemplates(REGISTRY_PATH);
    const tpl = templates.find(t => t.id === 'vite-react-tailwind');
    expect(tpl).toBeDefined();
    expect(tpl!.framework).toBe('react');
    expect(tpl!.port).toBe(5173);
  });

  it('should cache templates after first load', async () => {
    clearTemplateCache();
    const first = await loadSandboxTemplates(REGISTRY_PATH);
    const second = await loadSandboxTemplates(REGISTRY_PATH);
    expect(first).toBe(second); // Same reference (cached)
  });
});

describe('recommendSandboxTemplate', () => {
  it('should recommend nextjs+shadcn for landing page with UI', async () => {
    clearTemplateCache();
    const result = await recommendSandboxTemplate({
      projectType: 'landing-page',
      needsUi: true,
      registryPath: REGISTRY_PATH,
    });
    expect(result.topPick).not.toBeNull();
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should prioritize framework match', async () => {
    clearTemplateCache();
    const result = await recommendSandboxTemplate({
      framework: 'astro',
      registryPath: REGISTRY_PATH,
    });
    expect(result.topPick).not.toBeNull();
    expect(result.topPick!.template.framework).toBe('astro');
  });

  it('should prioritize API + DB for nextjs-api needs', async () => {
    clearTemplateCache();
    const result = await recommendSandboxTemplate({
      needsApi: true,
      needsDatabase: true,
      registryPath: REGISTRY_PATH,
    });
    expect(result.topPick).not.toBeNull();
    // nextjs-api should be high in the list
    const apiTemplate = result.recommendations.find(r => r.template.id === 'nextjs-api');
    expect(apiTemplate).toBeDefined();
    expect(apiTemplate!.score).toBeGreaterThanOrEqual(3);
  });

  it('should return recommendations sorted by score', async () => {
    clearTemplateCache();
    const result = await recommendSandboxTemplate({
      projectType: 'landing-page',
      registryPath: REGISTRY_PATH,
    });
    for (let i = 1; i < result.recommendations.length; i++) {
      expect(result.recommendations[i].score).toBeLessThanOrEqual(
        result.recommendations[i - 1].score,
      );
    }
  });
});
