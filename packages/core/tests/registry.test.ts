import { describe, it, expect } from 'vitest';
import { loadRegistry } from '../src/registry/loadRegistry.js';
import { validateRegistry } from '../src/registry/validateRegistry.js';
import * as path from 'node:path';

const REGISTRY_PATH = path.resolve(import.meta.dirname, '../../../registry');

describe('loadRegistry', () => {
  it('should load registry from disk', async () => {
    const registry = await loadRegistry(REGISTRY_PATH);
    expect(registry.skills.length).toBeGreaterThan(0);
    expect(registry.agents.length).toBeGreaterThan(0);
    expect(registry.packs.length).toBeGreaterThan(0);
  });

  it('should load skills with required fields', async () => {
    const registry = await loadRegistry(REGISTRY_PATH);
    for (const skill of registry.skills) {
      expect(skill).toHaveProperty('id');
      expect(skill).toHaveProperty('name');
      expect(skill).toHaveProperty('version');
      expect(skill).toHaveProperty('description');
      expect(skill).toHaveProperty('projectTypes');
      expect(skill).toHaveProperty('stacks');
    }
  });

  it('should load agents from markdown files', async () => {
    const registry = await loadRegistry(REGISTRY_PATH);
    expect(registry.agents.length).toBeGreaterThanOrEqual(5);
    const agentIds = registry.agents.map(a => a.id);
    expect(agentIds).toContain('ui-designer');
    expect(agentIds).toContain('frontend-developer');
    expect(agentIds).toContain('conversion-copywriter');
    expect(agentIds).toContain('accessibility-specialist');
    expect(agentIds).toContain('design-bridge');
  });

  it('should load packs with valid references', async () => {
    const registry = await loadRegistry(REGISTRY_PATH);
    expect(registry.packs.length).toBeGreaterThanOrEqual(4);

    const landingPage = registry.packs.find(p => p.id === 'landing-page');
    expect(landingPage).toBeDefined();
    expect(landingPage!.skills).toContain('lp-conversion-architect');
    expect(landingPage!.agents).toContain('ui-designer');
  });

  it('should load design engines from registry', async () => {
    const registry = await loadRegistry(REGISTRY_PATH);
    expect(registry.designEngines.length).toBeGreaterThanOrEqual(8);
    const lovable = registry.designEngines.find(e => e.id === 'lovable');
    expect(lovable).toBeDefined();
    expect(lovable!.name).toBe('Lovable');
    expect(lovable!.bestFor).toContain('landing-page');
    expect(lovable!.integrationType).toContain('manual-reference');
  });

  it('should validate design engines have required fields', async () => {
    const registry = await loadRegistry(REGISTRY_PATH);
    for (const engine of registry.designEngines) {
      expect(engine).toHaveProperty('id');
      expect(engine).toHaveProperty('name');
      expect(engine).toHaveProperty('bestFor');
      expect(engine).toHaveProperty('recommendedFor');
      expect(engine).toHaveProperty('riskLevel');
    }
  });

  it('should return empty arrays for non-existent path', async () => {
    const registry = await loadRegistry('/nonexistent/path');
    expect(registry.skills).toEqual([]);
    expect(registry.agents).toEqual([]);
    expect(registry.packs).toEqual([]);
  });
});

describe('validateRegistry', () => {
  it('should validate a correct registry', async () => {
    const registry = await loadRegistry(REGISTRY_PATH);
    const result = validateRegistry(registry);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should detect missing skill references in packs', () => {
    const result = validateRegistry({
      skills: [],
      agents: [{ id: 'test-agent', name: 'Test Agent', filePath: '/test.md' }],
      packs: [{
        id: 'test-pack',
        name: 'Test Pack',
        projectTypes: ['landing-page'],
        skills: ['nonexistent-skill'],
        agents: ['test-agent'],
        maxSkills: 3,
        maxAgents: 3,
      }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('nonexistent-skill'))).toBe(true);
  });

  it('should detect missing agent references in packs', () => {
    const result = validateRegistry({
      skills: [{ id: 'test-skill', name: 'Test Skill', version: '1.0.0', projectTypes: [], stacks: [], description: 'Test' }],
      agents: [],
      packs: [{
        id: 'test-pack',
        name: 'Test Pack',
        projectTypes: ['dashboard-saas'],
        skills: ['test-skill'],
        agents: ['nonexistent-agent'],
        maxSkills: 1,
        maxAgents: 1,
      }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('nonexistent-agent'))).toBe(true);
  });

  it('should warn when pack has no projectTypes', () => {
    const result = validateRegistry({
      skills: [],
      agents: [],
      packs: [{
        id: 'test-pack',
        name: 'Test Pack',
        projectTypes: [],
        skills: [],
        agents: [],
        maxSkills: 3,
        maxAgents: 3,
      }],
    });
    expect(result.warnings.some(w => w.includes('projectTypes'))).toBe(true);
  });

  it('should error when skills exceed maxSkills', () => {
    const result = validateRegistry({
      skills: [
        { id: 's1', name: 'S1', version: '1.0.0', projectTypes: [], stacks: [], description: '' },
        { id: 's2', name: 'S2', version: '1.0.0', projectTypes: [], stacks: [], description: '' },
      ],
      agents: [],
      packs: [{
        id: 'test-pack',
        name: 'Test Pack',
        projectTypes: ['landing-page'],
        skills: ['s1', 's2'],
        agents: [],
        maxSkills: 1,
        maxAgents: 1,
      }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('maxSkills'))).toBe(true);
  });

  it('should return empty warnings and errors for empty registry', () => {
    const result = validateRegistry({ skills: [], agents: [], packs: [] });
    expect(result.valid).toBe(true);
    expect(result.warnings).toEqual([]);
    expect(result.errors).toEqual([]);
  });
});
