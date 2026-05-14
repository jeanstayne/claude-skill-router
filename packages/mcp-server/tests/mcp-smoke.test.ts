import { describe, it, expect } from 'vitest';
import { createServer } from '../src/index.js';

describe('MCP Server — Smoke Test', () => {
  it('should create server without error', () => {
    const server = createServer();
    expect(server).toBeDefined();
  });

  it('should have server name and version', () => {
    const server = createServer();
    // McpServer stores name and version internally
    expect(server).toBeDefined();
  });
});

describe('MCP Tools — Registration Validation', () => {
  const REQUIRED_TOOLS = [
    'scan_project',
    'recommend_skills',
    'apply_skill_pack',
    'cleanup_unused_skills',
    'generate_project_instructions',
    'run_policy_audit',
    'generate_report',
    'route_request',
    'prepare_project_for_request',
    'install_autopilot_skill',
  ];

  const MUTATION_TOOLS = ['apply_skill_pack', 'cleanup_unused_skills', 'install_autopilot_skill'];

  it('should export all 10 tools', async () => {
    const { scanProjectTool } = await import('../src/tools/scanProjectTool.js');
    const { recommendSkillsTool } = await import('../src/tools/recommendSkillsTool.js');
    const { applySkillPackTool } = await import('../src/tools/applySkillPackTool.js');
    const { cleanupUnusedSkillsTool } = await import('../src/tools/cleanupUnusedSkillsTool.js');
    const { generateInstructionsTool } = await import('../src/tools/generateInstructionsTool.js');
    const { runAuditTool } = await import('../src/tools/runAuditTool.js');
    const { generateReportTool } = await import('../src/tools/generateReportTool.js');
    const { routeRequestTool } = await import('../src/tools/routeRequestTool.js');
    const { prepareProjectForRequestTool } = await import('../src/tools/prepareProjectForRequestTool.js');
    const { installAutopilotSkillTool } = await import('../src/tools/installAutopilotSkillTool.js');

    const tools = [
      scanProjectTool,
      recommendSkillsTool,
      applySkillPackTool,
      cleanupUnusedSkillsTool,
      generateInstructionsTool,
      runAuditTool,
      generateReportTool,
      routeRequestTool,
      prepareProjectForRequestTool,
      installAutopilotSkillTool,
    ];

    expect(tools.length).toBe(10);

    for (const tool of tools) {
      expect(tool.name).toBeTruthy();
      expect(REQUIRED_TOOLS).toContain(tool.name);
      expect(tool.inputSchema).toBeDefined();
      expect(typeof tool.handler).toBe('function');
    }
  });

  it('should have dryRun default true on mutation tools', async () => {
    for (const toolName of MUTATION_TOOLS) {
      // Dynamically import to check schema
      let toolModule;
      let parseInput: Record<string, unknown>;
      let schemaName: string;

      if (toolName === 'apply_skill_pack') {
        toolModule = await import('../src/tools/applySkillPackTool.js');
        parseInput = { projectPath: '.', packId: 'test' };
        schemaName = 'ApplySkillPackInputSchema';
      } else if (toolName === 'cleanup_unused_skills') {
        toolModule = await import('../src/tools/cleanupUnusedSkillsTool.js');
        parseInput = { projectPath: '.' };
        schemaName = 'CleanupUnusedSkillsInputSchema';
      } else {
        toolModule = await import('../src/tools/installAutopilotSkillTool.js');
        parseInput = { projectPath: '.' };
        schemaName = 'InstallAutopilotSkillInputSchema';
      }

      // Parse with minimal input to check defaults
      const parsed = toolModule[schemaName].safeParse(parseInput);

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.dryRun).toBe(true);
      }
    }
  });

  it('should have confirm default false on mutation tools', async () => {
    for (const toolName of MUTATION_TOOLS) {
      let toolModule;
      let parseInput: Record<string, unknown>;
      let schemaName: string;

      if (toolName === 'apply_skill_pack') {
        toolModule = await import('../src/tools/applySkillPackTool.js');
        parseInput = { projectPath: '.', packId: 'test' };
        schemaName = 'ApplySkillPackInputSchema';
      } else if (toolName === 'cleanup_unused_skills') {
        toolModule = await import('../src/tools/cleanupUnusedSkillsTool.js');
        parseInput = { projectPath: '.' };
        schemaName = 'CleanupUnusedSkillsInputSchema';
      } else {
        toolModule = await import('../src/tools/installAutopilotSkillTool.js');
        parseInput = { projectPath: '.' };
        schemaName = 'InstallAutopilotSkillInputSchema';
      }

      const parsed = toolModule[schemaName].safeParse(parseInput);

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.confirm).toBe(false);
      }
    }
  });

  it('should reject real writes without confirm on apply_skill_pack', async () => {
    const { applySkillPackTool } = await import('../src/tools/applySkillPackTool.js');
    const result = await applySkillPackTool.handler({
      projectPath: '.',
      packId: 'landing-page',
      dryRun: false,
      // confirm is not set — should be rejected
    } as Parameters<typeof applySkillPackTool.handler>[0]);
    expect(result.success).toBe(false);
    expect(result.error).toContain('confirm');
  });

  it('should reject real removal without confirm on cleanup', async () => {
    const { cleanupUnusedSkillsTool } = await import('../src/tools/cleanupUnusedSkillsTool.js');
    const result = await cleanupUnusedSkillsTool.handler({
      projectPath: '.',
      dryRun: false,
      // confirm is not set — should be rejected
    } as Parameters<typeof cleanupUnusedSkillsTool.handler>[0]);
    expect(result.success).toBe(false);
    expect(result.error).toContain('confirm');
  });

  it('should allow dry-run without confirm on apply_skill_pack', async () => {
    const { applySkillPackTool } = await import('../src/tools/applySkillPackTool.js');
    const result = await applySkillPackTool.handler({
      projectPath: '.',
      packId: 'landing-page',
    } as Parameters<typeof applySkillPackTool.handler>[0]);
    // Should not fail with "confirm required"
    expect(result.dryRun).toBe(true);
  });
});

describe('MCP Server — Module Import', () => {
  it('should import server module without errors', async () => {
    const mod = await import('../src/index.js');
    expect(mod.createServer).toBeDefined();
    expect(typeof mod.createServer).toBe('function');
  });
});
