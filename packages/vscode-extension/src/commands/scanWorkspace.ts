import * as vscode from 'vscode';
import { scanProject } from '@claude-skill-router/core/scanner';

export async function scanWorkspaceCommand() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const projectPath = workspaceFolders[0].uri.fsPath;
  const result = await scanProject(projectPath);

  vscode.window.showInformationMessage(
    `Project: ${result.projectType} (${result.framework}) — Confidence: ${(result.confidence * 100).toFixed(0)}%`
  );

  return result;
}
