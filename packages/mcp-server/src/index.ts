// MCP Server for claude-skill-router
// Exposes 10 tools: scan_project, recommend_skills, route_request, prepare_project_for_request,
// apply_skill_pack, cleanup_unused_skills, generate_project_instructions, run_policy_audit, generate_report,
// install_autopilot_skill

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

  return server;
}

// When run directly, start the server with stdio transport
async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
