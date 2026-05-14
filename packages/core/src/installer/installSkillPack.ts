import * as path from 'node:path';
import { ensureDir, safeWriteFile, safeCopyFile, fileExists } from './safeFs.js';
import { backupProjectFiles } from './backupProjectFiles.js';
import { loadRegistry } from '../registry/loadRegistry.js';

export interface InstallOptions {
  targetProjectPath: string;
  packId: string;
  dryRun: boolean;
  registryPath?: string;
}

export interface InstallResult {
  success: boolean;
  filesCreated: string[];
  filesBackedUp: string[];
  manifest: Record<string, unknown> | null;
  errors: string[];
  dryRun: boolean;
}

function getRegistryPath(): string {
  const dirname = import.meta.dirname;
  return path.resolve(dirname, '../../../../registry');
}

export async function installSkillPack(options: InstallOptions): Promise<InstallResult> {
  const { targetProjectPath, packId, dryRun } = options;
  const filesCreated: string[] = [];
  const filesBackedUp: string[] = [];
  const errors: string[] = [];

  // Validate target exists
  const targetExists = await fileExists(targetProjectPath);
  if (!targetExists) {
    return {
      success: false,
      filesCreated: [],
      filesBackedUp: [],
      manifest: null,
      errors: ['Target project path does not exist'],
      dryRun,
    };
  }

  // Load registry
  const registryPath = options.registryPath || getRegistryPath();
  let registry;
  try {
    registry = await loadRegistry(registryPath);
  } catch {
    return {
      success: false,
      filesCreated: [],
      filesBackedUp: [],
      manifest: null,
      errors: ['Failed to load registry'],
      dryRun,
    };
  }

  // Find pack
  const pack = registry.packs.find(p => p.id === packId);
  if (!pack) {
    return {
      success: false,
      filesCreated: [],
      filesBackedUp: [],
      manifest: null,
      errors: [`Pack "${packId}" not found in registry`],
      dryRun,
    };
  }

  // Determine files to be created/overwritten
  const claudeDir = path.join(targetProjectPath, '.claude');
  const skillsDir = path.join(claudeDir, 'skills');
  const agentsDir = path.join(claudeDir, 'agents');
  const promptsDir = path.join(claudeDir, 'prompts');
  const manifestPath = path.join(claudeDir, 'skill-router.json');

  const filesToPotentiallyOverwrite: string[] = ['.claude/skill-router.json'];

  // Backup existing files before modification
  if (!dryRun) {
    const backupResult = await backupProjectFiles(targetProjectPath, filesToPotentiallyOverwrite);
    filesBackedUp.push(...backupResult.filesBackedUp);
    if (backupResult.errors.length > 0) {
      errors.push(...backupResult.errors);
    }
  }

  // Create directories
  if (dryRun) {
    filesCreated.push('.claude/');
    filesCreated.push('.claude/skills/');
    filesCreated.push('.claude/agents/');
    filesCreated.push('.claude/prompts/');
  } else {
    await ensureDir(claudeDir, { dryRun: false, targetProjectPath });
    await ensureDir(skillsDir, { dryRun: false, targetProjectPath });
    await ensureDir(agentsDir, { dryRun: false, targetProjectPath });
    await ensureDir(promptsDir, { dryRun: false, targetProjectPath });
    filesCreated.push('.claude/');
    filesCreated.push('.claude/skills/');
    filesCreated.push('.claude/agents/');
    filesCreated.push('.claude/prompts/');
  }

  // Copy skills
  for (const skillId of pack.skills) {
    const skillMeta = registry.skills.find(s => s.id === skillId);
    if (!skillMeta) continue;

    const skillDestDir = path.join(skillsDir, skillId);
    const skillSrcDir = path.join(registryPath, 'skills', skillId);

    if (dryRun) {
      filesCreated.push(`.claude/skills/${skillId}/SKILL.md`);
      filesCreated.push(`.claude/skills/${skillId}/metadata.json`);
    } else {
      await ensureDir(skillDestDir, { dryRun: false, targetProjectPath });

      // Copy SKILL.md
      const skillMdSrc = path.join(skillSrcDir, 'SKILL.md');
      if (await fileExists(skillMdSrc)) {
        await safeCopyFile(skillMdSrc, path.join(skillDestDir, 'SKILL.md'), {
          dryRun: false,
          targetProjectPath,
        });
        filesCreated.push(`.claude/skills/${skillId}/SKILL.md`);
      }

      // Copy metadata.json
      const metaSrc = path.join(skillSrcDir, 'metadata.json');
      if (await fileExists(metaSrc)) {
        await safeCopyFile(metaSrc, path.join(skillDestDir, 'metadata.json'), {
          dryRun: false,
          targetProjectPath,
        });
        filesCreated.push(`.claude/skills/${skillId}/metadata.json`);
      }
    }
  }

  // Copy agents
  for (const agentId of pack.agents) {
    const agentData = registry.agents.find(a => a.id === agentId);
    if (!agentData) continue;

    const agentDest = path.join(agentsDir, `${agentId}.md`);
    const agentSrc = agentData.filePath;

    if (dryRun) {
      filesCreated.push(`.claude/agents/${agentId}.md`);
    } else if (await fileExists(agentSrc)) {
      await safeCopyFile(agentSrc, agentDest, { dryRun: false, targetProjectPath });
      filesCreated.push(`.claude/agents/${agentId}.md`);
    }
  }

  // Generate manifest
  const manifest = {
    managedBy: 'claude-skill-router',
    version: '1.0.0',
    projectType: pack.projectTypes[0] || 'unknown',
    activePack: packId,
    activeSkills: pack.skills,
    activeAgents: pack.agents,
    lastScan: new Date().toISOString(),
  };

  if (dryRun) {
    filesCreated.push('.claude/skill-router.json');
  } else {
    await safeWriteFile(manifestPath, JSON.stringify(manifest, null, 2), {
      dryRun: false,
      targetProjectPath,
    });
    filesCreated.push('.claude/skill-router.json');
  }

  return {
    success: errors.filter(e => e.includes('Failed to backup')).length === 0,
    filesCreated,
    filesBackedUp,
    manifest,
    errors,
    dryRun,
  };
}
