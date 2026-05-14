import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { scanProject } from '../src/scanner/scanProject.js';
import { recommendSkills } from '../src/recommender/recommendSkills.js';
import { installSkillPack } from '../src/installer/installSkillPack.js';
import { cleanupUnusedSkills } from '../src/installer/cleanupUnusedSkills.js';
import { runPolicyGuard, parsePolicyResults } from '../src/policy/index.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

const REGISTRY_PATH = path.resolve(import.meta.dirname, '../../../registry');
let tempDir: string;

describe('E2E: scan → recommend → apply → cleanup → audit', () => {
  beforeAll(async () => {
    tempDir = path.join(os.tmpdir(), `skill-router-e2e-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    // Create a minimal project
    await fs.writeFile(path.join(tempDir, 'package.json'), JSON.stringify({
      name: 'e2e-test',
      dependencies: { react: '^18.0.0', 'react-dom': '^18.0.0' },
      devDependencies: { vite: '^5.0.0', tailwindcss: '^3.4.0', typescript: '^5.0.0', vitest: '^1.0.0' },
    }));
    await fs.writeFile(path.join(tempDir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true } }));
    await fs.mkdir(path.join(tempDir, 'src', 'sections'), { recursive: true });
    await fs.writeFile(path.join(tempDir, 'src', 'App.tsx'), 'export default function App() { return <div>LP</div>; }');
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('Phase 1: scan project', async () => {
    const scanResult = await scanProject(tempDir);
    expect(scanResult.framework).toBe('react');
    expect(scanResult.projectType).toBe('landing-page');
    expect(scanResult.agentConfig.hasClaudeFolder).toBe(false);
  });

  it('Phase 2: recommend skills based on scan', async () => {
    const scanResult = await scanProject(tempDir);
    const recommendation = await recommendSkills({
      projectType: scanResult.projectType,
      framework: scanResult.framework,
      ui: scanResult.ui,
    }, REGISTRY_PATH);

    expect(recommendation.recommendedPack).toBe('landing-page');
    expect(recommendation.skills.length).toBeGreaterThan(0);
    expect(recommendation.skills.length).toBeLessThanOrEqual(3);
    expect(recommendation.agents.length).toBeLessThanOrEqual(3);
  });

  it('Phase 3: apply pack in dry-run mode', async () => {
    const installResult = await installSkillPack({
      targetProjectPath: tempDir,
      packId: 'landing-page',
      dryRun: true,
      registryPath: REGISTRY_PATH,
    });

    expect(installResult.success).toBe(true);
    expect(installResult.dryRun).toBe(true);
    expect(installResult.filesCreated.length).toBeGreaterThan(0);

    // Verify nothing was actually created
    const claudeDir = path.join(tempDir, '.claude');
    let claudeExists = false;
    try { await fs.access(claudeDir); claudeExists = true; } catch { /* expected */ }
    expect(claudeExists).toBe(false);
  });

  it('Phase 4: apply pack for real', async () => {
    const installResult = await installSkillPack({
      targetProjectPath: tempDir,
      packId: 'landing-page',
      dryRun: false,
      registryPath: REGISTRY_PATH,
    });

    expect(installResult.success).toBe(true);

    // Verify .claude/ was created
    const claudeDir = path.join(tempDir, '.claude');
    await fs.access(claudeDir); // throws if doesn't exist

    // Verify manifest
    const manifestPath = path.join(claudeDir, 'skill-router.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    expect(manifest.managedBy).toBe('claude-skill-router');
    expect(manifest.activePack).toBe('landing-page');
    expect(manifest.activeSkills).toContain('lp-conversion-architect');
    expect(manifest.activeSkills).toContain('brand-visual-director');

    // Verify skills were copied
    const skillsDir = path.join(claudeDir, 'skills');
    const skillDirs = await fs.readdir(skillsDir);
    expect(skillDirs.length).toBeGreaterThan(0);

    // Verify agents were copied
    const agentsDir = path.join(claudeDir, 'agents');
    const agentFiles = await fs.readdir(agentsDir);
    expect(agentFiles.length).toBeGreaterThan(0);
  });

  it('Phase 5: cleanup in dry-run mode', async () => {
    const cleanupResult = await cleanupUnusedSkills({
      targetProjectPath: tempDir,
      dryRun: true,
      keepPackId: 'landing-page',
    });

    expect(cleanupResult.success).toBe(true);
    expect(cleanupResult.dryRun).toBe(true);
    // All current skills are active, so nothing should be flagged for removal
    expect(cleanupResult.filesPreserved.length).toBeGreaterThan(0);
  });

  it('Phase 6: cleanup preserves unmanaged files (dry-run)', async () => {
    // Create a custom skill that is not managed
    const customSkillDir = path.join(tempDir, '.claude', 'skills', 'my-custom-skill');
    await fs.mkdir(customSkillDir, { recursive: true });
    await fs.writeFile(path.join(customSkillDir, 'SKILL.md'), '# Custom Skill');

    const cleanupResult = await cleanupUnusedSkills({
      targetProjectPath: tempDir,
      dryRun: true,
    });

    // Custom skill should be preserved (not managed by skill-router)
    expect(cleanupResult.filesPreserved).toContain('.claude/skills/my-custom-skill');
  });

  it('Phase 7: audit project', async () => {
    const policyResult = await runPolicyGuard(tempDir);
    const parsed = parsePolicyResults(policyResult);
    expect(parsed.summary).toBeDefined();
    expect(policyResult.rulesChecked.length).toBeGreaterThan(0);
  });
});
