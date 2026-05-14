import * as path from 'node:path';
import { readFile } from './safeFs.js';

export const CLAUDE_MD_SNIPPET_MARKER_START = '<!-- SKILL_ROUTER_AUTOPILOT_START -->';
export const CLAUDE_MD_SNIPPET_MARKER_END = '<!-- SKILL_ROUTER_AUTOPILOT_END -->';

export function buildClaudeMdSnippet(): string {
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

export interface SnippetStatus {
  exists: boolean;
  isManaged: boolean;
  snippet: string;
  claudeMdPath: string;
}

export async function checkClaudeMdSnippet(projectPath: string): Promise<SnippetStatus> {
  const claudeMdPath = path.join(projectPath, 'CLAUDE.md');
  const content = await readFile(claudeMdPath);
  const snippet = buildClaudeMdSnippet();

  if (content === null) {
    return { exists: false, isManaged: false, snippet, claudeMdPath };
  }

  const hasBlock = content.includes(CLAUDE_MD_SNIPPET_MARKER_START) &&
                   content.includes(CLAUDE_MD_SNIPPET_MARKER_END);

  return { exists: true, isManaged: hasBlock, snippet, claudeMdPath };
}
