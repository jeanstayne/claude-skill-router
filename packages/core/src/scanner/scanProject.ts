import type { ProjectScanResult } from '../schemas/projectScanSchema.js';
import { detectStack } from './detectStack.js';
import { detectProjectType } from './detectProjectType.js';
import { detectClaudeConfig } from './detectClaudeConfig.js';

export async function scanProject(projectPath: string): Promise<ProjectScanResult> {
  const stack = await detectStack(projectPath);
  const projectType = await detectProjectType(projectPath);
  const agentConfig = await detectClaudeConfig(projectPath);

  return {
    projectRoot: projectPath,
    framework: stack.framework,
    language: stack.language,
    ui: stack.ui,
    tests: stack.tests,
    agentConfig,
    projectType: projectType.type,
    confidence: projectType.confidence,
  };
}
