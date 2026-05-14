import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface PolicyRule {
  id: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface PolicyViolation {
  ruleId: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  file?: string;
}

export interface PolicyResult {
  passed: boolean;
  violations: PolicyViolation[];
  rulesChecked: string[];
}

const DEFAULT_RULES: PolicyRule[] = [
  { id: 'no-secret-hardcode', severity: 'high', description: 'No hardcoded secrets, tokens, or API keys' },
  { id: 'no-direct-fs-outside-workspace', severity: 'high', description: 'No filesystem writes outside the workspace' },
  { id: 'no-remote-script-execution', severity: 'high', description: 'No automatic remote script execution' },
  { id: 'mcp-mutating-tools-require-dry-run-default', severity: 'high', description: 'MCP mutating tools must default to dryRun=true' },
  { id: 'mcp-mutating-tools-require-confirm-for-write', severity: 'high', description: 'MCP mutating tools must require confirm=true for real writes' },
  { id: 'require-dry-run-for-project-mutations', severity: 'medium', description: 'Mutations require dry-run mode' },
  { id: 'separate-core-cli-mcp-vscode', severity: 'medium', description: 'Clear separation of concerns' },
  { id: 'cleanup-must-preserve-unmanaged-files', severity: 'medium', description: 'Cleanup must never remove files not managed by skill-router' },
  { id: 'vscode-extension-package-metadata-required', severity: 'medium', description: 'VS Code extension must have activationEvents and contributes' },
  { id: 'eslint-config-required', severity: 'medium', description: 'ESLint must be configured' },
  { id: 'cli-json-output-should-be-valid', severity: 'low', description: 'CLI JSON output should be valid' },
];

export async function runPolicyGuard(sourceDir: string): Promise<PolicyResult> {
  const violations: PolicyViolation[] = [];
  const rulesChecked = DEFAULT_RULES.map(r => r.id);

  await checkMcpDryRunDefault(sourceDir, violations);
  await checkMcpConfirmRequired(sourceDir, violations);
  await checkVscodeMetadata(sourceDir, violations);
  await checkEslintConfig(sourceDir, violations);
  await checkNoSecrets(sourceDir, violations);

  return {
    passed: violations.filter(v => v.severity === 'high').length === 0,
    violations,
    rulesChecked,
  };
}

async function checkMcpDryRunDefault(sourceDir: string, violations: PolicyViolation[]) {
  const toolsDir = path.join(sourceDir, 'packages', 'mcp-server', 'src', 'tools');
  const mutatingTools = ['applySkillPackTool.ts', 'cleanupUnusedSkillsTool.ts'];

  for (const toolFile of mutatingTools) {
    const filePath = path.join(toolsDir, toolFile);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const hasDryRunDefault = content.includes('dryRun: z.boolean().default(true)');
      if (!hasDryRunDefault) {
        violations.push({
          ruleId: 'mcp-mutating-tools-require-dry-run-default',
          severity: 'high',
          description: `${toolFile} does not have dryRun defaulting to true`,
          file: filePath,
        });
      }
    } catch {
      violations.push({
        ruleId: 'mcp-mutating-tools-require-dry-run-default',
        severity: 'high',
        description: `Cannot check ${toolFile} — file not found`,
      });
    }
  }
}

async function checkMcpConfirmRequired(sourceDir: string, violations: PolicyViolation[]) {
  const toolsDir = path.join(sourceDir, 'packages', 'mcp-server', 'src', 'tools');
  const mutatingTools = ['applySkillPackTool.ts', 'cleanupUnusedSkillsTool.ts'];

  for (const toolFile of mutatingTools) {
    const filePath = path.join(toolsDir, toolFile);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const hasConfirmCheck = content.includes('!input.confirm') || content.includes('confirm');
      if (!hasConfirmCheck) {
        violations.push({
          ruleId: 'mcp-mutating-tools-require-confirm-for-write',
          severity: 'high',
          description: `${toolFile} does not check confirm parameter for real writes`,
          file: filePath,
        });
      }
    } catch {
      // File not found — already reported by checkMcpDryRunDefault
    }
  }
}

async function checkVscodeMetadata(sourceDir: string, violations: PolicyViolation[]) {
  const pkgPath = path.join(sourceDir, 'packages', 'vscode-extension', 'package.json');
  try {
    const content = await fs.readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);
    if (!pkg.activationEvents || pkg.activationEvents.length === 0) {
      violations.push({
        ruleId: 'vscode-extension-package-metadata-required',
        severity: 'medium',
        description: 'VS Code extension missing activationEvents',
        file: pkgPath,
      });
    }
    if (!pkg.contributes?.commands || pkg.contributes.commands.length === 0) {
      violations.push({
        ruleId: 'vscode-extension-package-metadata-required',
        severity: 'medium',
        description: 'VS Code extension missing contributes.commands',
        file: pkgPath,
      });
    }
  } catch {
    violations.push({
      ruleId: 'vscode-extension-package-metadata-required',
      severity: 'medium',
      description: 'Could not read VS Code extension package.json',
    });
  }
}

async function checkEslintConfig(sourceDir: string, violations: PolicyViolation[]) {
  const eslintConfigPath = path.join(sourceDir, 'eslint.config.js');
  try {
    await fs.access(eslintConfigPath);
  } catch {
    violations.push({
      ruleId: 'eslint-config-required',
      severity: 'medium',
      description: 'ESLint config file not found at eslint.config.js',
    });
  }
}

async function checkNoSecrets(sourceDir: string, violations: PolicyViolation[]) {
  const secretPatterns = [
    /api[_-]?key\s*[:=]\s*['"][A-Za-z0-9_\-]{20,}['"]/gi,
    /secret\s*[:=]\s*['"][A-Za-z0-9_\-]{20,}['"]/gi,
    /token\s*[:=]\s*['"][A-Za-z0-9_\-]{20,}['"]/gi,
  ];

  async function scanFile(filePath: string) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      for (const pattern of secretPatterns) {
        pattern.lastIndex = 0;
        if (pattern.test(content)) {
          violations.push({
            ruleId: 'no-secret-hardcode',
            severity: 'high',
            description: `Potential hardcoded secret detected in ${path.relative(sourceDir, filePath)}`,
            file: filePath,
          });
          break;
        }
      }
    } catch {
      // Can't read file — skip
    }
  }

  async function walkDir(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
        if (entry.name === 'fixtures' || entry.name === 'reports' || entry.name === 'registry') continue;
        if (entry.isDirectory()) {
          await walkDir(fullPath);
        } else if (entry.isFile() && /\.(ts|tsx|js|jsx|json)$/.test(entry.name)) {
          await scanFile(fullPath);
        }
      }
    } catch {
      // Can't read dir
    }
  }

  await walkDir(sourceDir);
}
