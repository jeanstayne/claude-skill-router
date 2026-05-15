// MCP Server for claude-skill-router
// Exposes 22 tools (Phase 15): scan_project, recommend_skills, route_request, prepare_project_for_request,
// apply_skill_pack, cleanup_unused_skills, generate_project_instructions, run_policy_audit, generate_report,
// install_autopilot_skill, recommend_external_skills, list_external_skills, generate_image_brief,
// generate_copy_variants, generate_marketing_plan, generate_cro_seo_audit_plan,
// run_lovable_pipeline, generate_product_marketing_context, generate_visual_directions,
// select_brand_template, generate_design_md, generate_component_first_plan

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { scanProjectTool } from './tools/scanProjectTool.js';
import { recommendSkillsTool } from './tools/recommendSkillsTool.js';
import { applySkillPackTool } from './tools/applySkillPackTool.js';
import { cleanupUnusedSkillsTool } from './tools/cleanupUnusedSkillsTool.js';
import { generateInstructionsTool } from './tools/generateInstructionsTool.js';
import { runAuditTool } from './tools/runAuditTool.js';
import { generateReportTool } from './tools/generateReportTool.js';
import { routeRequestTool } from './tools/routeRequestTool.js';
import { prepareProjectForRequestTool } from './tools/prepareProjectForRequestTool.js';
import { installAutopilotSkillTool } from './tools/installAutopilotSkillTool.js';

// Phase 14 — Marketplace external skills & marketing tools
import { recommendExternalSkillsTool } from './tools/recommendExternalSkillsTool.js';
import { listExternalSkillsTool } from './tools/listExternalSkillsTool.js';
import { generateImageBriefTool } from './tools/generateImageBriefTool.js';
import { generateCopyVariantsTool } from './tools/generateCopyVariantsTool.js';
import { generateMarketingPlanTool } from './tools/generateMarketingPlanTool.js';
import { generateCROSEOPlanTool } from './tools/generateCROSEOPlanTool.js';

// Phase 15 — Lovable-Style Design Pipeline
import { runLovablePipelineTool } from './tools/runLovablePipelineTool.js';
import { generateProductMarketingContextTool } from './tools/generateProductMarketingContextTool.js';
import { generateVisualDirectionsTool } from './tools/generateVisualDirectionsTool.js';
import { selectBrandTemplateTool } from './tools/selectBrandTemplateTool.js';
import { generateDesignMdTool } from './tools/generateDesignMdTool.js';
import { generateComponentFirstPlanTool } from './tools/generateComponentFirstPlanTool.js';

// Phase 16 — Design System Enforcer, SEO, Sandbox, Runtime Feedback, Preview QA
import { designSystemEnforcerTool } from './tools/designSystemEnforcerTool.js';
import { seoByDefaultTool } from './tools/seoByDefaultTool.js';
import { sandboxTemplateRecommendTool } from './tools/sandboxTemplateRecommendTool.js';
import { sandboxTemplateLoadTool } from './tools/sandboxTemplateLoadTool.js';
import { runtimeFeedbackAnalyzeTool } from './tools/runtimeFeedbackAnalyzeTool.js';
import { previewQaLoopTool } from './tools/previewQaLoopTool.js';
import { designTokensPlanTool } from './tools/designTokensPlanTool.js';
import { shadcnVariantPlanTool } from './tools/shadcnVariantPlanTool.js';

// Helper: wrap handler result in MCP content format
function wrapHandler<T>(handler: (input: T) => Promise<Record<string, unknown>>) {
  return async (input: T) => {
    const result = await handler(input);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  };
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'claude-skill-router',
    version: '1.0.0',
  });

  server.registerTool(
    scanProjectTool.name,
    {
      description: scanProjectTool.description,
      inputSchema: scanProjectTool.inputSchema,
    },
    wrapHandler(scanProjectTool.handler)
  );

  server.registerTool(
    recommendSkillsTool.name,
    {
      description: recommendSkillsTool.description,
      inputSchema: recommendSkillsTool.inputSchema,
    },
    wrapHandler(recommendSkillsTool.handler)
  );

  server.registerTool(
    routeRequestTool.name,
    {
      description: routeRequestTool.description,
      inputSchema: routeRequestTool.inputSchema,
    },
    wrapHandler(routeRequestTool.handler)
  );

  server.registerTool(
    prepareProjectForRequestTool.name,
    {
      description: prepareProjectForRequestTool.description,
      inputSchema: prepareProjectForRequestTool.inputSchema,
    },
    wrapHandler(prepareProjectForRequestTool.handler)
  );

  server.registerTool(
    applySkillPackTool.name,
    {
      description: applySkillPackTool.description,
      inputSchema: applySkillPackTool.inputSchema,
    },
    wrapHandler(applySkillPackTool.handler)
  );

  server.registerTool(
    cleanupUnusedSkillsTool.name,
    {
      description: cleanupUnusedSkillsTool.description,
      inputSchema: cleanupUnusedSkillsTool.inputSchema,
    },
    wrapHandler(cleanupUnusedSkillsTool.handler)
  );

  server.registerTool(
    generateInstructionsTool.name,
    {
      description: generateInstructionsTool.description,
      inputSchema: generateInstructionsTool.inputSchema,
    },
    wrapHandler(generateInstructionsTool.handler)
  );

  server.registerTool(
    runAuditTool.name,
    {
      description: runAuditTool.description,
      inputSchema: runAuditTool.inputSchema,
    },
    wrapHandler(runAuditTool.handler)
  );

  server.registerTool(
    generateReportTool.name,
    {
      description: generateReportTool.description,
      inputSchema: generateReportTool.inputSchema,
    },
    wrapHandler(generateReportTool.handler)
  );

  server.registerTool(
    installAutopilotSkillTool.name,
    {
      description: installAutopilotSkillTool.description,
      inputSchema: installAutopilotSkillTool.inputSchema,
    },
    wrapHandler(installAutopilotSkillTool.handler)
  );

  // Phase 14 — Marketplace external skills & marketing tools
  server.registerTool(
    recommendExternalSkillsTool.name,
    { description: recommendExternalSkillsTool.description, inputSchema: recommendExternalSkillsTool.inputSchema },
    wrapHandler(recommendExternalSkillsTool.handler)
  );
  server.registerTool(
    listExternalSkillsTool.name,
    { description: listExternalSkillsTool.description, inputSchema: listExternalSkillsTool.inputSchema },
    wrapHandler(listExternalSkillsTool.handler)
  );
  server.registerTool(
    generateImageBriefTool.name,
    { description: generateImageBriefTool.description, inputSchema: generateImageBriefTool.inputSchema },
    wrapHandler(generateImageBriefTool.handler)
  );
  server.registerTool(
    generateCopyVariantsTool.name,
    { description: generateCopyVariantsTool.description, inputSchema: generateCopyVariantsTool.inputSchema },
    wrapHandler(generateCopyVariantsTool.handler)
  );
  server.registerTool(
    generateMarketingPlanTool.name,
    { description: generateMarketingPlanTool.description, inputSchema: generateMarketingPlanTool.inputSchema },
    wrapHandler(generateMarketingPlanTool.handler)
  );
  server.registerTool(
    generateCROSEOPlanTool.name,
    { description: generateCROSEOPlanTool.description, inputSchema: generateCROSEOPlanTool.inputSchema },
    wrapHandler(generateCROSEOPlanTool.handler)
  );

  // Phase 15 — Lovable-Style Design Pipeline
  server.registerTool(
    runLovablePipelineTool.name,
    { description: runLovablePipelineTool.description, inputSchema: runLovablePipelineTool.inputSchema },
    wrapHandler(runLovablePipelineTool.handler)
  );
  server.registerTool(
    generateProductMarketingContextTool.name,
    { description: generateProductMarketingContextTool.description, inputSchema: generateProductMarketingContextTool.inputSchema },
    wrapHandler(generateProductMarketingContextTool.handler)
  );
  server.registerTool(
    generateVisualDirectionsTool.name,
    { description: generateVisualDirectionsTool.description, inputSchema: generateVisualDirectionsTool.inputSchema },
    wrapHandler(generateVisualDirectionsTool.handler)
  );
  server.registerTool(
    selectBrandTemplateTool.name,
    { description: selectBrandTemplateTool.description, inputSchema: selectBrandTemplateTool.inputSchema },
    wrapHandler(selectBrandTemplateTool.handler)
  );
  server.registerTool(
    generateDesignMdTool.name,
    { description: generateDesignMdTool.description, inputSchema: generateDesignMdTool.inputSchema },
    wrapHandler(generateDesignMdTool.handler)
  );
  server.registerTool(
    generateComponentFirstPlanTool.name,
    { description: generateComponentFirstPlanTool.description, inputSchema: generateComponentFirstPlanTool.inputSchema },
    wrapHandler(generateComponentFirstPlanTool.handler)
  );

  // Phase 16 — Design System Enforcer, SEO, Sandbox, Runtime Feedback, Preview QA
  server.registerTool(
    designSystemEnforcerTool.name,
    { description: designSystemEnforcerTool.description, inputSchema: designSystemEnforcerTool.inputSchema },
    wrapHandler(designSystemEnforcerTool.handler)
  );
  server.registerTool(
    seoByDefaultTool.name,
    { description: seoByDefaultTool.description, inputSchema: seoByDefaultTool.inputSchema },
    wrapHandler(seoByDefaultTool.handler)
  );
  server.registerTool(
    sandboxTemplateRecommendTool.name,
    { description: sandboxTemplateRecommendTool.description, inputSchema: sandboxTemplateRecommendTool.inputSchema },
    wrapHandler(sandboxTemplateRecommendTool.handler)
  );
  server.registerTool(
    sandboxTemplateLoadTool.name,
    { description: sandboxTemplateLoadTool.description, inputSchema: sandboxTemplateLoadTool.inputSchema },
    wrapHandler(sandboxTemplateLoadTool.handler)
  );
  server.registerTool(
    runtimeFeedbackAnalyzeTool.name,
    { description: runtimeFeedbackAnalyzeTool.description, inputSchema: runtimeFeedbackAnalyzeTool.inputSchema },
    wrapHandler(runtimeFeedbackAnalyzeTool.handler)
  );
  server.registerTool(
    previewQaLoopTool.name,
    { description: previewQaLoopTool.description, inputSchema: previewQaLoopTool.inputSchema },
    wrapHandler(previewQaLoopTool.handler)
  );
  server.registerTool(
    designTokensPlanTool.name,
    { description: designTokensPlanTool.description, inputSchema: designTokensPlanTool.inputSchema },
    wrapHandler(designTokensPlanTool.handler)
  );
  server.registerTool(
    shadcnVariantPlanTool.name,
    { description: shadcnVariantPlanTool.description, inputSchema: shadcnVariantPlanTool.inputSchema },
    wrapHandler(shadcnVariantPlanTool.handler)
  );

  return server;
}

// When run directly, start the server with stdio transport
async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
