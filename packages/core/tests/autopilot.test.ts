import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { installAutopilot } from '../src/installer/installAutopilot.js';
import { buildClaudeMdSnippet, checkClaudeMdSnippet } from '../src/installer/generateAutopilotClaudeMdSnippet.js';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';

const TMP_DIR = path.join(os.tmpdir(), `skill-router-autopilot-test-${Date.now()}`);

beforeAll(async () => {
  await fs.mkdir(TMP_DIR, { recursive: true });
  await fs.writeFile(path.join(TMP_DIR, 'package.json'), JSON.stringify({
    name: 'autopilot-test', dependencies: { react: '^18.0.0' },
    devDependencies: { vite: '^5.0.0', tailwindcss: '^3.4.0' },
  }));
});

afterAll(async () => {
  await fs.rm(TMP_DIR, { recursive: true, force: true });
});

describe('installAutopilot — Core', () => {
  it('should generate autopilot skill content from templates', async () => {
    const result = await installAutopilot({
      targetProjectPath: TMP_DIR,
      scope: 'project',
      dryRun: true,
      confirm: false,
    });
    expect(result.success).toBe(true);
    expect(result.filesCreated.some(f => f.includes('SKILL.md'))).toBe(true);
  });

  it('should install in project with dry-run without changing disk', async () => {
    const result = await installAutopilot({
      targetProjectPath: TMP_DIR,
      scope: 'project',
      dryRun: true,
      confirm: false,
    });
    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(true);

    // Verify no files were actually created
    const skillPath = path.join(TMP_DIR, '.claude', 'skills', 'skill-router-autopilot', 'SKILL.md');
    let exists = false;
    try { await fs.access(skillPath); exists = true; } catch { /* expected */ }
    expect(exists).toBe(false);
  });

  it('should install in project with confirm', async () => {
    const result = await installAutopilot({
      targetProjectPath: TMP_DIR,
      scope: 'project',
      dryRun: false,
      confirm: true,
    });
    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(false);
    expect(result.filesCreated.some(f => f.includes('SKILL.md'))).toBe(true);

    // Verify file was actually created
    const skillPath = path.join(TMP_DIR, '.claude', 'skills', 'skill-router-autopilot', 'SKILL.md');
    const content = await fs.readFile(skillPath, 'utf-8');
    expect(content).toContain('Skill Router Autopilot');
    expect(content).toContain('route_request');
    expect(content).toContain('prepare_project_for_request');
    expect(content).toContain('dryRun: true');
  });

  it('should create .claude/skills/skill-router-autopilot/SKILL.md', async () => {
    const skillPath = path.join(TMP_DIR, '.claude', 'skills', 'skill-router-autopilot', 'SKILL.md');
    const content = await fs.readFile(skillPath, 'utf-8');
    expect(content).toContain('Skill Router Autopilot');
    expect(content).toContain('route_request');
  });

  it('should preserve existing skill with backup', async () => {
    // First, modify the existing SKILL.md
    const skillPath = path.join(TMP_DIR, '.claude', 'skills', 'skill-router-autopilot', 'SKILL.md');
    await fs.writeFile(skillPath, 'modified content', 'utf-8');

    // Now install again with confirm
    const result = await installAutopilot({
      targetProjectPath: TMP_DIR,
      scope: 'project',
      dryRun: false,
      confirm: true,
    });
    expect(result.success).toBe(true);
    expect(result.filesBackedUp.some(f => f.includes('backup'))).toBe(true);

    // Verify backup file exists
    const backupPath = skillPath + '.backup';
    const backupContent = await fs.readFile(backupPath, 'utf-8');
    expect(backupContent).toBe('modified content');

    // Verify the skill was updated
    const newContent = await fs.readFile(skillPath, 'utf-8');
    expect(newContent).toContain('Skill Router Autopilot');
  });

  it('should block real writes without confirm', async () => {
    const result = await installAutopilot({
      targetProjectPath: TMP_DIR,
      scope: 'project',
      dryRun: false,
      confirm: false,
    });
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.includes('confirm'))).toBe(true);
  });

  it('should block global scope without confirm', async () => {
    const result = await installAutopilot({
      targetProjectPath: TMP_DIR,
      scope: 'global',
      dryRun: false,
      confirm: false,
    });
    expect(result.success).toBe(false);
  });

  it('should fail for non-existent project path', async () => {
    const result = await installAutopilot({
      targetProjectPath: path.join(TMP_DIR, 'nonexistent'),
      scope: 'project',
      dryRun: true,
      confirm: false,
    });
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.includes('does not exist'))).toBe(true);
  });
});

describe('generateAutopilotClaudeMdSnippet', () => {
  it('should generate snippet with managed markers', () => {
    const snippet = buildClaudeMdSnippet();
    expect(snippet).toContain('<!-- SKILL_ROUTER_AUTOPILOT_START -->');
    expect(snippet).toContain('<!-- SKILL_ROUTER_AUTOPILOT_END -->');
    expect(snippet).toContain('route_request');
    expect(snippet).toContain('prepare_project_for_request');
    expect(snippet).toContain('dryRun: true');
  });

  it('should detect non-existent CLAUDE.md', async () => {
    const status = await checkClaudeMdSnippet(path.join(TMP_DIR, 'noclaude'));
    expect(status.exists).toBe(false);
    expect(status.isManaged).toBe(false);
  });

  it('should detect existing CLAUDE.md without managed block', async () => {
    const testDir = path.join(TMP_DIR, 'test-claude-md');
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(path.join(testDir, 'CLAUDE.md'), '# My Project\n\nSome content', 'utf-8');

    const status = await checkClaudeMdSnippet(testDir);
    expect(status.exists).toBe(true);
    expect(status.isManaged).toBe(false);

    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should detect existing managed block in CLAUDE.md', async () => {
    const testDir = path.join(TMP_DIR, 'test-claude-md-managed');
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(path.join(testDir, 'CLAUDE.md'), buildClaudeMdSnippet(), 'utf-8');

    const status = await checkClaudeMdSnippet(testDir);
    expect(status.exists).toBe(true);
    expect(status.isManaged).toBe(true);

    await fs.rm(testDir, { recursive: true, force: true });
  });
});

describe('installAutopilot with CLAUDE.md', () => {
  it('should generate claudeMdPatch in dry-run', async () => {
    const testDir = path.join(TMP_DIR, 'test-with-claude-md');
    await fs.mkdir(testDir, { recursive: true });

    const result = await installAutopilot({
      targetProjectPath: testDir,
      scope: 'project',
      dryRun: true,
      confirm: false,
      withClaudeMd: true,
    });
    expect(result.success).toBe(true);
    expect(result.claudeMdPatch).toBeDefined();
    expect(result.claudeMdPatch).toContain('CLAUDE.md');

    // Verify CLAUDE.md was NOT created (dry-run)
    const claudeMdPath = path.join(testDir, 'CLAUDE.md');
    let exists = false;
    try { await fs.access(claudeMdPath); exists = true; } catch { /* expected */ }
    expect(exists).toBe(false);

    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should not alter CLAUDE.md in dry-run', async () => {
    const testDir = path.join(TMP_DIR, 'test-noclobber');
    await fs.mkdir(testDir, { recursive: true });
    const originalContent = '# Original\n';
    await fs.writeFile(path.join(testDir, 'CLAUDE.md'), originalContent, 'utf-8');

    await installAutopilot({
      targetProjectPath: testDir,
      scope: 'project',
      dryRun: true,
      confirm: false,
      withClaudeMd: true,
    });

    const content = await fs.readFile(path.join(testDir, 'CLAUDE.md'), 'utf-8');
    expect(content).toBe(originalContent);

    await fs.rm(testDir, { recursive: true, force: true });
  });
});
