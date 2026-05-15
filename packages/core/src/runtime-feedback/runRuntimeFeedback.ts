// Phase 16.5 — Runtime Feedback orchestrator
// Parses logs, network requests, classifies issues, and generates fix plans.

import { parseConsoleLogs, type ConsoleLogEntry, type ConsoleLogSummary } from './parseConsoleLogs.js';
import { parseNetworkRequests, type NetworkRequestEntry, type NetworkSummary } from './parseNetworkRequests.js';
import { classifyRuntimeIssues, type ClassificationReport } from './classifyRuntimeIssues.js';
import { generateFixPlan, type FixPlan } from './generateFixPlan.js';

export interface RuntimeFeedbackResult {
  consoleSummary: ConsoleLogSummary;
  networkSummary: NetworkSummary;
  classification: ClassificationReport;
  fixPlan: FixPlan;
  summary: string;
}

export async function runRuntimeFeedback(opts: {
  consoleLogs: ConsoleLogEntry[];
  networkRequests: NetworkRequestEntry[];
}): Promise<RuntimeFeedbackResult> {
  const consoleSummary = parseConsoleLogs(opts.consoleLogs);
  const networkSummary = parseNetworkRequests(opts.networkRequests);
  const classification = classifyRuntimeIssues(consoleSummary, networkSummary);
  const fixPlan = generateFixPlan(classification.issues);

  const summary = [
    `Console: ${consoleSummary.totalErrors} erros, ${consoleSummary.totalWarnings} warnings, ${consoleSummary.totalLogs} logs`,
    `Network: ${networkSummary.failed.length} falhas, ${networkSummary.slow.length} lentos (${networkSummary.totalRequests} total)`,
    `Issues: ${classification.summary}`,
  ].join(' | ');

  return { consoleSummary, networkSummary, classification, fixPlan, summary };
}
