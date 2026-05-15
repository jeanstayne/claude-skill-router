export async function sandboxTemplateCommand(
  projectPath: string,
  options: { json?: boolean; projectType?: string; framework?: string; needsUi?: boolean; needsApi?: boolean } = {}
) {
  const { recommendSandboxTemplate } = await import('@claude-skill-router/core/sandbox-template-registry/recommendSandboxTemplate');

  const result = await recommendSandboxTemplate({
    projectType: options.projectType,
    framework: options.framework,
    language: 'typescript',
    needsUi: options.needsUi,
    needsApi: options.needsApi,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\n=== Sandbox Template Recommendation ===\n`);
    console.log(`Project: ${projectPath}`);
    console.log(`\n--- Recommendations ---`);
    for (const rec of result.recommendations) {
      const star = rec.template.id === result.topPick?.template.id ? ' [TOP PICK]' : '';
      console.log(`  ${rec.template.name} (${rec.template.id})${star}`);
      console.log(`    Score: ${rec.score} | Framework: ${rec.template.framework} | UI: ${rec.template.ui.join(', ') || 'none'}`);
      console.log(`    Reasons: ${rec.reasons.join('; ')}`);
      console.log(`    Port: ${rec.template.port} | Dev: ${rec.template.devCommand} | Build: ${rec.template.buildCommand}`);
    }
    if (result.topPick) {
      console.log(`\n--- Top Pick: ${result.topPick.template.name} ---`);
      console.log(`Required files: ${result.topPick.template.requiredFiles.join(', ')}`);
      console.log(`Dependencies: ${Object.keys(result.topPick.template.recommendedDependencies.dependencies).length} runtime, ${Object.keys(result.topPick.template.recommendedDependencies.devDependencies).length} dev`);
    }
    console.log('');
  }

  return result;
}
