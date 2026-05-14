import { describe, it, expect } from 'vitest';
import { scanProject } from '../src/scanner/scanProject.js';
import { detectStack } from '../src/scanner/detectStack.js';
import { detectProjectType } from '../src/scanner/detectProjectType.js';
import { detectClaudeConfig } from '../src/scanner/detectClaudeConfig.js';
import * as path from 'node:path';

const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../fixtures');

function fixturePath(name: string): string {
  return path.join(FIXTURES_DIR, name);
}

describe('detectStack', () => {
  it('should detect React + Vite + Tailwind stack', async () => {
    const result = await detectStack(fixturePath('react-vite-tailwind-lp'));
    expect(result.framework).toBe('react');
    expect(result.language).toBe('typescript');
    expect(result.ui).toContain('tailwind');
    expect(result.tests).toContain('vitest');
  });

  it('should detect Next.js stack', async () => {
    const result = await detectStack(fixturePath('next-dashboard'));
    expect(result.framework).toBe('next');
    expect(result.language).toBe('typescript');
  });

  it('should detect HTML static site', async () => {
    const result = await detectStack(fixturePath('html-static-site'));
    expect(result.framework).toBe('html-static');
    expect(result.language).toBe('html');
  });

  it('should return unknown for empty project', async () => {
    const result = await detectStack(fixturePath('unknown-project'));
    expect(result.framework).toBe('unknown');
  });

  it('should detect shadcn/ui in next-dashboard', async () => {
    const result = await detectStack(fixturePath('next-dashboard'));
    expect(result.ui).toContain('shadcn');
    expect(result.ui).toContain('tailwind');
  });

  it('should return empty arrays when nothing detected', async () => {
    const result = await detectStack(fixturePath('unknown-project'));
    expect(result.ui).toEqual([]);
    expect(result.tests).toEqual([]);
  });
});

describe('detectProjectType', () => {
  it('should detect landing page from sections and file names', async () => {
    const result = await detectProjectType(fixturePath('react-vite-tailwind-lp'));
    expect(result.type).toBe('landing-page');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should detect dashboard from file structure', async () => {
    const result = await detectProjectType(fixturePath('next-dashboard'));
    expect(result.type).toBe('dashboard-saas');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should detect institutional site from about/contact files', async () => {
    const result = await detectProjectType(fixturePath('html-static-site'));
    // html-static-site has about.html and contact.html
    expect(result.type).toBe('institutional-site');
  });

  it('should return unknown with 0 confidence for empty project', async () => {
    const result = await detectProjectType(fixturePath('unknown-project'));
    expect(result.type).toBe('unknown');
    expect(result.confidence).toBe(0);
  });
});

describe('detectClaudeConfig', () => {
  it('should detect CLAUDE.md in .claude folder', async () => {
    const result = await detectClaudeConfig(fixturePath('react-vite-tailwind-lp'));
    expect(result.hasClaudeMd).toBe(false); // CLAUDE.md is in .claude/ not root
    expect(result.hasClaudeFolder).toBe(true);
  });

  it('should detect no claude config in next-dashboard', async () => {
    const result = await detectClaudeConfig(fixturePath('next-dashboard'));
    expect(result.hasClaudeMd).toBe(false);
    expect(result.hasAgentsMd).toBe(false);
    expect(result.hasClaudeFolder).toBe(false);
  });

  it('should return empty skills/agents when no folder', async () => {
    const result = await detectClaudeConfig(fixturePath('unknown-project'));
    expect(result.skills).toEqual([]);
    expect(result.agents).toEqual([]);
  });
});

describe('scanProject', () => {
  it('should scan a React/Vite/Tailwind landing page', async () => {
    const result = await scanProject(fixturePath('react-vite-tailwind-lp'));
    expect(result.projectRoot).toContain('react-vite-tailwind-lp');
    expect(result.framework).toBe('react');
    expect(result.ui).toContain('tailwind');
    expect(result.agentConfig.hasClaudeFolder).toBe(true);
    expect(result.projectType).toBeDefined();
  });

  it('should scan a Next.js dashboard', async () => {
    const result = await scanProject(fixturePath('next-dashboard'));
    expect(result.framework).toBe('next');
    expect(result.ui).toContain('shadcn');
    expect(result.projectType).toBe('dashboard-saas');
  });

  it('should scan HTML static site', async () => {
    const result = await scanProject(fixturePath('html-static-site'));
    expect(result.framework).toBe('html-static');
    expect(result.language).toBe('html');
  });

  it('should scan unknown project', async () => {
    const result = await scanProject(fixturePath('unknown-project'));
    expect(result.framework).toBe('unknown');
    expect(result.confidence).toBe(0);
  });

  it('should have valid confidence range', async () => {
    const result = await scanProject(fixturePath('react-vite-tailwind-lp'));
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('should return all required fields', async () => {
    const result = await scanProject(fixturePath('next-dashboard'));
    expect(result).toHaveProperty('projectRoot');
    expect(result).toHaveProperty('framework');
    expect(result).toHaveProperty('language');
    expect(result).toHaveProperty('ui');
    expect(result).toHaveProperty('tests');
    expect(result).toHaveProperty('agentConfig');
    expect(result).toHaveProperty('projectType');
    expect(result).toHaveProperty('confidence');
    expect(result.agentConfig).toHaveProperty('hasClaudeMd');
    expect(result.agentConfig).toHaveProperty('hasAgentsMd');
    expect(result.agentConfig).toHaveProperty('hasClaudeFolder');
    expect(result.agentConfig).toHaveProperty('skills');
    expect(result.agentConfig).toHaveProperty('agents');
  });
});
