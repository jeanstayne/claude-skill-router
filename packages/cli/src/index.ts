#!/usr/bin/env node
// CLI entry point for claude-skill-router
// Commands: scan, recommend, route, prepare, apply, cleanup, audit, report, install-autopilot,
// external-skills-list, external-skills-recommend, image-brief, copy-variants, marketing-plan, cro-seo-plan,
// lovable-pipeline, product-marketing-context, visual-directions, brand-template, component-first-plan (Phase 15)

import { scanCommand } from './commands/scan.js';
import { recommendCommand } from './commands/recommend.js';
import { routeCommand } from './commands/route.js';
import { prepareCommand } from './commands/prepare.js';
import { applyCommand } from './commands/apply.js';
import { cleanupCommand } from './commands/cleanup.js';
import { auditCommand } from './commands/audit.js';
import { reportCommand } from './commands/report.js';
import { installAutopilotCommand } from './commands/installAutopilot.js';
import { externalSkillsListCommand } from './commands/externalSkillsList.js';
import { externalSkillsRecommendCommand } from './commands/externalSkillsRecommend.js';
import { generateImageBriefCommand } from './commands/generateImageBrief.js';
import { generateCopyVariantsCommand } from './commands/generateCopyVariants.js';
import { generateMarketingPlanCommand } from './commands/generateMarketingPlan.js';
import { generateCROSEOPlanCommand } from './commands/generateCROSEOPlan.js';
import { lovablePipelineCommand } from './commands/lovablePipeline.js';
import { productMarketingContextCommand } from './commands/productMarketingContext.js';
import { visualDirectionsCommand } from './commands/visualDirections.js';
import { brandTemplateCommand } from './commands/brandTemplate.js';
import { componentFirstPlanCommand } from './commands/componentFirstPlan.js';
import { designSystemEnforcerCommand } from './commands/designSystemEnforcer.js';
import { seoByDefaultCommand } from './commands/seoByDefault.js';
import { sandboxTemplateCommand } from './commands/sandboxTemplate.js';
import { runtimeFeedbackCommand } from './commands/runtimeFeedback.js';
import { previewQaCommand } from './commands/previewQa.js';
import { designTokensCommand } from './commands/designTokens.js';
import * as path from 'node:path';

interface CliOptions {
  project?: string; pack?: string; request?: string;
  json?: boolean; dryRun?: boolean; auto?: boolean; confirm?: boolean; help?: boolean;
  scope?: string; withClaudeMd?: boolean;
  maxResults?: number; category?: string; riskLevel?: string; brand?: string; variantCount?: number;
  stylePreference?: string; projectType?: string; intent?: string;
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
    else if (arg === '--max-results' && i + 1 < args.length) options.maxResults = parseInt(args[++i]);
    else if (arg === '--category' && i + 1 < args.length) options.category = args[++i];
    else if (arg === '--risk-level' && i + 1 < args.length) options.riskLevel = args[++i];
    else if (arg === '--brand' && i + 1 < args.length) options.brand = args[++i];
    else if (arg === '--variant-count' && i + 1 < args.length) options.variantCount = parseInt(args[++i]);
    else if (arg === '--style' && i + 1 < args.length) options.stylePreference = args[++i];
    else if (arg === '--project-type' && i + 1 < args.length) options.projectType = args[++i];
    else if (arg === '--intent' && i + 1 < args.length) options.intent = args[++i];
    else if (!arg.startsWith('-')) { if (!command) command = arg; else positional.push(arg); }
  }

  return { command, options, positional };
}

function showHelp() {
  console.log(`
claude-skill-router — Roteador inteligente de skills para Claude Code

Usage: skill-router <command> [options]

Commands:
  scan                     Scan a project directory to detect stack and type
  recommend                Recommend skills and agents for a project
  route                    Analyze a natural language request and recommend skills/pack (no mutation)
  prepare                  Analyze + prepare project from natural language request (dry-run by default)
  apply                    Apply a skill pack to a project
  cleanup                  Remove unused skills from a project
  audit                    Run policy audit
  report                   Generate a report
  install-autopilot        Install the skill-router-autopilot skill to a project
  external-skills-list     List external skills from marketplace registry
  external-skills-recommend  Recommend external skills for a user request
  image-brief              Generate image prompt/brief (no generation)
  copy-variants            Generate copy variants (headlines, CTAs, angles)
  marketing-plan           Generate marketing campaign/launch plan
  cro-seo-plan             Generate CRO/SEO audit checklist
  lovable-pipeline         Run the full Lovable-Style Design Pipeline (Phase 15)
  product-marketing-context  Generate Product Marketing Context
  visual-directions        Generate 3 visual directions (Premium, Editorial, Impact)
  brand-template           Select best brand template for a project
  component-first-plan     Generate Component-First UI Plan
  design-system            Analyze project design system (hardcoded classes, tokens gaps)
  seo                      Generate SEO plan (title, meta, OG, JSON-LD, semantic HTML)
  sandbox-template         Recommend best sandbox template for a project
  runtime-feedback         Analyze runtime feedback (console logs + network requests)
  preview-qa               Run Preview QA Loop (checklist, viewport matrix, regressions)
  design-tokens            Generate design tokens + shadcn/ui variant plan

Options:
  --project <path>         Path to the project (default: current directory)
  --pack <id>              Pack ID to apply/cleanup
  --request <text>         Natural language request for route/prepare
  --json                   Output in JSON format
  --dry-run                Preview changes without applying
  --confirm                Confirm real writes (required for mutations)
  --auto                   Auto-detect and apply
  --scope <scope>          Scope: project or global (default: project)
  --with-claude-md         Also add managed snippet to CLAUDE.md
  --max-results <n>        Max results for external-skills-recommend (default: 5)
  --category <cat>         Filter external skills by category
  --risk-level <level>     Filter external skills by risk level (low/medium/high)
  --brand <name>           Brand name for image brief context
  --variant-count <n>      Number of copy variants (default: 5, max: 10)
  --style <pref>           Style preference for visual directions (e.g. premium, editorial, conversion)
  --project-type <type>    Project type override for template selection
  --intent <intent>        Intent override for template selection
  -h, --help               Show this help

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
  skill-router external-skills-list --category marketing --json
  skill-router external-skills-recommend --request "melhore as headlines" --json
  skill-router image-brief --project ./my-project --request "hero da LP" --brand "Samar"
  skill-router copy-variants --project ./my-project --request "LP de vendas" --variant-count 5
  skill-router marketing-plan --project ./my-project --request "lançamento de produto"
  skill-router cro-seo-plan --project ./my-project --request "auditar LP de conversão"
  skill-router lovable-pipeline --project ./my-project --request "crie LP premium para Destaque Agro" --dry-run
  skill-router lovable-pipeline --project ./my-project --request "LP do OptoScreen" --confirm
  skill-router product-marketing-context --project ./my-project --request "LP da Samar Veículos"
  skill-router visual-directions --project ./my-project --request "LP de produto SaaS" --style editorial
  skill-router brand-template --project ./my-project --request "LP de IA" --brand "NanoAI"
  skill-router component-first-plan --project ./my-project --request "dashboard de vendas"
  skill-router audit
  skill-router design-system --project ./my-project --json
  skill-router seo --project ./my-project --request "LP do Destaque Agro"
  skill-router sandbox-template --project ./my-project --project-type landing-page
  skill-router runtime-feedback --project ./my-project
  skill-router preview-qa --project ./my-project
  skill-router design-tokens --project ./my-project --request "LP premium verde"
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

      case 'external-skills-list':
        await externalSkillsListCommand({ json: options.json, category: options.category, riskLevel: options.riskLevel });
        break;

      case 'external-skills-recommend': {
        const extRecRequest = options.request || '';
        if (!extRecRequest) { console.error('Error: --request is required for external-skills-recommend.'); process.exit(1); }
        await externalSkillsRecommendCommand(projectPath, extRecRequest, { json: options.json, maxResults: options.maxResults });
        break;
      }

      case 'image-brief': {
        const imageRequest = options.request || '';
        if (!imageRequest) { console.error('Error: --request is required for image-brief.'); process.exit(1); }
        await generateImageBriefCommand(projectPath, imageRequest, { json: options.json, brand: options.brand });
        break;
      }

      case 'copy-variants': {
        const copyRequest = options.request || '';
        if (!copyRequest) { console.error('Error: --request is required for copy-variants.'); process.exit(1); }
        await generateCopyVariantsCommand(projectPath, copyRequest, { json: options.json, variantCount: options.variantCount });
        break;
      }

      case 'marketing-plan': {
        const mktRequest = options.request || '';
        if (!mktRequest) { console.error('Error: --request is required for marketing-plan.'); process.exit(1); }
        await generateMarketingPlanCommand(projectPath, mktRequest, { json: options.json });
        break;
      }

      case 'cro-seo-plan': {
        const croRequest = options.request || '';
        if (!croRequest) { console.error('Error: --request is required for cro-seo-plan.'); process.exit(1); }
        await generateCROSEOPlanCommand(projectPath, croRequest, { json: options.json });
        break;
      }

      // Phase 15 — Lovable-Style Design Pipeline
      case 'lovable-pipeline': {
        const lpRequest = options.request || '';
        if (!lpRequest) { console.error('Error: --request is required for lovable-pipeline.'); process.exit(1); }
        await lovablePipelineCommand(projectPath, lpRequest, {
          json: options.json, dryRun: options.dryRun, confirm: options.confirm,
          stylePreference: options.stylePreference, brand: options.brand,
        });
        break;
      }

      case 'product-marketing-context': {
        const pmcRequest = options.request || '';
        if (!pmcRequest) { console.error('Error: --request is required for product-marketing-context.'); process.exit(1); }
        await productMarketingContextCommand(projectPath, pmcRequest, { json: options.json });
        break;
      }

      case 'visual-directions': {
        const vdRequest = options.request || '';
        if (!vdRequest) { console.error('Error: --request is required for visual-directions.'); process.exit(1); }
        await visualDirectionsCommand(projectPath, vdRequest, { json: options.json, stylePreference: options.stylePreference });
        break;
      }

      case 'brand-template': {
        const btRequest = options.request || '';
        if (!btRequest) { console.error('Error: --request is required for brand-template.'); process.exit(1); }
        await brandTemplateCommand(projectPath, btRequest, {
          json: options.json, brand: options.brand, projectType: options.projectType, intent: options.intent,
        });
        break;
      }

      case 'component-first-plan': {
        const cfpRequest = options.request || '';
        if (!cfpRequest) { console.error('Error: --request is required for component-first-plan.'); process.exit(1); }
        await componentFirstPlanCommand(projectPath, cfpRequest, { json: options.json, stylePreference: options.stylePreference });
        break;
      }

      // Phase 16 — Design System Enforcer, SEO, Sandbox, Runtime Feedback, Preview QA
      case 'design-system': {
        await designSystemEnforcerCommand(projectPath, { json: options.json });
        break;
      }

      case 'seo': {
        const seoRequest = options.request || '';
        if (!seoRequest) { console.error('Error: --request is required for seo.'); process.exit(1); }
        await seoByDefaultCommand(projectPath, seoRequest, { json: options.json });
        break;
      }

      case 'sandbox-template': {
        await sandboxTemplateCommand(projectPath, {
          json: options.json,
          projectType: options.projectType,
          framework: undefined,
          needsUi: undefined,
          needsApi: undefined,
        });
        break;
      }

      case 'runtime-feedback': {
        await runtimeFeedbackCommand(projectPath, { json: options.json });
        break;
      }

      case 'preview-qa': {
        await previewQaCommand(projectPath, { json: options.json });
        break;
      }

      case 'design-tokens': {
        const dtRequest = options.request || '';
        if (!dtRequest) { console.error('Error: --request is required for design-tokens.'); process.exit(1); }
        await designTokensCommand(projectPath, dtRequest, {
          json: options.json, stylePreference: options.stylePreference,
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
