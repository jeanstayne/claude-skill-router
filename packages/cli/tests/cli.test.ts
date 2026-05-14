import { describe, it, expect } from 'vitest';

describe('CLI', () => {
  it('should have scan command', async () => {
    const { scanCommand } = await import('../src/commands/scan.js');
    expect(scanCommand).toBeDefined();
    expect(typeof scanCommand).toBe('function');
  });

  it('should have recommend command', async () => {
    const { recommendCommand } = await import('../src/commands/recommend.js');
    expect(recommendCommand).toBeDefined();
    expect(typeof recommendCommand).toBe('function');
  });

  it('should have apply command', async () => {
    const { applyCommand } = await import('../src/commands/apply.js');
    expect(applyCommand).toBeDefined();
    expect(typeof applyCommand).toBe('function');
  });

  it('should have cleanup command', async () => {
    const { cleanupCommand } = await import('../src/commands/cleanup.js');
    expect(cleanupCommand).toBeDefined();
    expect(typeof cleanupCommand).toBe('function');
  });

  it('should have audit command', async () => {
    const { auditCommand } = await import('../src/commands/audit.js');
    expect(auditCommand).toBeDefined();
    expect(typeof auditCommand).toBe('function');
  });

  it('should have report command', async () => {
    const { reportCommand } = await import('../src/commands/report.js');
    expect(reportCommand).toBeDefined();
    expect(typeof reportCommand).toBe('function');
  });
});
