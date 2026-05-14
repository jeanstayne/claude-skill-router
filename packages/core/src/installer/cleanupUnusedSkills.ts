import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileExists, listDir } from './safeFs.js';
import { backupProjectFiles } from './backupProjectFiles.js';

export interface CleanupOptions {
  targetProjectPath: string;
  dryRun: boolean;
  keepPackId?: string; // If provided, only remove skills NOT in this pack
}

export interface CleanupResult {
  success: boolean;
  filesRemoved: string[];
  filesPreserved: string[];
  backups: string[];
  errors: string[];
  dryRun: boolean;
}

export async function cleanupUnusedSkills(options: CleanupOptions): Promise<CleanupResult> {
  const { targetProjectPath, dryRun, keepPackId } = options;
  const filesRemoved: string[] = [];
  const filesPreserved: string[] = [];
  const backups: string[] = [];
  const errors: string[] = [];

  const claudePath = path.join(targetProjectPath, '.claude');
  if (!(await fileExists(claudePath))) {
    return { success: true, filesRemoved, filesPreserved, backups, errors, dryRun };
  }

  // Read manifest to know what's managed
  const manifestPath = path.join(claudePath, 'skill-router.json');
  let managedSkillIds: string[] = [];
  let managedAgentIds: string[] = [];
  let activeSkillIds: string[] = [];
  let activeAgentIds: string[] = [];

  if (await fileExists(manifestPath)) {
    try {
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent);
      // These are what the manifest says are managed by skill-router
      managedSkillIds = manifest.activeSkills || [];
      managedAgentIds = manifest.activeAgents || [];

      // If keepPackId is provided, determine which skills should stay
      if (keepPackId) {
        // Load registry to get the pack's current skills
        const registryDir = path.resolve(import.meta.dirname, '../../../../registry');
        try {
          const packPath = path.join(registryDir, 'packs', `${keepPackId}.json`);
          const packContent = await fs.readFile(packPath, 'utf-8');
          const pack = JSON.parse(packContent);
          activeSkillIds = pack.skills || [];
          activeAgentIds = pack.agents || [];
        } catch {
          // If we can't load the pack, keep all currently managed skills
          activeSkillIds = managedSkillIds;
          activeAgentIds = managedAgentIds;
        }
      } else {
        activeSkillIds = managedSkillIds;
        activeAgentIds = managedAgentIds;
      }
    } catch {
      return {
        success: false,
        filesRemoved: [],
        filesPreserved: [],
        backups: [],
        errors: ['Failed to parse skill-router.json manifest'],
        dryRun,
      };
    }
  } else {
    // No manifest — don't touch anything
    return { success: true, filesRemoved, filesPreserved, backups, errors, dryRun };
  }

  // Process skills directory
  const skillsPath = path.join(claudePath, 'skills');
  if (await fileExists(skillsPath)) {
    const installedSkills = await listDir(skillsPath);

    for (const skillDir of installedSkills) {
      if (!managedSkillIds.includes(skillDir)) {
        // Not managed by skill-router — preserve
        filesPreserved.push(`.claude/skills/${skillDir}`);
        continue;
      }

      if (!activeSkillIds.includes(skillDir)) {
        // This skill was previously managed but is no longer in the active pack
        const skillFullPath = path.join(skillsPath, skillDir);
        const relativePath = `.claude/skills/${skillDir}`;

        if (dryRun) {
          filesRemoved.push(relativePath);
        } else {
          try {
            // Backup before removing
            const backupResult = await backupProjectFiles(targetProjectPath, [relativePath]);
            backups.push(...backupResult.filesBackedUp.map(f => `.claude/backups/${f}`));

            // Remove the skill directory
            await fs.rm(skillFullPath, { recursive: true, force: true });
            filesRemoved.push(relativePath);
          } catch (e) {
            errors.push(`Failed to remove ${relativePath}: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      } else {
        // Managed and active — keep
        filesPreserved.push(`.claude/skills/${skillDir}`);
      }
    }
  }

  // Process agents directory
  const agentsPath = path.join(claudePath, 'agents');
  if (await fileExists(agentsPath)) {
    const installedAgents = await listDir(agentsPath);

    for (const agentFile of installedAgents) {
      const agentId = agentFile.replace('.md', '');
      if (!managedAgentIds.includes(agentId)) {
        // Not managed by skill-router — preserve
        filesPreserved.push(`.claude/agents/${agentFile}`);
        continue;
      }

      if (!activeAgentIds.includes(agentId)) {
        // Was managed but no longer active
        const agentFullPath = path.join(agentsPath, agentFile);
        const relativePath = `.claude/agents/${agentFile}`;

        if (dryRun) {
          filesRemoved.push(relativePath);
        } else {
          try {
            const backupResult = await backupProjectFiles(targetProjectPath, [relativePath]);
            backups.push(...backupResult.filesBackedUp.map(f => `.claude/backups/${f}`));

            await fs.unlink(agentFullPath);
            filesRemoved.push(relativePath);
          } catch (e) {
            errors.push(`Failed to remove ${relativePath}: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      } else {
        filesPreserved.push(`.claude/agents/${agentFile}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    filesRemoved,
    filesPreserved,
    backups,
    errors,
    dryRun,
  };
}
