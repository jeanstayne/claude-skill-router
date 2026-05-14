import { describe, it, expect } from 'vitest';
import { scanProjectTool, ScanProjectInputSchema } from '../src/tools/scanProjectTool.js';
import { recommendSkillsTool, RecommendSkillsInputSchema } from '../src/tools/recommendSkillsTool.js';
import { applySkillPackTool, ApplySkillPackInputSchema } from '../src/tools/applySkillPackTool.js';
import { cleanupUnusedSkillsTool, CleanupUnusedSkillsInputSchema } from '../src/tools/cleanupUnusedSkillsTool.js';
import { generateInstructionsTool } from '../src/tools/generateInstructionsTool.js';
import { runAuditTool } from '../src/tools/runAuditTool.js';
import { generateReportTool } from '../src/tools/generateReportTool.js';
import * as path from 'node:path';

const FIXTURES_DIR = path.resolve(import.meta.dirname, '../../../fixtures');
const LP_FIXTURE = path.join(FIXTURES_DIR, 'react-vite-tailwind-lp');

describe('MCP Tools — Schemas', () => {
  it('scan_project: should accept valid input', () => {
    const parsed = ScanProjectInputSchema.parse({ projectPath: '.' });
    expect(parsed.projectPath).toBe('.');
  });

  it('scan_project: should reject missing projectPath', () => {
    expect(() => ScanProjectInputSchema.parse({})).toThrow();
  });

  it('recommend_skills: should accept valid input', () => {
    const parsed = RecommendSkillsInputSchema.parse({
      projectType: 'landing-page',
      framework: 'vite',
      ui: ['tailwind'],
    });
    expect(parsed.projectType).toBe('landing-page');
  });

  it('apply_skill_pack: should default dryRun to true', () => {
    const parsed = ApplySkillPackInputSchema.parse({ projectPath: '.', packId: 'test' });
    expect(parsed.dryRun).toBe(true);
  });

  it('apply_skill_pack: should default confirm to false', () => {
    const parsed = ApplySkillPackInputSchema.parse({ projectPath: '.', packId: 'test' });
    expect(parsed.confirm).toBe(false);
  });

  it('cleanup_unused_skills: should default dryRun to true', () => {
    const parsed = CleanupUnusedSkillsInputSchema.parse({ projectPath: '.' });
    expect(parsed.dryRun).toBe(true);
  });

  it('cleanup_unused_skills: should default confirm to false', () => {
    const parsed = CleanupUnusedSkillsInputSchema.parse({ projectPath: '.' });
    expect(parsed.confirm).toBe(false);
  });
});

describe('MCP Tools — Real Integration', () => {
  it('scan_project: should return real scan for fixture', async () => {
    const result = await scanProjectTool.handler({ projectPath: LP_FIXTURE });
    expect(result.success).toBe(true);
    expect(result.scan).toBeDefined();
    expect(result.scan.framework).toBe('react');
    expect(result.scan.projectType).toBe('landing-page');
  });

  it('scan_project: should handle non-existent path gracefully', async () => {
    const result = await scanProjectTool.handler({ projectPath: '/nonexistent/path' });
    expect(result.success).toBe(true);
    expect(result.scan.framework).toBe('unknown');
  });

  it('recommend_skills: should return real recommendation', async () => {
    const result = await recommendSkillsTool.handler({
      projectType: 'landing-page',
      framework: 'vite',
      ui: ['tailwind'],
    });
    expect(result.success).toBe(true);
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation.recommendedPack).toBe('landing-page');
    expect(result.recommendation.skills.length).toBeGreaterThan(0);
    expect(result.recommendation.agents.length).toBeGreaterThan(0);
  });

  it('recommend_skills: should return low confidence for unknown project', async () => {
    const result = await recommendSkillsTool.handler({
      projectType: 'unknown',
      framework: 'unknown',
      ui: [],
    });
    expect(result.success).toBe(true);
    expect(result.recommendation.confidence).toBeLessThan(0.3);
  });

  it('apply_skill_pack: should run in dry-run mode by default', async () => {
    const result = await applySkillPackTool.handler({
      projectPath: LP_FIXTURE,
      packId: 'landing-page',
    });
    // dryRun defaults to true
    expect(result.dryRun).toBe(true);
    expect(result.filesCreated.length).toBeGreaterThan(0);
  });

  it('apply_skill_pack: should reject real writes without confirm', async () => {
    const result = await applySkillPackTool.handler({
      projectPath: LP_FIXTURE,
      packId: 'landing-page',
      dryRun: false,
      // confirm is not set — should be rejected
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('confirm');
  });

  it('apply_skill_pack: should return error for non-existent pack', async () => {
    const result = await applySkillPackTool.handler({
      projectPath: LP_FIXTURE,
      packId: 'nonexistent-pack',
    });
    expect(result.success).toBe(false);
  });

  it('cleanup_unused_skills: should run in dry-run mode by default', async () => {
    const result = await cleanupUnusedSkillsTool.handler({
      projectPath: LP_FIXTURE,
    });
    expect(result.dryRun).toBe(true);
  });

  it('run_policy_audit: should return audit results', async () => {
    const projectRoot = path.resolve(import.meta.dirname, '../../..');
    const result = await runAuditTool.handler({ projectPath: projectRoot });
    expect(result.success).toBe(true);
    expect(result.passed).toBeDefined();
    expect(result.rulesChecked.length).toBeGreaterThan(0);
  });

  it('generate_report: should return scan report', async () => {
    const result = await generateReportTool.handler({
      projectPath: LP_FIXTURE,
      reportType: 'scan',
    });
    expect(result.success).toBe(true);
    expect(result.reportType).toBe('scan');
    expect(result.scanResult).toBeDefined();
  });

  it('generate_report: should return audit report', async () => {
    const result = await generateReportTool.handler({
      projectPath: LP_FIXTURE,
      reportType: 'audit',
    });
    expect(result.success).toBe(true);
    expect(result.reportType).toBe('audit');
  });

  it('generate_project_instructions: should return patch suggestions', async () => {
    const result = await generateInstructionsTool.handler({
      projectPath: LP_FIXTURE,
      packId: 'landing-page',
    });
    expect(result.success).toBe(true);
    expect(result.skills).toBeDefined();
    expect(result.agents).toBeDefined();
  });

  it('all 7 tools should have valid names', () => {
    const tools = [
      scanProjectTool,
      recommendSkillsTool,
      applySkillPackTool,
      cleanupUnusedSkillsTool,
      generateInstructionsTool,
      runAuditTool,
      generateReportTool,
    ];
    expect(tools.length).toBe(7);
    for (const tool of tools) {
      expect(tool.name).toBeTruthy();
    }
  });
});
