export async function runtimeFeedbackCommand(
  projectPath: string,
  options: { json?: boolean; consoleFile?: string } = {}
) {
  const { runRuntimeFeedback } = await import('@claude-skill-router/core/runtime-feedback/runRuntimeFeedback');

  const result = await runRuntimeFeedback({
    consoleLogs: [],
    networkRequests: [],
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\n=== Runtime Feedback ===\n`);
    console.log(`Project: ${projectPath}`);
    console.log(`\n--- Console Summary ---`);
    console.log(`Errors: ${result.consoleSummary.totalErrors}`);
    console.log(`Warnings: ${result.consoleSummary.totalWarnings}`);
    console.log(`Logs: ${result.consoleSummary.totalLogs}`);
    console.log(`\n--- Network Summary ---`);
    console.log(`Total Requests: ${result.networkSummary.totalRequests}`);
    console.log(`Failed: ${result.networkSummary.failed.length}`);
    console.log(`Slow: ${result.networkSummary.slow.length}`);
    console.log(`\n--- Classification ---`);
    console.log(result.classification.summary);
    console.log(`\n--- Fix Plan (${result.fixPlan.actions.length} actions) ---`);
    console.log(`Priority order:`);
    for (const line of result.fixPlan.priorityOrder) {
      console.log(`  ${line}`);
    }
    if (result.fixPlan.actions.length === 0) {
      console.log(`  No actions to fix — data is empty. Feed console logs and network requests for analysis.`);
    }
    console.log('');
  }

  return result;
}
