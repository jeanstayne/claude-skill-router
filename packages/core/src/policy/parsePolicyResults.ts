import type { PolicyResult } from './runPolicyGuard.js';

export interface ParsedPolicyOutput {
  summary: string;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  details: string[];
}

export function parsePolicyResults(result: PolicyResult): ParsedPolicyOutput {
  const high = result.violations.filter(v => v.severity === 'high');
  const medium = result.violations.filter(v => v.severity === 'medium');
  const low = result.violations.filter(v => v.severity === 'low');

  const details = result.violations.map(
    v => `[${v.severity}] ${v.ruleId}: ${v.description}`
  );

  const summary = result.passed
    ? 'Policy check passed'
    : `Policy check failed: ${high.length} high, ${medium.length} medium, ${low.length} low violations`;

  return {
    summary,
    highCount: high.length,
    mediumCount: medium.length,
    lowCount: low.length,
    details,
  };
}
