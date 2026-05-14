import { z } from 'zod';
import { generatePhaseReport, generateAuditReport } from '@claude-skill-router/core/reports';
import { scanProject } from '@claude-skill-router/core/scanner';
import { runPolicyGuard, parsePolicyResults } from '@claude-skill-router/core/policy';

export const GenerateReportInputSchema = z.object({
  projectPath: z.string().describe('Path to the project'),
  reportType: z.enum(['scan', 'recommendation', 'install', 'audit']).describe('Type of report to generate'),
});

export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

export const generateReportTool = {
  name: 'generate_report',
  description: 'Generate a report for a project (scan, recommendation, install, or audit)',
  inputSchema: GenerateReportInputSchema,
  handler: async (input: GenerateReportInput) => {
    switch (input.reportType) {
      case 'scan': {
        const scanResult = await scanProject(input.projectPath);
        const report = generatePhaseReport({
          phase: 'scan',
          title: 'Project Scan Report',
          objective: `Scan project at ${input.projectPath}`,
          filesCreated: [],
          filesModified: [],
          testsExecuted: [],
          testResults: 'N/A',
          typecheck: 'N/A',
          lint: 'N/A',
          build: 'N/A',
          policyGuard: 'N/A',
          problemsFound: [],
          fixesApplied: [],
          risks: [],
          pending: [],
          preExistingErrors: [],
          introducedErrors: [],
          status: 'completed',
        });
        return {
          success: true,
          reportType: 'scan',
          scanResult,
          report,
        };
      }

      case 'audit': {
        const policyResult = await runPolicyGuard(input.projectPath);
        const parsed = parsePolicyResults(policyResult);
        const report = generateAuditReport({
          timestamp: new Date().toISOString(),
          policiesChecked: policyResult.rulesChecked,
          violations: policyResult.violations.map(v => ({
            policy: v.ruleId,
            severity: v.severity,
            description: v.description,
            file: v.file,
          })),
          passed: policyResult.passed,
        });
        return {
          success: true,
          reportType: 'audit',
          auditSummary: parsed,
          report,
        };
      }

      default: {
        const report = generatePhaseReport({
          phase: input.reportType,
          title: `${input.reportType} Report`,
          objective: `Generate ${input.reportType} report`,
          filesCreated: [],
          filesModified: [],
          testsExecuted: [],
          testResults: 'N/A',
          typecheck: 'N/A',
          lint: 'N/A',
          build: 'N/A',
          policyGuard: 'N/A',
          problemsFound: [],
          fixesApplied: [],
          risks: [],
          pending: [],
          preExistingErrors: [],
          introducedErrors: [],
          status: 'completed',
        });
        return {
          success: true,
          reportType: input.reportType,
          report,
        };
      }
    }
  },
};
