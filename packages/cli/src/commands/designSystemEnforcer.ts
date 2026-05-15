export async function designSystemEnforcerCommand(
  projectPath: string,
  options: { json?: boolean } = {}
) {
  const { runDesignSystemEnforcer } = await import('@claude-skill-router/core/design-system-enforcer/runDesignSystemEnforcer');

  const result = await runDesignSystemEnforcer(projectPath);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\n=== Design System Enforcer ===\n`);
    console.log(`Project: ${projectPath}`);
    console.log(`Design System: ${result.analysis.hasDesignSystem ? 'DETECTADO' : 'NÃO DETECTADO'}`);
    console.log(`Confidence: ${(result.analysis.confidence * 100).toFixed(0)}%`);
    console.log(`CSS Variables: ${result.analysis.hasCssVariables ? 'Sim' : 'Não'}`);
    console.log(`Tailwind Config: ${result.analysis.hasTailwindConfig ? 'Sim' : 'Não'}`);
    console.log(`Component Variants: ${result.analysis.hasComponentVariants ? 'Sim' : 'Não'}`);
    console.log(`DESIGN.md: ${result.analysis.hasDesignTokens ? 'Sim' : 'Não'}`);
    console.log(`\n--- Gaps ---`);
    for (const gap of result.analysis.gaps) {
      console.log(`  ! ${gap}`);
    }
    console.log(`\n--- Hardcoded Classes (${result.hardcodedIssues.length}) ---`);
    const high = result.hardcodedIssues.filter(i => i.severity === 'high');
    const med = result.hardcodedIssues.filter(i => i.severity === 'medium');
    if (high.length > 0) {
      console.log(`  HIGH (${high.length}):`);
      for (const i of high.slice(0, 10)) {
        console.log(`    ${i.file}:${i.line} — "${i.className}" → ${i.recommendation}`);
      }
    }
    if (med.length > 0) {
      console.log(`  MEDIUM (${med.length}):`);
      for (const i of med.slice(0, 5)) {
        console.log(`    ${i.file}:${i.line} — "${i.className}"`);
      }
    }
    console.log(`\n--- Checklist ---`);
    for (const item of result.checklist.checklist.slice(0, 5)) {
      console.log(`  [${item.severity}] ${item.description}`);
    }
    console.log(`  ... (${result.checklist.checklist.length} items total)`);
    console.log('');
  }

  return result;
}
