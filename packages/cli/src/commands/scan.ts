import { scanProject } from '@claude-skill-router/core/scanner';

export async function scanCommand(projectPath: string, options: { json?: boolean } = {}) {
  const result = await scanProject(projectPath);
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Project: ${result.projectRoot}`);
    console.log(`Framework: ${result.framework}`);
    console.log(`Language: ${result.language}`);
    console.log(`UI: ${result.ui.join(', ') || 'none'}`);
    console.log(`Tests: ${result.tests.join(', ') || 'none'}`);
    console.log(`Type: ${result.projectType}`);
    console.log(`Confidence: ${result.confidence}`);
  }
  return result;
}
