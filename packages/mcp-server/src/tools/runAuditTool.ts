import { z } from 'zod';
import { runPolicyGuard, parsePolicyResults } from '@claude-skill-router/core/policy';

export const RunAuditInputSchema = z.object({
  projectPath: z.string().describe('Path to the project to audit'),
});

export type RunAuditInput = z.infer<typeof RunAuditInputSchema>;

export const runAuditTool = {
  name: 'run_policy_audit',
  description: 'Run policy audit on a project using the Policy Guard',
  inputSchema: RunAuditInputSchema,
  handler: async (input: RunAuditInput) => {
    const policyResult = await runPolicyGuard(input.projectPath);
    const parsed = parsePolicyResults(policyResult);

    return {
      success: true,
      passed: policyResult.passed,
      summary: parsed.summary,
      highCount: parsed.highCount,
      mediumCount: parsed.mediumCount,
      lowCount: parsed.lowCount,
      details: parsed.details,
      violations: policyResult.violations,
      rulesChecked: policyResult.rulesChecked,
    };
  },
};
