import { readFile, safeWriteFile } from './safeFs.js';
import { backupProjectFiles } from './backupProjectFiles.js';
import * as path from 'node:path';

export interface PatchResult {
  filePath: string;
  addedLines: string[];
  dryRun: boolean;
}

export async function generateClaudeMdPatch(
  projectPath: string,
  skills: string[],
  agents: string[],
  dryRun: boolean
): Promise<PatchResult> {
  const claudeMdPath = path.join(projectPath, 'CLAUDE.md');
  const addedLines: string[] = [];

  const sectionHeader = '## Active Skills (managed by claude-skill-router)';

  // Read existing file
  const existingContent = await readFile(claudeMdPath);

  // Build patch section
  const patchLines: string[] = [];
  patchLines.push('');
  patchLines.push(sectionHeader);
  patchLines.push(`> Last updated: ${new Date().toISOString()}`);
  patchLines.push('');

  if (skills.length > 0) {
    patchLines.push('### Skills');
    for (const skill of skills) {
      patchLines.push(`- ${skill}`);
    }
    patchLines.push('');
  }

  if (agents.length > 0) {
    patchLines.push('### Agents');
    for (const agent of agents) {
      patchLines.push(`- ${agent}`);
    }
    patchLines.push('');
  }

  const patch = patchLines.join('\n');

  if (existingContent && existingContent.includes(sectionHeader)) {
    // Replace existing section
    // For MVP, just report what would happen
    addedLines.push('(would update existing skill section)');
  } else {
    addedLines.push(...patchLines.filter(l => l.startsWith('- ')));
  }

  if (!dryRun && existingContent !== null) {
    // Backup before modifying
    await backupProjectFiles(projectPath, ['CLAUDE.md']);

    if (existingContent.includes(sectionHeader)) {
      // Replace existing section
      const startIdx = existingContent.indexOf(sectionHeader);
      const endIdx = existingContent.indexOf('\n## ', startIdx + 1);
      const before = existingContent.substring(0, startIdx);
      const after = endIdx > 0 ? existingContent.substring(endIdx) : '';
      await safeWriteFile(claudeMdPath, before + patch + after, {
        dryRun: false,
        targetProjectPath: projectPath,
      });
    } else {
      // Append
      await safeWriteFile(claudeMdPath, existingContent + patch, {
        dryRun: false,
        targetProjectPath: projectPath,
      });
    }
  }

  return { filePath: claudeMdPath, addedLines, dryRun };
}
