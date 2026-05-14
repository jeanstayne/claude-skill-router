// VS Code Extension entry point — Phase 13
// Commands: scanWorkspace, recommendSkills, applyRecommendedPack, openLatestReport, runPolicyAudit, prepareFromPrompt, installAutopilotSkill

import * as vscode from 'vscode';
import * as path from 'node:path';
import * as fs from 'node:fs';

export function activate(context: vscode.ExtensionContext) {
  // Scan Workspace
  const scanCmd = vscode.commands.registerCommand('claude-skill-router.scanWorkspace', async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.[0]) {
      vscode.window.showErrorMessage('No workspace folder open');
      return;
    }
    try {
      const { scanProject } = await import('@claude-skill-router/core/scanner');
      const result = await scanProject(workspaceFolders[0].uri.fsPath);
      vscode.window.showInformationMessage(
        `Project: ${result.projectType} (${result.framework}) — Confidence: ${(result.confidence * 100).toFixed(0)}%`
      );
    } catch (e) {
      vscode.window.showErrorMessage(`Scan failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  });

  // Recommend Skills
  const recommendCmd = vscode.commands.registerCommand('claude-skill-router.recommendSkills', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Use scan first, then recommend — Phase 7');
  });

  // Apply Recommended Pack
  const applyCmd = vscode.commands.registerCommand('claude-skill-router.applyRecommendedPack', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Apply Recommended Pack — Phase 7');
  });

  // Open Latest Report
  const reportCmd = vscode.commands.registerCommand('claude-skill-router.openLatestReport', async () => {
    const reportsDir = path.resolve(context.extensionPath, '../../..', 'reports');
    const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.md')).sort().reverse();
    if (files.length > 0) {
      const doc = await vscode.workspace.openTextDocument(path.join(reportsDir, files[0]));
      await vscode.window.showTextDocument(doc);
    } else {
      vscode.window.showInformationMessage('No reports found in reports/');
    }
  });

  // Run Policy Audit
  const auditCmd = vscode.commands.registerCommand('claude-skill-router.runPolicyAudit', async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.[0]) {
      vscode.window.showErrorMessage('No workspace folder open');
      return;
    }
    try {
      const { runPolicyGuard, parsePolicyResults } = await import('@claude-skill-router/core/policy');
      const result = await runPolicyGuard(workspaceFolders[0].uri.fsPath);
      const parsed = parsePolicyResults(result);
      vscode.window.showInformationMessage(`Policy Audit: ${parsed.summary}`);
    } catch (e) {
      vscode.window.showErrorMessage(`Audit failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  });

  // Install Autopilot Skill (Phase 13)
  const installAutopilotCmd = vscode.commands.registerCommand('claude-skill-router.installAutopilotSkill', async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.[0]) {
      vscode.window.showErrorMessage('No workspace folder open');
      return;
    }

    const scope = await vscode.window.showQuickPick(
      [
        { label: 'Project', description: 'Install in .claude/skills/ of current workspace' },
        { label: 'Global', description: 'Install in ~/.claude/skills/ (requires explicit confirmation)' },
      ],
      { placeHolder: 'Select installation scope' }
    );

    if (!scope) return;

    try {
      const { installAutopilot } = await import('@claude-skill-router/core/installer');
      const projectPath = workspaceFolders[0].uri.fsPath;
      const isGlobal = scope.label === 'Global';

      // Dry-run first
      const dryRunResult = await installAutopilot({
        targetProjectPath: projectPath,
        scope: isGlobal ? 'global' : 'project',
        dryRun: true,
        confirm: false,
      });

      const previewLines = [
        `Scope: ${dryRunResult.scope}`,
        `Mode: dry-run`,
        '',
        'Files that would be created:',
        ...dryRunResult.filesCreated.map((f: string) => `  + ${f}`),
      ];

      if (dryRunResult.filesSkipped.length > 0) {
        previewLines.push('', 'Files already up to date:');
        dryRunResult.filesSkipped.forEach((f: string) => previewLines.push(`  ~ ${f}`));
      }

      if (dryRunResult.errors.length > 0) {
        previewLines.push('', 'Errors:');
        dryRunResult.errors.forEach((e: string) => previewLines.push(`  ! ${e}`));
      }

      const proceed = await vscode.window.showInformationMessage(
        previewLines.join('\n'),
        { modal: true },
        'Install'
      );

      if (proceed !== 'Install') return;

      // Apply
      const applyResult = await installAutopilot({
        targetProjectPath: projectPath,
        scope: isGlobal ? 'global' : 'project',
        dryRun: false,
        confirm: true,
      });

      if (applyResult.success) {
        vscode.window.showInformationMessage(
          `Autopilot skill installed at: ${applyResult.scope === 'global' ? '~/.claude' : '.claude'}/skills/skill-router-autopilot/SKILL.md`
        );
      } else {
        vscode.window.showErrorMessage(`Install failed: ${applyResult.errors.join(', ')}`);
      }
    } catch (e) {
      vscode.window.showErrorMessage(`Install autopilot failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  });

  // Prepare Project From Prompt (Phase 12)
  const prepareFromPromptCmd = vscode.commands.registerCommand('claude-skill-router.prepareFromPrompt', async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.[0]) {
      vscode.window.showErrorMessage('No workspace folder open');
      return;
    }

    const userRequest = await vscode.window.showInputBox({
      prompt: 'Descreva o que você quer criar ou melhorar',
      placeHolder: 'Ex: Crie uma LP premium para a Samar com visual moderno',
      ignoreFocusOut: true,
    });

    if (!userRequest) return;

    try {
      const { routeRequest } = await import('@claude-skill-router/core/router');
      const result = await routeRequest({
        projectPath: workspaceFolders[0].uri.fsPath,
        userRequest,
        dryRun: true,
        mode: 'recommend-only',
      });

      const message = [
        `Intent: ${result.intent}`,
        `Pack: ${result.selectedPack}`,
        `Skills: ${result.skills.length}, Agents: ${result.agents.length}`,
        result.suggestedDesignEngines.length > 0
          ? `Engines: ${result.suggestedDesignEngines.map((e: { name: string }) => e.name).join(', ')}`
          : '',
      ].filter(Boolean).join(' | ');

      const action = await vscode.window.showInformationMessage(
        message,
        { modal: false },
        'Apply Pack'
      );

      if (action === 'Apply Pack') {
        vscode.window.showInformationMessage(
          'Use CLI or MCP to apply the pack: skill-router prepare --confirm'
        );
      }
    } catch (e) {
      vscode.window.showErrorMessage(`Prepare failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  });

  context.subscriptions.push(
    scanCmd, recommendCmd, applyCmd, reportCmd, auditCmd, prepareFromPromptCmd, installAutopilotCmd
  );
}

export function deactivate() {}
