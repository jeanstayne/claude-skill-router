import { runPolicyGuard, parsePolicyResults } from '@claude-skill-router/core/policy';

export async function auditCommand(projectPath: string) {
  const result = await runPolicyGuard(projectPath);
  const parsed = parsePolicyResults(result);

  console.log(parsed.summary);
  console.log(`High: ${parsed.highCount}, Medium: ${parsed.mediumCount}, Low: ${parsed.lowCount}`);

  for (const detail of parsed.details) {
    console.log(`  ${detail}`);
  }

  return result;
}

// Allow running directly with tsx
if (process.argv[1]?.endsWith('audit.ts') || process.argv[1]?.endsWith('audit.js')) {
  const targetPath = process.argv[2] || '.';
  auditCommand(targetPath);
}
