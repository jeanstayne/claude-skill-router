import { installSkillPack } from '@claude-skill-router/core/installer';

export async function applyCommand(
  projectPath: string,
  packId: string,
  options: { dryRun?: boolean; auto?: boolean; json?: boolean } = {}
) {
  const isDryRun = options.dryRun !== false;

  if (isDryRun) {
    console.log('[DRY RUN] No files will be modified');
  }

  const result = await installSkillPack({
    targetProjectPath: projectPath,
    packId,
    dryRun: isDryRun,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    if (result.success) {
      console.log('Pack applied successfully');
    } else {
      console.log('Pack application failed');
      result.errors.forEach((e: string) => console.log(`  Error: ${e}`));
    }
  }
  return result;
}
