import * as path from 'node:path';
import { ensureDir, safeWriteFile, fileExists, readFile } from './safeFs.js';
import { backupProjectFiles } from './backupProjectFiles.js';

export interface InstallAutopilotOptions {
  targetProjectPath: string;
  scope: 'project' | 'global';
  dryRun: boolean;
  confirm: boolean;
  withClaudeMd?: boolean;
}

export interface InstallAutopilotResult {
  success: boolean;
  filesCreated: string[];
  filesBackedUp: string[];
  filesSkipped: string[];
  claudeMdPatch?: string;
  errors: string[];
  dryRun: boolean;
  scope: 'project' | 'global';
}

function getRegistryPath(): string {
  const dirname = import.meta.dirname;
  return path.resolve(dirname, '../../../../registry');
}

function getTemplatesPath(): string {
  const dirname = import.meta.dirname;
  return path.resolve(dirname, '../../../../templates');
}

async function getSkillContent(): Promise<string> {
  const templatesPath = getTemplatesPath();
  const skillPath = path.join(templatesPath, 'claude-skills', 'skill-router-autopilot', 'SKILL.md');
  try {
    const content = await readFile(skillPath);
    if (content) return content;
  } catch { /* fallback */ }

  // Fallback: read from registry
  const registryPath = getRegistryPath();
  const registrySkillPath = path.join(registryPath, 'skills', 'skill-router-autopilot', 'SKILL.md');
  const registryContent = await readFile(registrySkillPath);
  return registryContent || '';
}

async function getReadmeContent(): Promise<string> {
  const templatesPath = getTemplatesPath();
  const readmePath = path.join(templatesPath, 'claude-skills', 'skill-router-autopilot', 'README.md');
  const content = await readFile(readmePath);
  return content || '';
}

const CLAUDE_MD_SNIPPET_MARKER_START = '<!-- SKILL_ROUTER_AUTOPILOT_START -->';
const CLAUDE_MD_SNIPPET_MARKER_END = '<!-- SKILL_ROUTER_AUTOPILOT_END -->';

function buildClaudeMdSnippet(): string {
  return [
    CLAUDE_MD_SNIPPET_MARKER_START,
    '## Skill Router Autopilot',
    '',
    'Antes de qualquer tarefa relacionada a landing pages, sites, dashboards, UI, design system, revisão visual, copy de conversão ou referências como Lovable, Stitch, v0, Framer, Relume, Figma ou Webflow, use o MCP `claude-skill-router`.',
    '',
    'Fluxo obrigatório:',
    '',
    '1. Chame `route_request` com o pedido bruto do usuário.',
    '2. Chame `prepare_project_for_request` em `dryRun: true`.',
    '3. Mostre o plano ao usuário.',
    '4. Só aplique com `dryRun: false` se houver confirmação explícita.',
    '5. Depois implemente usando as skills recomendadas.',
    CLAUDE_MD_SNIPPET_MARKER_END,
  ].join('\n');
}

export async function installAutopilot(
  options: InstallAutopilotOptions
): Promise<InstallAutopilotResult> {
  const { targetProjectPath, scope, dryRun, confirm, withClaudeMd } = options;
  const filesCreated: string[] = [];
  const filesBackedUp: string[] = [];
  const filesSkipped: string[] = [];
  const errors: string[] = [];

  // Block real writes without confirmation
  if (!dryRun && !confirm) {
    return {
      success: false,
      filesCreated: [],
      filesBackedUp: [],
      filesSkipped: [],
      errors: ['Real writes require --confirm flag. Use --dry-run first to preview.'],
      dryRun,
      scope,
    };
  }

  // Block global scope without confirmation
  if (scope === 'global' && !dryRun && !confirm) {
    return {
      success: false,
      filesCreated: [],
      filesBackedUp: [],
      filesSkipped: [],
      errors: ['Global installation requires explicit --confirm. This affects ~/.claude/skills/.'],
      dryRun,
      scope,
    };
  }

  // Determine target skills directory
  const skillsTargetDir = scope === 'project'
    ? path.join(targetProjectPath, '.claude', 'skills', 'skill-router-autopilot')
    : path.join(
        process.env.HOME || process.env.USERPROFILE || '~',
        '.claude', 'skills', 'skill-router-autopilot'
      );

  // Validate target exists for project scope
  if (scope === 'project') {
    const targetExists = await fileExists(targetProjectPath);
    if (!targetExists) {
      return {
        success: false,
        filesCreated: [],
        filesBackedUp: [],
        filesSkipped: [],
        errors: ['Target project path does not exist'],
        dryRun,
        scope,
      };
    }
  }

  // Check if skill already exists
  const existingSkillPath = path.join(skillsTargetDir, 'SKILL.md');
  const existingSkill = await readFile(existingSkillPath);

  if (existingSkill !== null) {
    // Compare with new content
    const newContent = await getSkillContent();
    if (existingSkill.trim() === newContent.trim()) {
      filesSkipped.push(`${scope === 'project' ? '.claude' : '~/.claude'}/skills/skill-router-autopilot/SKILL.md (already up to date)`);
    } else {
      // Backup existing before overwrite
      if (!dryRun) {
        const backupPath = existingSkillPath + '.backup';
        await safeWriteFile(backupPath, existingSkill, { dryRun: false, targetProjectPath: scope === 'project' ? targetProjectPath : skillsTargetDir });
        filesBackedUp.push(`${scope === 'project' ? '.claude' : '~/.claude'}/skills/skill-router-autopilot/SKILL.md.backup`);
      }
      filesCreated.push(`${scope === 'project' ? '.claude' : '~/.claude'}/skills/skill-router-autopilot/SKILL.md (updated)`);
    }
  } else {
    filesCreated.push(`${scope === 'project' ? '.claude' : '~/.claude'}/skills/skill-router-autopilot/SKILL.md`);
  }

  const existingReadmePath = path.join(skillsTargetDir, 'README.md');
  const existingReadme = await readFile(existingReadmePath);
  if (existingReadme === null) {
    filesCreated.push(`${scope === 'project' ? '.claude' : '~/.claude'}/skills/skill-router-autopilot/README.md`);
  }

  // Actually write files if not dry-run
  if (!dryRun) {
    await ensureDir(skillsTargetDir, { dryRun: false, targetProjectPath: scope === 'project' ? targetProjectPath : skillsTargetDir });
    const skillContent = await getSkillContent();
    await safeWriteFile(existingSkillPath, skillContent, {
      dryRun: false,
      targetProjectPath: scope === 'project' ? targetProjectPath : skillsTargetDir,
    });

    const readmeContent = await getReadmeContent();
    if (readmeContent && existingReadme === null) {
      await safeWriteFile(existingReadmePath, readmeContent, {
        dryRun: false,
        targetProjectPath: scope === 'project' ? targetProjectPath : skillsTargetDir,
      });
    }
  }

  // Handle CLAUDE.md snippet
  let claudeMdPatch: string | undefined;
  if (withClaudeMd) {
    const claudeMdPath = path.join(targetProjectPath, 'CLAUDE.md');
    const existingClaudeMd = await readFile(claudeMdPath);
    const snippet = buildClaudeMdSnippet();

    if (existingClaudeMd !== null && existingClaudeMd.includes(CLAUDE_MD_SNIPPET_MARKER_START)) {
      // Block is already present — would update
      const startIdx = existingClaudeMd.indexOf(CLAUDE_MD_SNIPPET_MARKER_START);
      const endIdx = existingClaudeMd.indexOf(CLAUDE_MD_SNIPPET_MARKER_END, startIdx);
      if (endIdx > 0) {
        const newClaudeMd = existingClaudeMd.substring(0, startIdx) + snippet + existingClaudeMd.substring(endIdx + CLAUDE_MD_SNIPPET_MARKER_END.length);
        claudeMdPatch = `Would update existing Skill Router Autopilot block in CLAUDE.md`;
        if (!dryRun) {
          await backupProjectFiles(targetProjectPath, ['CLAUDE.md']);
          await safeWriteFile(claudeMdPath, newClaudeMd, { dryRun: false, targetProjectPath });
          filesBackedUp.push('CLAUDE.md.backup');
        }
      }
    } else if (existingClaudeMd !== null) {
      // Append snippet
      claudeMdPatch = `Would add Skill Router Autopilot block to CLAUDE.md`;
      if (!dryRun) {
        await backupProjectFiles(targetProjectPath, ['CLAUDE.md']);
        await safeWriteFile(claudeMdPath, existingClaudeMd + '\n\n' + snippet + '\n', {
          dryRun: false,
          targetProjectPath,
        });
        filesBackedUp.push('CLAUDE.md.backup');
      }
    } else {
      // CLAUDE.md doesn't exist
      claudeMdPatch = `Would create CLAUDE.md with Skill Router Autopilot block`;
      if (!dryRun) {
        await safeWriteFile(claudeMdPath, snippet + '\n', { dryRun: false, targetProjectPath });
        filesCreated.push('CLAUDE.md');
      }
    }
  }

  const isSuccess = errors.length === 0;

  return {
    success: isSuccess,
    filesCreated,
    filesBackedUp,
    filesSkipped,
    claudeMdPatch,
    errors,
    dryRun,
    scope,
  };
}
