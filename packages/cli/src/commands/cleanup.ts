import { cleanupUnusedSkills } from '@claude-skill-router/core/installer';

export async function cleanupCommand(projectPath: string, options: { dryRun?: boolean; json?: boolean } = {}) {
  const isDryRun = options.dryRun !== false;

  if (isDryRun) {
    console.log('[DRY RUN] No files will be removed');
  }

  const result = await cleanupUnusedSkills({ targetProjectPath: projectPath, dryRun: isDryRun });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    if (result.success) {
      console.log(`Cleaned up ${result.filesRemoved.length} unused files`);
    } else {
      console.log('Cleanup failed');
      result.errors.forEach((e: string) => console.log(`  Error: ${e}`));
    }
  }
  return result;
}
