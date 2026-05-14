import { loadRegistry } from '../registry/loadRegistry.js';
import { scoreSkills } from './scoreSkills.js';
import * as path from 'node:path';

export interface RecommendInput {
  projectType: string;
  framework: string;
  ui: string[];
  goal?: string;
}

export interface SuggestedDesignEngine {
  id: string;
  name: string;
  reason: string;
}

export interface RecommendOutput {
  recommendedPack: string;
  skills: string[];
  agents: string[];
  reasoning: string[];
  confidence: number;
  suggestedDesignEngines: SuggestedDesignEngine[];
}

function getRegistryPath(): string {
  const dirname = import.meta.dirname;
  return path.resolve(dirname, '../../../../registry');
}

export async function recommendSkills(
  input: RecommendInput,
  registryPath?: string
): Promise<RecommendOutput> {
  const reasoning: string[] = [];

  const resolvedPath = registryPath || getRegistryPath();
  const registry = await loadRegistry(resolvedPath);

  const matchingPacks = registry.packs.filter(p =>
    p.projectTypes.includes(input.projectType) && !p.advanced
  );

  // Prefer pack whose id matches the project type (e.g., "landing-page" pack for "landing-page" projects)
  matchingPacks.sort((a, b) => {
    if (a.id === input.projectType) return -1;
    if (b.id === input.projectType) return 1;
    return 0;
  });

  if (input.projectType !== 'unknown') {
    reasoning.push(`Projeto detectado como ${input.projectType}`);
  }
  if (input.framework && input.framework !== 'unknown') {
    reasoning.push(`Framework: ${input.framework}`);
  }
  if (input.ui.length > 0) {
    reasoning.push(`UI: ${input.ui.join(', ')}`);
  }

  let recommendedPack = 'unknown';
  let skills: string[] = [];
  let agents: string[] = [];
  let confidence = 0;
  const suggestedDesignEngines: SuggestedDesignEngine[] = [];

  if (matchingPacks.length > 0) {
    const pack = matchingPacks[0];
    recommendedPack = pack.id;
    reasoning.push(`Pack recomendado: ${pack.name}`);

    const packSkills = registry.skills.filter(s => pack.skills.includes(s.id));
    const scored = scoreSkills(input.projectType, input.framework, input.ui, packSkills);

    skills = scored
      .filter(s => s.score > 0)
      .slice(0, pack.maxSkills)
      .map(s => s.skillId);

    agents = pack.agents.slice(0, pack.maxAgents);

    if (skills.length === 0) {
      skills = pack.skills.slice(0, 1);
      reasoning.push('Nenhuma skill com score alto — usando skill padrão do pack');
    }

    const maxPossibleScore = packSkills.length * 80;
    const actualScore = scored
      .filter(s => skills.includes(s.skillId))
      .reduce((sum, s) => sum + s.score, 0);
    confidence = maxPossibleScore > 0
      ? Math.min(actualScore / maxPossibleScore + 0.2, 1)
      : 0.5;

    reasoning.push(`Skills recomendadas: ${skills.join(', ')}`);
    reasoning.push(`Agents recomendados: ${agents.join(', ')}`);

    // Suggest design engines from the pack
    if (pack.suggestedDesignEngines && pack.suggestedDesignEngines.length > 0) {
      for (const engineId of pack.suggestedDesignEngines) {
        const engine = registry.designEngines.find(e => e.id === engineId);
        if (engine) {
          const reason = engine.recommendedFor.includes(input.projectType)
            ? engine.useWhen
            : `Referência para ${engine.bestFor.slice(0, 2).join(' e ')}`;
          suggestedDesignEngines.push({ id: engine.id, name: engine.name, reason });
        }
      }
    }
  } else if (input.projectType === 'unknown') {
    reasoning.push('Projeto desconhecido — recomendação conservadora');
    confidence = 0.1;
    skills = [];
    agents = [];
    recommendedPack = 'none';
  }

  return {
    recommendedPack,
    skills,
    agents,
    reasoning,
    confidence: Math.round(confidence * 100) / 100,
    suggestedDesignEngines,
  };
}
