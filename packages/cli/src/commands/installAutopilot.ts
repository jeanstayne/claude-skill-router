import { installAutopilot } from '@claude-skill-router/core/installer';

export interface InstallAutopilotCliOptions {
  json?: boolean;
  dryRun?: boolean;
  confirm?: boolean;
  scope?: 'project' | 'global';
  withClaudeMd?: boolean;
}

export async function installAutopilotCommand(
  projectPath: string,
  options: InstallAutopilotCliOptions = {}
) {
  const scope = options.scope || 'project';
  const confirm = options.confirm === true;
  const dryRun = confirm ? false : options.dryRun !== false;

  const result = await installAutopilot({
    targetProjectPath: projectPath,
    scope,
    dryRun,
    confirm,
    withClaudeMd: options.withClaudeMd,
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('Skill Router Autopilot\n');
    console.log(`Scope: ${result.scope}`);
    console.log(`Target: ${projectPath}`);
    console.log(`Mode: ${result.dryRun ? 'dry-run' : 'real'}\n`);

    if (result.filesCreated.length > 0) {
      console.log(result.dryRun ? 'Would create:' : 'Created:');
      for (const f of result.filesCreated) {
        console.log(`  - ${f}`);
      }
      console.log();
    }

    if (result.filesSkipped.length > 0) {
      console.log('Skipped:');
      for (const f of result.filesSkipped) {
        console.log(`  - ${f}`);
      }
      console.log();
    }

    if (result.filesBackedUp.length > 0) {
      console.log('Backed up:');
      for (const f of result.filesBackedUp) {
        console.log(`  - ${f}`);
      }
      console.log();
    }

    if (result.claudeMdPatch) {
      console.log(`CLAUDE.md: ${result.claudeMdPatch}\n`);
    }

    if (result.errors.length > 0) {
      console.log('Errors:');
      for (const e of result.errors) {
        console.log(`  - ${e}`);
      }
      console.log();
    }

    if (result.dryRun) {
      console.log('No files were changed.');
      console.log('Next step: Run with --confirm to apply.');
    } else {
      console.log('Installation complete.');
    }
  }

  return result;
}
