import { describe, it, expect } from 'vitest';

describe('Policy', () => {
  it('should run policy guard', async () => {
    const { runPolicyGuard } = await import('../src/policy/runPolicyGuard.js');
    const result = await runPolicyGuard('.');
    expect(result).toHaveProperty('passed');
    expect(result).toHaveProperty('violations');
    expect(result).toHaveProperty('rulesChecked');
    expect(result.rulesChecked.length).toBeGreaterThan(0);
  });

  it('should parse policy results', async () => {
    const { parsePolicyResults } = await import('../src/policy/parsePolicyResults.js');
    const parsed = parsePolicyResults({
      passed: true,
      violations: [],
      rulesChecked: ['no-secret-hardcode'],
    });
    expect(parsed.summary).toContain('passed');
    expect(parsed.highCount).toBe(0);
  });

  it('should detect high violations in parsing', async () => {
    const { parsePolicyResults } = await import('../src/policy/parsePolicyResults.js');
    const parsed = parsePolicyResults({
      passed: false,
      violations: [
        { ruleId: 'no-secret-hardcode', severity: 'high', description: 'Found API key' },
      ],
      rulesChecked: ['no-secret-hardcode'],
    });
    expect(parsed.summary).toContain('failed');
    expect(parsed.highCount).toBe(1);
  });
});
