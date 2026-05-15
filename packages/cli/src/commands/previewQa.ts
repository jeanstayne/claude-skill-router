export async function previewQaCommand(
  projectPath: string,
  options: { json?: boolean } = {}
) {
  const { runPreviewQaLoop } = await import('@claude-skill-router/core/preview-qa-loop/runPreviewQaLoop');

  const result = await runPreviewQaLoop();

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\n=== Preview QA Loop ===\n`);
    console.log(`Project: ${projectPath}`);
    console.log(`Rule: ${result.checklist.rule}`);
    console.log(`\n--- Checklist (${result.checklist.checklist.length} items) ---`);
    for (const cat of ['layout', 'visual', 'content', 'interaction', 'responsive', 'performance']) {
      const items = result.checklist.checklist.filter(i => i.category === cat);
      console.log(`  ${cat.toUpperCase()} (${items.length}):`);
      for (const item of items.filter(i => i.severity === 'high')) {
        console.log(`    [${item.severity}] ${item.description}`);
      }
    }
    console.log(`\n--- Viewport Matrix ---`);
    console.log(`  iPhone 14 Pro (390x844) — mobile portrait [HIGH]`);
    console.log(`  iPad Air (768x1024) — tablet portrait [HIGH]`);
    console.log(`  Laptop (1440x900) — desktop landscape [HIGH]`);
    console.log(`  iPhone 14 Pro Max (430x932) — mobile portrait [MEDIUM]`);
    console.log(`  iPad Pro (1024x1366) — tablet landscape [MEDIUM]`);
    console.log(`  Full HD (1920x1080) — desktop landscape [LOW]`);
    console.log(`\nStatus: ${result.viewportSummary}`);
    if (result.regressionReport) {
      console.log(`Regressions: ${result.regressionReport.summary}`);
    }
    console.log('');
  }

  return result;
}
