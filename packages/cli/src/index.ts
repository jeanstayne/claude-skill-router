#!/usr/bin/env node
// CLI entry point for claude-skill-router
// Commands: scan, recommend, route, prepare, apply, cleanup, audit, report, install-autopilot

import { scanCommand } from './commands/scan.js';
import { recommendCommand } from './commands/recommend.js';
import { routeCommand } from './commands/route.js';
import { prepareCommand } from './commands/prepare.js';
import { applyCommand } from './commands/apply.js';
import { cleanupCommand } from './commands/cleanup.js';
import { auditCommand } from './commands/audit.js';
import { reportCommand } from './commands/report.js';
import { installAutopilotCommand } from './commands/installAutopilot.js';
import * as path from 'node:path';

interface CliOptions {
  project?: string; pack?: string; request?: string;
  json?: boolean; dryRun?: boolean; auto?: boolean; confirm?: boolean; help?: boolean;
  scope?: string; withClaudeMd?: boolean;
}

function parseArgs(args: string[]): { command: string; options: CliOptions; positional: string[] } {
  const options: CliOptions = {};
  const positional: string[] = []; let command = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json') options.json = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--auto') options.auto = true;
    else if (arg === '--confirm') options.confirm = true;
    else if (arg === '--with-claude-md') options.withClaudeMd = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--project' && i + 1 < args.length) options.project = args[++i];
    else if (arg === '--pack' && i + 1 < args.length) options.pack = args[++i];
    else if (arg === '--request' && i + 1 < args.length) options.request = args[++i];
    else if (arg === '--scope' && i + 1 < args.length) options.scope = args[++i];
    else if (!arg.startsWith('-')) { if (!command) command = arg; else positional.push(arg); }
  }

  return { command, options, positional };
}

function showHelp() {
  console.log(`
claude-skill-router — Roteador inteligente de skills para Claude Code

Usage: skill-router <command> [options]

Commands:
  scan               Scan a project directory to detect stack and type
  recommend          Recommend skills and agents for a project
  route              Analyze a natural language request and recommend skills/pack (no mutation)
  prepare            Analyze + prepare project from natural language request (dry-run by default)
  apply              Apply a skill pack to a project
  cleanup            Remove unused skills from a project
  audit              Run policy audit
  report             Generate a report
  install-autopilot  Install the skill-router-autopilot skill to a project

Options:
  --project <path>   Path to the project (default: current directory)
  --pack <id>        Pack ID to apply/cleanup
  --request <text>   Natural language request for route/prepare
  --json             Output in JSON format
  --dry-run          Preview changes without applying
  --confirm          Confirm real writes (required for mutations)
  --auto             Auto-detect and apply
  --scope <scope>    Scope: project or global (default: project)
  --with-claude-md   Also add managed snippet to CLAUDE.md
  -h, --help         Show this help

Examples:
  skill-router route --project ./my-project --request "crie uma LP premium"
  skill-router prepare --project ./my-project --request "crie uma LP premium" --dry-run
  skill-router prepare --project ./my-project --request "crie uma LP premium" --confirm
  skill-router install-autopilot --project ./my-project --dry-run
  skill-router install-autopilot --project ./my-project --confirm
  skill-router install-autopilot --project ./my-project --with-claude-md --dry-run
  skill-router install-autopilot --scope global --dry-run
  skill-router scan --project ./my-project --json
  skill-router apply --auto --project ./my-project --dry-run
  skill-router audit
`);
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (options.help || !command) { showHelp(); process.exit(0); }

  const projectPath = options.project ? path.resolve(options.project) : process.cwd();

  try {
    switch (command) {
      case 'scan':
        await scanCommand(projectPath, { json: options.json });
        break;

      case 'recommend': {
        const { scanProject } = await import('@claude-skill-router/core/scanner');
        const scanResult = await scanProject(projectPath);
        await recommendCommand(scanResult.projectType, scanResult.framework, scanResult.ui, { json: options.json });
        break;
      }

      case 'route': {
        const requestText = options.request || '';
        if (!requestText) { console.error('Error: --request is required for route command.'); process.exit(1); }
        await routeCommand(projectPath, requestText, { json: options.json, explicitPack: options.pack });
        break;
      }

      case 'prepare': {
        const requestText = options.request || '';
        if (!requestText) { console.error('Error: --request is required for prepare command.'); process.exit(1); }
        await prepareCommand(projectPath, requestText, {
          json: options.json, dryRun: options.dryRun, confirm: options.confirm, explicitPack: options.pack,
        });
        break;
      }

      case 'apply': {
        let packId = options.pack || 'landing-page';
        if (options.auto) {
          const { scanProject } = await import('@claude-skill-router/core/scanner');
          const { recommendSkills } = await import('@claude-skill-router/core/recommender');
          const scanResult = await scanProject(projectPath);
          console.log(`Detected: ${scanResult.projectType} (${scanResult.framework})`);
          const recommendation = await recommendSkills({ projectType: scanResult.projectType, framework: scanResult.framework, ui: scanResult.ui });
          packId = recommendation.recommendedPack;
          console.log(`Auto-selected pack: ${packId}`);
        }
        await applyCommand(projectPath, packId, { dryRun: options.dryRun, auto: options.auto, json: options.json });
        break;
      }

      case 'cleanup':
        await cleanupCommand(projectPath, { dryRun: options.dryRun, json: options.json });
        break;

      case 'audit':
        await auditCommand(projectPath);
        break;

      case 'report':
        await reportCommand('cli', { output: options.project });
        break;

      case 'install-autopilot': {
        const validScopes = ['project', 'global'];
        const scope = validScopes.includes(options.scope || '') ? options.scope as 'project' | 'global' : 'project';
        await installAutopilotCommand(projectPath, {
          json: options.json,
          dryRun: options.dryRun,
          confirm: options.confirm,
          scope,
          withClaudeMd: options.withClaudeMd,
        });
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        console.error('Run skill-router --help for usage.');
        process.exit(1);
    }
  } catch (err) {
    if (options.json) {
      console.error(JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }));
    } else {
      console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
    process.exit(1);
  }
}

main();
