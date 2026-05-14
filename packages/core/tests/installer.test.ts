import { describe, it, expect } from 'vitest';
import { installSkillPack } from '../src/installer/installSkillPack.js';
import { cleanupUnusedSkills } from '../src/installer/cleanupUnusedSkills.js';
import { backupProjectFiles } from '../src/installer/backupProjectFiles.js';
import { ensureDir, safeWriteFile, fileExists } from '../src/installer/safeFs.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

const REGISTRY_PATH = path.resolve(import.meta.dirname, '../../../registry');

describe('safeFs', () => {
  it('should ensureDir creates directory', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-${Date.now()}`);
    const subDir = path.join(tmpDir, 'subdir');

    await ensureDir(subDir, { dryRun: false, targetProjectPath: tmpDir });

    const exists = await fileExists(subDir);
    expect(exists).toBe(true);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should not create directory in dry-run mode', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-dry-${Date.now()}`);
    const subDir = path.join(tmpDir, 'subdir');

    await ensureDir(subDir, { dryRun: true, targetProjectPath: tmpDir });

    const exists = await fileExists(subDir);
    expect(exists).toBe(false);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should write file', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-write-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, 'test.txt');

    await safeWriteFile(filePath, 'hello', { dryRun: false, targetProjectPath: tmpDir });

    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toBe('hello');

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should not write file in dry-run mode', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-dry-write-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, 'test.txt');

    await safeWriteFile(filePath, 'hello', { dryRun: true, targetProjectPath: tmpDir });

    const exists = await fileExists(filePath);
    expect(exists).toBe(false);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should throw when writing outside project workspace', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-sec-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });
    const outsidePath = path.join(os.tmpdir(), `skill-router-test-other-${Date.now()}`);

    await expect(
      safeWriteFile(outsidePath, 'data', { dryRun: false, targetProjectPath: tmpDir })
    ).rejects.toThrow('SECURITY');

    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});

describe('backupProjectFiles', () => {
  it('should backup existing files', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-backup-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(path.join(tmpDir, 'test.txt'), 'original content');

    const result = await backupProjectFiles(tmpDir, ['test.txt']);

    expect(result.filesBackedUp).toContain('test.txt');
    expect(result.backupDir).toMatch(/backup-/);

    // Verify backup exists
    const backupFile = path.join(result.backupDir, 'test.txt');
    const content = await fs.readFile(backupFile, 'utf-8');
    expect(content).toBe('original content');

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should handle non-existent files gracefully', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-backup2-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });

    const result = await backupProjectFiles(tmpDir, ['nonexistent.txt']);

    expect(result.filesBackedUp).toEqual([]);
    expect(result.errors).toEqual([]);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});

describe('installSkillPack', () => {
  it('should install landing-page pack in dry-run mode', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-install-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });

    const result = await installSkillPack({
      targetProjectPath: tmpDir,
      packId: 'landing-page',
      dryRun: true,
      registryPath: REGISTRY_PATH,
    });

    expect(result.dryRun).toBe(true);
    expect(result.success).toBe(true);
    expect(result.filesCreated.length).toBeGreaterThan(0);
    expect(result.filesCreated.some(f => f.includes('.claude/skills/'))).toBe(true);
    expect(result.filesCreated.some(f => f.includes('.claude/agents/'))).toBe(true);
    expect(result.filesCreated.some(f => f.includes('skill-router.json'))).toBe(true);

    // Verify nothing was actually created
    const claudeDir = path.join(tmpDir, '.claude');
    const claudeExists = await fileExists(claudeDir);
    expect(claudeExists).toBe(false);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should create files in non-dry-run mode', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-install2-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });

    const result = await installSkillPack({
      targetProjectPath: tmpDir,
      packId: 'landing-page',
      dryRun: false,
      registryPath: REGISTRY_PATH,
    });

    expect(result.success).toBe(true);

    // Check .claude directory was created
    const claudeDir = path.join(tmpDir, '.claude');
    expect(await fileExists(claudeDir)).toBe(true);

    // Check manifest
    const manifestPath = path.join(claudeDir, 'skill-router.json');
    expect(await fileExists(manifestPath)).toBe(true);
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    expect(manifest.managedBy).toBe('claude-skill-router');
    expect(manifest.activePack).toBe('landing-page');

    // Check skills directory
    const skillsDir = path.join(claudeDir, 'skills');
    expect(await fileExists(skillsDir)).toBe(true);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should return error for non-existent pack', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-install3-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });

    const result = await installSkillPack({
      targetProjectPath: tmpDir,
      packId: 'nonexistent-pack',
      dryRun: true,
      registryPath: REGISTRY_PATH,
    });

    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.includes('not found'))).toBe(true);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should return error for non-existent target path', async () => {
    const result = await installSkillPack({
      targetProjectPath: '/path/that/does/not/exist',
      packId: 'landing-page',
      dryRun: true,
      registryPath: REGISTRY_PATH,
    });

    expect(result.success).toBe(false);
  });
});

describe('cleanupUnusedSkills', () => {
  it('should not remove files without manifest', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-cleanup-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });

    const result = await cleanupUnusedSkills({
      targetProjectPath: tmpDir,
      dryRun: true,
    });

    expect(result.success).toBe(true);
    expect(result.filesRemoved).toEqual([]);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should handle non-existent .claude directory', async () => {
    const tmpDir = path.join(os.tmpdir(), `skill-router-test-cleanup2-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });

    const result = await cleanupUnusedSkills({
      targetProjectPath: tmpDir,
      dryRun: false,
    });

    expect(result.success).toBe(true);
    expect(result.filesRemoved).toEqual([]);

    await fs.rm(tmpDir, { recursive: true, force: true });
  });
});
