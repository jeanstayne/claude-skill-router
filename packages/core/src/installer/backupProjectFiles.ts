import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileExists } from './safeFs.js';

export interface BackupResult {
  backupDir: string;
  filesBackedUp: string[];
  errors: string[];
}

export async function backupProjectFiles(
  projectPath: string,
  files: string[]
): Promise<BackupResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(projectPath, '.claude', 'backups', `backup-${timestamp}`);
  const filesBackedUp: string[] = [];
  const errors: string[] = [];

  await fs.mkdir(backupDir, { recursive: true });

  for (const file of files) {
    const srcPath = path.join(projectPath, file);
    const destPath = path.join(backupDir, file);

    if (await fileExists(srcPath)) {
      try {
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(srcPath, destPath);
        filesBackedUp.push(file);
      } catch (e) {
        errors.push(`Failed to backup ${file}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  return { backupDir, filesBackedUp, errors };
}
