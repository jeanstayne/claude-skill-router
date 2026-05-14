import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface ClaudeConfigResult {
  hasClaudeMd: boolean;
  hasAgentsMd: boolean;
  hasClaudeFolder: boolean;
  skills: string[];
  agents: string[];
}

export async function detectClaudeConfig(projectPath: string): Promise<ClaudeConfigResult> {
  const result: ClaudeConfigResult = {
    hasClaudeMd: false,
    hasAgentsMd: false,
    hasClaudeFolder: false,
    skills: [],
    agents: [],
  };

  // Check CLAUDE.md
  result.hasClaudeMd = await fileExists(path.join(projectPath, 'CLAUDE.md'));

  // Check AGENTS.md
  result.hasAgentsMd = await fileExists(path.join(projectPath, 'AGENTS.md'));

  // Check .claude folder
  const claudePath = path.join(projectPath, '.claude');
  result.hasClaudeFolder = await fileExists(claudePath);

  if (result.hasClaudeFolder) {
    // List skills
    const skillsPath = path.join(claudePath, 'skills');
    if (await fileExists(skillsPath)) {
      try {
        const entries = await fs.readdir(skillsPath, { withFileTypes: true });
        result.skills = entries
          .filter(e => e.isDirectory() && !e.name.startsWith('.'))
          .map(e => e.name);
      } catch {
        // Can't read skills dir
      }
    }

    // List agents
    const agentsPath = path.join(claudePath, 'agents');
    if (await fileExists(agentsPath)) {
      try {
        const entries = await fs.readdir(agentsPath, { withFileTypes: true });
        result.agents = entries
          .filter(e => e.isFile() && e.name.endsWith('.md'))
          .map(e => e.name.replace('.md', ''));
      } catch {
        // Can't read agents dir
      }
    }
  }

  return result;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
