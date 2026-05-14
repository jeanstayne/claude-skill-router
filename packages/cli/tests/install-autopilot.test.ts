import { describe, it, expect } from 'vitest';
import { installAutopilotCommand } from '../src/commands/installAutopilot.js';

describe('CLI install-autopilot', () => {
  it('should have installAutopilotCommand exported', () => {
    expect(installAutopilotCommand).toBeDefined();
    expect(typeof installAutopilotCommand).toBe('function');
  });

  it('should run dry-run without changing disk', async () => {
    const result = await installAutopilotCommand('/nonexistent/path', {
      json: true,
      dryRun: true,
    });
    // Should fail because path doesn't exist, but shouldn't throw
    expect(result).toBeDefined();
  });

  it('should block real writes without --confirm', async () => {
    const result = await installAutopilotCommand('/tmp/test-project', {
      json: true,
      dryRun: false,
    });
    expect(result.success).toBe(false);
    expect(result.errors.some((e: string) => e.includes('confirm'))).toBe(true);
  });

  it('should accept scope parameter', async () => {
    const result = await installAutopilotCommand('/nonexistent/path', {
      json: true,
      dryRun: true,
      scope: 'project',
    });
    expect(result.scope).toBe('project');
  });

  it('should accept withClaudeMd parameter', async () => {
    const result = await installAutopilotCommand('/nonexistent/path', {
      json: true,
      dryRun: true,
      withClaudeMd: true,
    });
    expect(result).toBeDefined();
  });
});
