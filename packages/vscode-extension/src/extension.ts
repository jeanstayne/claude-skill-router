// VS Code Extension entry point — Phase 15
// Commands: scanWorkspace, recommendSkills, applyRecommendedPack, openLatestReport, runPolicyAudit, prepareFromPrompt, installAutopilotSkill,
// listExternalSkills, recommendExternalSkills, generateImageBrief, generateCopyVariants, generateCROSEOPlan,
// runLovablePipeline, generateProductMarketingContext, generateVisualDirections, selectBrandTemplate, generateComponentFirstPlan

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

  // Run Lovable-Style Design Pipeline (Phase 15)
  const runLovablePipelineCmd = vscode.commands.registerCommand('claude-skill-router.runLovablePipeline', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Run Lovable-Style Design Pipeline — use CLI: skill-router lovable-pipeline --request "..." --dry-run');
  });

  // Generate Product Marketing Context (Phase 15)
  const generateProductMarketingContextCmd = vscode.commands.registerCommand('claude-skill-router.generateProductMarketingContext', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Generate Product Marketing Context — use CLI: skill-router product-marketing-context --request "..."');
  });

  // Generate Visual Directions (Phase 15)
  const generateVisualDirectionsCmd = vscode.commands.registerCommand('claude-skill-router.generateVisualDirections', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Generate Visual Directions — use CLI: skill-router visual-directions --request "..." --style editorial');
  });

  // Select Brand Template (Phase 15)
  const selectBrandTemplateCmd = vscode.commands.registerCommand('claude-skill-router.selectBrandTemplate', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Select Brand Template — use CLI: skill-router brand-template --request "..." --brand "..."');
  });

  // Generate Component-First Plan (Phase 15)
  const generateComponentFirstPlanCmd = vscode.commands.registerCommand('claude-skill-router.generateComponentFirstPlan', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Generate Component-First UI Plan — use CLI: skill-router component-first-plan --request "..."');
  });

  // List External Skills (Phase 14)
  const listExternalSkillsCmd = vscode.commands.registerCommand('claude-skill-router.listExternalSkills', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: List External Skills — use CLI: skill-router external-skills-list');
  });

  // Recommend External Skills (Phase 14)
  const recommendExternalSkillsCmd = vscode.commands.registerCommand('claude-skill-router.recommendExternalSkills', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Recommend External Skills — use CLI: skill-router external-skills-recommend --request "..."');
  });

  // Generate Image Brief (Phase 14)
  const generateImageBriefCmd = vscode.commands.registerCommand('claude-skill-router.generateImageBrief', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Generate Image Brief — use CLI: skill-router image-brief --request "..." --brand "..."');
  });

  // Generate Copy Variants (Phase 14)
  const generateCopyVariantsCmd = vscode.commands.registerCommand('claude-skill-router.generateCopyVariants', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Generate Copy Variants — use CLI: skill-router copy-variants --request "..."');
  });

  // Generate CRO/SEO Plan (Phase 14)
  const generateCROSEOPlanCmd = vscode.commands.registerCommand('claude-skill-router.generateCROSEOPlan', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Generate CRO/SEO Plan — use CLI: skill-router cro-seo-plan --request "..."');
  });

  // Design System Enforcer (Phase 16)
  const designSystemEnforcerCmd = vscode.commands.registerCommand('claude-skill-router.designSystemEnforcer', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Design System Enforcer — use CLI: skill-router design-system --project "..." --json');
  });

  // SEO by Default (Phase 16)
  const seoByDefaultCmd = vscode.commands.registerCommand('claude-skill-router.seoByDefault', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: SEO by Default — use CLI: skill-router seo --request "..." --json');
  });

  // Sandbox Template (Phase 16)
  const sandboxTemplateCmd = vscode.commands.registerCommand('claude-skill-router.sandboxTemplate', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Sandbox Template — use CLI: skill-router sandbox-template --project-type "..." --json');
  });

  // Runtime Feedback (Phase 16)
  const runtimeFeedbackCmd = vscode.commands.registerCommand('claude-skill-router.runtimeFeedback', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Runtime Feedback — use CLI: skill-router runtime-feedback');
  });

  // Preview QA Loop (Phase 16)
  const previewQaLoopCmd = vscode.commands.registerCommand('claude-skill-router.previewQaLoop', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Preview QA Loop — use CLI: skill-router preview-qa');
  });

  // Design Tokens Plan (Phase 16)
  const designTokensPlanCmd = vscode.commands.registerCommand('claude-skill-router.designTokensPlan', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: Design Tokens Plan — use CLI: skill-router design-tokens --request "..."');
  });

  // shadcn/ui Variant Plan (Phase 16)
  const shadcnVariantPlanCmd = vscode.commands.registerCommand('claude-skill-router.shadcnVariantPlan', async () => {
    vscode.window.showInformationMessage('Claude Skill Router: shadcn/ui Variant Plan — use CLI: skill-router design-tokens --request "..."');
  });

  context.subscriptions.push(
    scanCmd, recommendCmd, applyCmd, reportCmd, auditCmd, prepareFromPromptCmd, installAutopilotCmd,
    runLovablePipelineCmd, generateProductMarketingContextCmd, generateVisualDirectionsCmd,
    selectBrandTemplateCmd, generateComponentFirstPlanCmd,
    listExternalSkillsCmd, recommendExternalSkillsCmd, generateImageBriefCmd, generateCopyVariantsCmd, generateCROSEOPlanCmd,
    designSystemEnforcerCmd, seoByDefaultCmd, sandboxTemplateCmd, runtimeFeedbackCmd, previewQaLoopCmd,
    designTokensPlanCmd, shadcnVariantPlanCmd
  );
}

export function deactivate() {}
