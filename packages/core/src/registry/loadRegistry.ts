import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface DesignEngine {
  id: string;
  name: string;
  category: string;
  bestFor: string[];
  integrationType: string[];
  recommendedFor: string[];
  riskLevel: string;
  useWhen: string;
  doNotUseWhen: string;
  notes: string;
}

export interface RegistryData {
  skills: Array<{
    id: string; name: string; version: string; category?: string;
    projectTypes: string[]; stacks: string[]; maxDefaultUse?: boolean;
    description: string; skillMdPath?: string;
  }>;
  agents: Array<{ id: string; name: string; filePath: string; content?: string }>;
  packs: Array<{
    id: string; name: string; description?: string; projectTypes: string[];
    skills: string[]; agents: string[]; prompts?: string[]; optionalSkills?: string[];
    maxSkills: number; maxAgents: number; suggestedDesignEngines?: string[];
    advanced?: boolean; note?: string;
  }>;
  designEngines: DesignEngine[];
}

export async function loadRegistry(registryPath: string): Promise<RegistryData> {
  const skills: RegistryData['skills'] = [];
  const agents: RegistryData['agents'] = [];
  const packs: RegistryData['packs'] = [];
  const designEngines: RegistryData['designEngines'] = [];

  // Load design engines
  const enginesPath = path.join(registryPath, 'design-engines');
  try {
    const engineFiles = await fs.readdir(enginesPath, { withFileTypes: true });
    for (const file of engineFiles) {
      if (!file.isFile() || !file.name.endsWith('.json')) continue;
      try {
        const content = await fs.readFile(path.join(enginesPath, file.name), 'utf-8');
        const engine = JSON.parse(content);
        designEngines.push({
          id: engine.id, name: engine.name, category: engine.category || 'design-engine',
          bestFor: engine.bestFor || [], integrationType: engine.integrationType || [],
          recommendedFor: engine.recommendedFor || [], riskLevel: engine.riskLevel || 'low',
          useWhen: engine.useWhen || '', doNotUseWhen: engine.doNotUseWhen || '', notes: engine.notes || '',
        });
      } catch { /* skip */ }
    }
  } catch { /* no engines dir */ }

  // Load skills
  const skillsPath = path.join(registryPath, 'skills');
  try {
    const skillDirs = await fs.readdir(skillsPath, { withFileTypes: true });
    for (const dir of skillDirs) {
      if (!dir.isDirectory() || dir.name.startsWith('.')) continue;
      try {
        const metaContent = await fs.readFile(path.join(skillsPath, dir.name, 'metadata.json'), 'utf-8');
        const meta = JSON.parse(metaContent);
        skills.push({
          id: meta.id, name: meta.name, version: meta.version, category: meta.category,
          projectTypes: meta.projectTypes || [], stacks: meta.stacks || [],
          maxDefaultUse: meta.maxDefaultUse, description: meta.description,
          skillMdPath: path.join(skillsPath, dir.name, 'SKILL.md'),
        });
      } catch { /* skip */ }
    }
  } catch { /* no skills dir */ }

  // Load agents
  const agentsPath = path.join(registryPath, 'agents');
  try {
    const agentFiles = await fs.readdir(agentsPath, { withFileTypes: true });
    for (const file of agentFiles) {
      if (!file.isFile() || !file.name.endsWith('.md')) continue;
      const agentId = file.name.replace('.md', '');
      const fp = path.join(agentsPath, file.name);
      try {
        const content = await fs.readFile(fp, 'utf-8');
        const nm = content.match(/^#\s+(.+)$/m);
        agents.push({ id: agentId, name: nm ? nm[1] : agentId, filePath: fp, content });
      } catch { agents.push({ id: agentId, name: agentId, filePath: fp }); }
    }
  } catch { /* no agents dir */ }

  // Load packs
  const packsPath = path.join(registryPath, 'packs');
  try {
    const packFiles = await fs.readdir(packsPath, { withFileTypes: true });
    for (const file of packFiles) {
      if (!file.isFile() || !file.name.endsWith('.json')) continue;
      try {
        const pc = JSON.parse(await fs.readFile(path.join(packsPath, file.name), 'utf-8'));
        packs.push({
          id: pc.id, name: pc.name, description: pc.description,
          projectTypes: pc.projectTypes || [], skills: pc.skills || [], agents: pc.agents || [],
          prompts: pc.prompts || [], optionalSkills: pc.optionalSkills || [],
          maxSkills: pc.maxSkills || 3, maxAgents: pc.maxAgents || 3,
          suggestedDesignEngines: pc.suggestedDesignEngines || [],
          advanced: pc.advanced || false, note: pc.note,
        });
      } catch { /* skip */ }
    }
  } catch { /* no packs dir */ }

  return { skills, agents, packs, designEngines };
}
