#!/usr/bin/env node
// Runtime check script for MCP Server handlers
// Simulates the 10 MCP tools locally without Claude Code

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '../../..');
const FIXTURE = path.join(PROJECT_ROOT, 'fixtures', 'react-vite-tailwind-lp');
const TMP_DIR = path.join(os.tmpdir(), `skill-router-runtime-${Date.now()}`);

async function main() {
  console.log('=== Claude Skill Router — MCP Runtime Check ===\n');

  let passed = 0;
  let failed = 0;

  function check(name: string, ok: boolean, detail?: string) {
    if (ok) {
      console.log(`  [PASS] ${name}`);
      passed++;
    } else {
      console.log(`  [FAIL] ${name}${detail ? ': ' + detail : ''}`);
      failed++;
    }
  }

  // 1. scan_project
  console.log('1. scan_project');
  const { scanProjectTool } = await import('../src/tools/scanProjectTool.js');
  const scanResult = await scanProjectTool.handler({ projectPath: FIXTURE });
  check('returns success', scanResult.success === true);
  check('detects framework=react', scanResult.scan?.framework === 'react');
  check('detects projectType=landing-page', scanResult.scan?.projectType === 'landing-page');
  console.log('');

  // 2. recommend_skills
  console.log('2. recommend_skills');
  const { recommendSkillsTool } = await import('../src/tools/recommendSkillsTool.js');
  const recResult = await recommendSkillsTool.handler({
    projectType: 'landing-page',
    framework: 'react',
    ui: ['tailwind'],
  });
  check('returns success', recResult.success === true);
  check('recommends landing-page pack', recResult.recommendation?.recommendedPack === 'landing-page');
  check('has skills', (recResult.recommendation?.skills?.length || 0) > 0);
  check('has agents', (recResult.recommendation?.agents?.length || 0) > 0);
  check('has suggestedDesignEngines', Array.isArray(recResult.recommendation?.suggestedDesignEngines));
  console.log('');

  // 3. apply_skill_pack — dryRun (default)
  console.log('3. apply_skill_pack (dryRun default)');
  const { applySkillPackTool } = await import('../src/tools/applySkillPackTool.js');
  const applyDryResult = await applySkillPackTool.handler({
    projectPath: FIXTURE,
    packId: 'landing-page',
  } as Parameters<typeof applySkillPackTool.handler>[0]);
  check('dryRun is true', applyDryResult.dryRun === true);
  check('has filesCreated', (applyDryResult.filesCreated?.length || 0) > 0);
  check('no errors', (applyDryResult.errors?.length || 0) === 0);
  console.log('');

  // 4. apply_skill_pack — blocked without confirm
  console.log('4. apply_skill_pack (blocked without confirm)');
  const applyBlockResult = await applySkillPackTool.handler({
    projectPath: FIXTURE,
    packId: 'landing-page',
    dryRun: false,
  } as Parameters<typeof applySkillPackTool.handler>[0]);
  check('returns success=false', applyBlockResult.success === false);
  check('error mentions confirm', (applyBlockResult.error || '').includes('confirm'));
  console.log('');

  // 5. apply_skill_pack — real with confirm on temp project
  console.log('5. apply_skill_pack (real with confirm)');
  await fs.mkdir(TMP_DIR, { recursive: true });
  await fs.writeFile(path.join(TMP_DIR, 'package.json'), JSON.stringify({
    name: 'runtime-test', dependencies: { react: '^18.0.0' },
    devDependencies: { vite: '^5.0.0', tailwindcss: '^3.4.0' },
  }));
  const applyRealResult = await applySkillPackTool.handler({
    projectPath: TMP_DIR,
    packId: 'landing-page',
    dryRun: false,
    confirm: true,
  } as Parameters<typeof applySkillPackTool.handler>[0]);
  check('returns success=true', applyRealResult.success === true);
  check('dryRun is false', applyRealResult.dryRun === false);

  // Verify .claude/ was created
  const claudeDir = path.join(TMP_DIR, '.claude');
  let claudeExists = false;
  try { await fs.access(claudeDir); claudeExists = true; } catch { /* empty */ }
  check('.claude/ created on disk', claudeExists);

  // Verify manifest
  const manifestExists = await fileExists(path.join(claudeDir, 'skill-router.json'));
  check('.claude/skill-router.json exists', manifestExists);

  // Verify skills copied
  const skillsDir = path.join(claudeDir, 'skills');
  let skillsCopied = false;
  try {
    const skills = await fs.readdir(skillsDir);
    skillsCopied = skills.length > 0;
  } catch { /* empty */ }
  check('skills copied to .claude/skills/', skillsCopied);

  // Verify agents copied
  const agentsDir = path.join(claudeDir, 'agents');
  let agentsCopied = false;
  try {
    const agents = await fs.readdir(agentsDir);
    agentsCopied = agents.length > 0;
  } catch { /* empty */ }
  check('agents copied to .claude/agents/', agentsCopied);
  console.log('');

  // 6. cleanup_unused_skills — dryRun
  console.log('6. cleanup_unused_skills (dryRun)');
  const { cleanupUnusedSkillsTool } = await import('../src/tools/cleanupUnusedSkillsTool.js');
  const cleanupDryResult = await cleanupUnusedSkillsTool.handler({
    projectPath: TMP_DIR,
  } as Parameters<typeof cleanupUnusedSkillsTool.handler>[0]);
  check('dryRun is true', cleanupDryResult.dryRun === true);
  check('success is true', cleanupDryResult.success === true);
  console.log('');

  // 7. cleanup — blocked without confirm
  console.log('7. cleanup_unused_skills (blocked without confirm)');
  const cleanupBlockResult = await cleanupUnusedSkillsTool.handler({
    projectPath: TMP_DIR,
    dryRun: false,
  } as Parameters<typeof cleanupUnusedSkillsTool.handler>[0]);
  check('returns success=false', cleanupBlockResult.success === false);
  check('error mentions confirm', (cleanupBlockResult.error || '').includes('confirm'));
  console.log('');

  // 8. run_policy_audit
  console.log('8. run_policy_audit');
  const { runAuditTool } = await import('../src/tools/runAuditTool.js');
  const auditResult = await runAuditTool.handler({ projectPath: PROJECT_ROOT });
  check('returns success', auditResult.success === true);
  check('has rulesChecked', (auditResult.rulesChecked?.length || 0) > 0);
  console.log('');

  // 9. install_autopilot_skill — dryRun
  console.log('9. install_autopilot_skill (dryRun)');
  const { installAutopilotSkillTool } = await import('../src/tools/installAutopilotSkillTool.js');
  const installAutopilotDryResult = await installAutopilotSkillTool.handler({
    projectPath: TMP_DIR,
    dryRun: true,
    confirm: false,
  });
  check('dryRun is true', installAutopilotDryResult.dryRun === true);
  check('success is true', installAutopilotDryResult.success === true);
  check('has filesCreated', (installAutopilotDryResult.filesCreated?.length || 0) > 0);
  check('no errors', (installAutopilotDryResult.errors?.length || 0) === 0);
  console.log('');

  // 10. install_autopilot_skill — blocked without confirm
  console.log('10. install_autopilot_skill (blocked without confirm)');
  const installAutopilotBlockResult = await installAutopilotSkillTool.handler({
    projectPath: TMP_DIR,
    dryRun: false,
    confirm: false,
  });
  check('returns success=false', installAutopilotBlockResult.success === false);
  check('error mentions confirm', (installAutopilotBlockResult.error || '').includes('confirm'));
  console.log('');

  // 11. install_autopilot_skill — real with confirm on temp project
  console.log('11. install_autopilot_skill (real with confirm)');
  const installAutopilotRealResult = await installAutopilotSkillTool.handler({
    projectPath: TMP_DIR,
    dryRun: false,
    confirm: true,
  });
  check('returns success=true', installAutopilotRealResult.success === true);
  check('dryRun is false', installAutopilotRealResult.dryRun === false);

  // Verify SKILL.md was created
  const autopilotSkillPath = path.join(TMP_DIR, '.claude', 'skills', 'skill-router-autopilot', 'SKILL.md');
  let autopilotSkillExists = false;
  try { await fs.access(autopilotSkillPath); autopilotSkillExists = true; } catch { /* empty */ }
  check('.claude/skills/skill-router-autopilot/SKILL.md created', autopilotSkillExists);

  // Verify content
  if (autopilotSkillExists) {
    const autopilotSkillContent = await fs.readFile(autopilotSkillPath, 'utf-8');
    check('SKILL.md contains route_request', autopilotSkillContent.includes('route_request'));
    check('SKILL.md contains prepare_project_for_request', autopilotSkillContent.includes('prepare_project_for_request'));
    check('SKILL.md contains dryRun: true', autopilotSkillContent.includes('dryRun: true'));
    check('SKILL.md does not call external engines', !autopilotSkillContent.match(/call\s+(?:Lovable|Stitch|v0|Framer|Relume|Figma|Webflow)\s+(?:API|directly|automatically)/i));
  }
  console.log('');

  // 12. install_autopilot_skill — global blocked without confirm
  console.log('12. install_autopilot_skill (global blocked without confirm)');
  const installAutopilotGlobalBlockResult = await installAutopilotSkillTool.handler({
    projectPath: TMP_DIR,
    scope: 'global',
    dryRun: false,
    confirm: false,
  });
  check('returns success=false for global', installAutopilotGlobalBlockResult.success === false);
  console.log('');

  // Cleanup temp
  await fs.rm(TMP_DIR, { recursive: true, force: true });

  // Summary
  console.log(`=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

async function fileExists(p: string): Promise<boolean> {
  try { await fs.access(p); return true; } catch { return false; }
}

main().catch(err => {
  console.error('Runtime check failed:', err);
  process.exit(1);
});
