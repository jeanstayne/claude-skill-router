import * as vscode from 'vscode';

export class SkillRouterPanel {
  public static currentPanel: SkillRouterPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getHtmlContent();
  }

  public static createOrShow() {
    const column = vscode.ViewColumn.Two;

    if (SkillRouterPanel.currentPanel) {
      SkillRouterPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'skillRouterPanel',
      'Skill Router',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    SkillRouterPanel.currentPanel = new SkillRouterPanel(panel);
  }

  private _getHtmlContent(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Claude Skill Router</title>
  <style>
    body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); background: var(--vscode-editor-background); }
    h1 { font-size: 18px; margin-bottom: 16px; }
    .section { margin-bottom: 20px; padding: 12px; border: 1px solid var(--vscode-panel-border); border-radius: 4px; }
    .section h2 { font-size: 14px; margin: 0 0 8px 0; }
    button { padding: 6px 14px; cursor: pointer; margin-right: 8px; }
  </style>
</head>
<body>
  <h1>Claude Skill Router</h1>
  <div class="section">
    <h2>Project Type</h2>
    <div id="project-type">Not scanned</div>
  </div>
  <div class="section">
    <h2>Recommended Skills</h2>
    <div id="skills">Not available</div>
  </div>
  <div class="section">
    <h2>Recommended Agents</h2>
    <div id="agents">Not available</div>
  </div>
  <div class="section">
    <h2>Latest Report</h2>
    <div id="report">Not available</div>
  </div>
  <div>
    <button onclick="applyPack()">Apply Pack</button>
    <button onclick="runAudit()">Run Audit</button>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    function applyPack() { vscode.postMessage({ command: 'apply' }); }
    function runAudit() { vscode.postMessage({ command: 'audit' }); }
  </script>
</body>
</html>`;
  }

  public dispose() {
    SkillRouterPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const d = this._disposables.pop();
      if (d) d.dispose();
    }
  }
}
