import { describe, it, expect } from 'vitest';
import { classifyIntent } from '../src/router/classifyIntent.js';
import { extractRequestSignals } from '../src/router/extractRequestSignals.js';
import { selectPackForIntent } from '../src/router/selectPackForIntent.js';
import { generateExecutionPlan } from '../src/router/generateExecutionPlan.js';
import { routeRequest } from '../src/router/routeRequest.js';
import * as path from 'node:path';

const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../fixtures');
const LP_FIXTURE = path.join(FIXTURES_DIR, 'react-vite-tailwind-lp');

describe('classifyIntent', () => {
  function sig() { return { visualStyle: [], businessGoal: [], keywords: [], mentionsDesignEngine: [], mentionsStack: [], confidence: 0 }; }

  it('should classify "crie uma LP premium" as create-landing-page', () => {
    const result = classifyIntent({ userRequest: 'crie uma LP premium para a Samar', signals: sig() });
    expect(result.intent).toBe('create-landing-page');
  });

  it('should classify "melhore esse dashboard" as improve-dashboard', () => {
    const result = classifyIntent({ userRequest: 'melhore esse dashboard com novos gráficos', signals: sig() });
    expect(result.intent).toBe('improve-dashboard');
  });

  it('should classify "transforme esse print em layout" as convert-visual-reference-to-code', () => {
    const result = classifyIntent({ userRequest: 'transforme esse print em layout React', signals: sig() });
    expect(result.intent).toBe('convert-visual-reference-to-code');
  });

  it('should classify "faça QA visual" as review-visual-quality', () => {
    const result = classifyIntent({ userRequest: 'faça QA visual dessa página', signals: sig() });
    expect(result.intent).toBe('review-visual-quality');
  });

  it('should classify "crie sitemap do site" as plan-website-structure', () => {
    const result = classifyIntent({ userRequest: 'crie sitemap do site institucional', signals: sig() });
    expect(result.intent).toBe('plan-website-structure');
  });

  it('should classify unknown for vague request', () => {
    const result = classifyIntent({ userRequest: 'melhore isso aqui', signals: sig() });
    expect(result.intent).toBe('unknown');
  });

  it('should classify "crie dashboard" as create-dashboard', () => {
    const result = classifyIntent({ userRequest: 'crie um dashboard novo para vendas', signals: sig() });
    expect(result.intent).toBe('create-dashboard');
  });
});

describe('extractRequestSignals', () => {
  it('should detect Lovable when mentioned', () => {
    const result = extractRequestSignals({ userRequest: 'crie uma LP premium estilo Lovable' });
    expect(result.mentionsDesignEngine).toContain('lovable');
  });

  it('should detect v0 when shadcn/dashboard mentioned', () => {
    const result = extractRequestSignals({ userRequest: 'crie um dashboard estilo v0 com shadcn' });
    expect(result.mentionsDesignEngine).toContain('v0');
  });

  it('should detect premium visual style', () => {
    const result = extractRequestSignals({ userRequest: 'LP premium e sofisticada' });
    expect(result.visualStyle).toContain('premium');
  });

  it('should detect conversion business goal', () => {
    const result = extractRequestSignals({ userRequest: 'LP para vender e converter leads' });
    expect(result.businessGoal).toContain('conversion');
  });

  it('should detect requested output landing-page', () => {
    const result = extractRequestSignals({ userRequest: 'crie uma landing page moderna' });
    expect(result.requestedOutput).toBe('landing-page');
  });

  it('should detect requested output dashboard', () => {
    const result = extractRequestSignals({ userRequest: 'melhore esse dashboard admin' });
    expect(result.requestedOutput).toBe('dashboard');
  });
});

describe('selectPackForIntent', () => {
  const baseInput = { projectType: 'landing-page', framework: 'vite', ui: ['tailwind'], signals: { visualStyle: [], businessGoal: [], keywords: [], mentionsDesignEngine: [], mentionsStack: [], confidence: 0 }, allowAdvanced: true };

  it('should select lovable-premium-lp for premium LP with Lovable', () => {
    const result = selectPackForIntent({
      ...baseInput,
      intent: 'create-landing-page',
      signals: { ...baseInput.signals, visualStyle: ['premium'], mentionsDesignEngine: ['lovable'] },
    });
    expect(result.packId).toBe('lovable-premium-lp');
  });

  it('should select landing-page for standard LP', () => {
    const result = selectPackForIntent({ ...baseInput, intent: 'create-landing-page' });
    expect(result.packId).toBe('landing-page');
  });

  it('should select v0-dashboard-ui for dashboard with v0', () => {
    const result = selectPackForIntent({
      ...baseInput,
      intent: 'create-dashboard',
      signals: { ...baseInput.signals, mentionsDesignEngine: ['v0'] },
    });
    expect(result.packId).toBe('v0-dashboard-ui');
  });

  it('should select relume-website-planning for plan-website-structure', () => {
    const result = selectPackForIntent({ ...baseInput, intent: 'plan-website-structure' });
    expect(result.packId).toBe('relume-website-planning');
  });

  it('should return none for unknown intent', () => {
    const result = selectPackForIntent({ ...baseInput, intent: 'unknown' });
    expect(result.packId).toBe('none');
  });
});

describe('generateExecutionPlan', () => {
  it('should return plan with scan first for create intent', () => {
    const plan = generateExecutionPlan({ intent: 'create-landing-page', selectedPack: 'landing-page', isDryRun: true, requiresConfirm: false });
    expect(plan.length).toBeGreaterThan(0);
    expect(plan[0].id).toBe('scan');
  });

  it('should include apply-confirmed when not dry-run', () => {
    const plan = generateExecutionPlan({ intent: 'create-landing-page', selectedPack: 'landing-page', isDryRun: false, requiresConfirm: true });
    const applyStep = plan.find(s => s.id === 'apply-confirmed');
    expect(applyStep).toBeDefined();
    expect(applyStep!.requiresConfirm).toBe(true);
  });

  it('should return minimal plan for unknown intent', () => {
    const plan = generateExecutionPlan({ intent: 'unknown', selectedPack: 'none', isDryRun: true, requiresConfirm: false });
    expect(plan.length).toBe(2);
    expect(plan[0].id).toBe('analyze');
  });
});

describe('routeRequest', () => {
  it('should return intent and pack for LP request', async () => {
    const result = await routeRequest({
      projectPath: LP_FIXTURE,
      userRequest: 'crie uma LP premium para Samar',
    });
    expect(result.success).toBe(true);
    expect(result.intent).toBe('create-landing-page');
    expect(result.selectedPack).toBeTruthy();
  });

  it('should be dry-run by default', async () => {
    const result = await routeRequest({
      projectPath: LP_FIXTURE,
      userRequest: 'crie uma LP premium',
    });
    expect(result.dryRun).toBe(true);
  });

  it('should block mutation without confirm', async () => {
    const result = await routeRequest({
      projectPath: LP_FIXTURE,
      userRequest: 'crie uma LP',
      dryRun: false,
    });
    expect(result.success).toBe(false);
    expect(result.requiresConfirm).toBe(true);
  });

  it('should handle explicit pack selection', async () => {
    const result = await routeRequest({
      projectPath: LP_FIXTURE,
      userRequest: 'crie uma LP',
      explicitPack: 'landing-page',
    });
    expect(result.selectedPack).toBe('landing-page');
  });

  it('should return execution plan', async () => {
    const result = await routeRequest({
      projectPath: LP_FIXTURE,
      userRequest: 'crie uma LP',
    });
    expect(result.executionPlan.length).toBeGreaterThan(0);
  });

  it('should handle unknown intent conservatively', async () => {
    const result = await routeRequest({
      projectPath: LP_FIXTURE,
      userRequest: 'xpto abc 123',
    });
    expect(result.intent).toBeDefined();
  });
});
