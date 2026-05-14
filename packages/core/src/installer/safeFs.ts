import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface FsOptions {
  dryRun: boolean;
  targetProjectPath: string;
}

export interface FsOperation {
  type: 'mkdir' | 'write' | 'copy';
  target: string;
  content?: string;
  source?: string;
}

export interface DryRunResult {
  operations: FsOperation[];
  dryRun: true;
}

function validatePath(targetPath: string, projectPath: string): void {
  const resolved = path.resolve(targetPath);
  const projectRoot = path.resolve(projectPath);

  if (!resolved.startsWith(projectRoot + path.sep) && resolved !== projectRoot) {
    throw new Error(
      `SECURITY: Cannot write outside project workspace. ` +
      `Target: ${resolved}, Workspace: ${projectRoot}`
    );
  }
}

export async function ensureDir(dirPath: string, options: FsOptions): Promise<void> {
  validatePath(dirPath, options.targetProjectPath);

  if (options.dryRun) {
    return;
  }

  await fs.mkdir(dirPath, { recursive: true });
}

export async function safeWriteFile(
  filePath: string,
  content: string,
  options: FsOptions
): Promise<void> {
  validatePath(filePath, options.targetProjectPath);

  if (options.dryRun) {
    return;
  }

  await ensureDir(path.dirname(filePath), options);
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function safeCopyFile(
  src: string,
  dest: string,
  options: FsOptions
): Promise<void> {
  validatePath(dest, options.targetProjectPath);

  if (options.dryRun) {
    return;
  }

  await ensureDir(path.dirname(dest), options);
  await fs.copyFile(src, dest);
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function listDir(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.map(e => e.name);
  } catch {
    return [];
  }
}

export async function readFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}
