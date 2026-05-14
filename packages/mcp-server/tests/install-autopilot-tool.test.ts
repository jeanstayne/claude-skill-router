import { describe, it, expect } from 'vitest';
import { installAutopilotSkillTool, InstallAutopilotSkillInputSchema } from '../src/tools/installAutopilotSkillTool.js';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';

const TMP_DIR = path.join(os.tmpdir(), `skill-router-mcp-autopilot-test-${Date.now()}`);

async function setupTmpProject() {
  await fs.mkdir(TMP_DIR, { recursive: true });
  await fs.writeFile(path.join(TMP_DIR, 'package.json'), JSON.stringify({
    name: 'mcp-autopilot-test', dependencies: { react: '^18.0.0' },
    devDependencies: { vite: '^5.0.0', tailwindcss: '^3.4.0' },
  }));
}

describe('MCP install_autopilot_skill — Schema', () => {
  it('should accept valid input', () => {
    const parsed = InstallAutopilotSkillInputSchema.parse({
      projectPath: '.',
    });
    expect(parsed.projectPath).toBe('.');
    expect(parsed.dryRun).toBe(true);
    expect(parsed.confirm).toBe(false);
    expect(parsed.scope).toBe('project');
    expect(parsed.withClaudeMd).toBe(false);
  });

  it('should default dryRun to true', () => {
    const parsed = InstallAutopilotSkillInputSchema.parse({ projectPath: '.' });
    expect(parsed.dryRun).toBe(true);
  });

  it('should default confirm to false', () => {
    const parsed = InstallAutopilotSkillInputSchema.parse({ projectPath: '.' });
    expect(parsed.confirm).toBe(false);
  });

  it('should reject missing projectPath', () => {
    expect(() => InstallAutopilotSkillInputSchema.parse({})).toThrow();
  });
});

describe('MCP install_autopilot_skill — Handler', () => {
  it('should have tool metadata', () => {
    expect(installAutopilotSkillTool.name).toBe('install_autopilot_skill');
    expect(installAutopilotSkillTool.description).toContain('skill-router-autopilot');
    expect(installAutopilotSkillTool.inputSchema).toBeDefined();
    expect(typeof installAutopilotSkillTool.handler).toBe('function');
  });

  it('should dry-run without changing disk', async () => {
    await setupTmpProject();
    const result = await installAutopilotSkillTool.handler({
      projectPath: TMP_DIR,
      dryRun: true,
      confirm: false,
    });
    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(true);

    // Verify nothing was written
    const skillPath = path.join(TMP_DIR, '.claude', 'skills', 'skill-router-autopilot', 'SKILL.md');
    let exists = false;
    try { await fs.access(skillPath); exists = true; } catch { /* expected */ }
    expect(exists).toBe(false);

    await fs.rm(TMP_DIR, { recursive: true, force: true });
  });

  it('should block real writes without confirm', async () => {
    await setupTmpProject();
    const result = await installAutopilotSkillTool.handler({
      projectPath: TMP_DIR,
      dryRun: false,
      confirm: false,
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('confirm');

    await fs.rm(TMP_DIR, { recursive: true, force: true });
  });

  it('should block global scope without confirm', async () => {
    const result = await installAutopilotSkillTool.handler({
      projectPath: '/tmp',
      scope: 'global',
      dryRun: false,
      confirm: false,
    });
    expect(result.success).toBe(false);
  });

  it('should install with confirm in tmp', async () => {
    await setupTmpProject();
    const result = await installAutopilotSkillTool.handler({
      projectPath: TMP_DIR,
      dryRun: false,
      confirm: true,
    });
    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(false);
    expect(result.filesCreated.some((f: string) => f.includes('SKILL.md'))).toBe(true);

    // Verify on disk
    const skillPath = path.join(TMP_DIR, '.claude', 'skills', 'skill-router-autopilot', 'SKILL.md');
    const content = await fs.readFile(skillPath, 'utf-8');
    expect(content).toContain('Skill Router Autopilot');

    await fs.rm(TMP_DIR, { recursive: true, force: true });
  });
});
