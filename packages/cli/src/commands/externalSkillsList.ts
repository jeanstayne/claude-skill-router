import { loadExternalSkills } from '@claude-skill-router/core/registry/loadExternalSkills';
import * as path from 'node:path';

function getRegistryPath(): string {
  return path.resolve(import.meta.dirname, '../../../../registry');
}

export async function externalSkillsListCommand(options: {
  json?: boolean;
  category?: string;
  riskLevel?: string;
} = {}) {
  let skills = await loadExternalSkills(getRegistryPath());

  if (options.category) {
    skills = skills.filter(s => s.category === options.category);
  }
  if (options.riskLevel) {
    skills = skills.filter(s => s.riskLevel === options.riskLevel);
  }

  const output = skills.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    riskLevel: s.riskLevel,
    requiresExternalCli: s.requiresExternalCli,
    requiresLogin: s.requiresLogin,
    installCommand: s.installCommand,
  }));

  if (options.json) {
    console.log(JSON.stringify({ skills: output, total: output.length }, null, 2));
  } else {
    console.log(`External Skills (${output.length} total):\n`);
    for (const s of output) {
      console.log(`  [${s.riskLevel}] ${s.name} (${s.id})`);
      console.log(`    Category: ${s.category} | Ext CLI: ${s.requiresExternalCli ? 'yes' : 'no'}`);
      console.log(`    Install: ${s.installCommand || 'N/A'}`);
      console.log();
    }
  }

  return { skills: output, total: output.length };
}
