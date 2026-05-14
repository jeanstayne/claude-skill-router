import { scanProject } from '../scanner/scanProject.js';
import { recommendSkills } from '../recommender/recommendSkills.js';
import { installSkillPack } from '../installer/installSkillPack.js';
import { extractRequestSignals } from './extractRequestSignals.js';
import { classifyIntent } from './classifyIntent.js';
import { selectPackForIntent } from './selectPackForIntent.js';
import { generateExecutionPlan } from './generateExecutionPlan.js';
import type { RouteRequestInput, RouteRequestResult } from '../schemas/requestRouterSchema.js';
import * as path from 'node:path';

function getRegistryPath(): string {
  const dirname = import.meta.dirname;
  return path.resolve(dirname, '../../../../registry');
}

export async function routeRequest(input: Omit<RouteRequestInput, 'dryRun' | 'confirm' | 'mode'> & { dryRun?: boolean; confirm?: boolean; mode?: 'recommend-only' | 'prepare' | 'apply' }): Promise<RouteRequestResult> {
  const warnings: string[] = [];
  const { projectPath, userRequest, explicitPack } = input;
  const dryRun = input.dryRun !== false;
  const confirm = input.confirm === true;
  const mode = input.mode || 'recommend-only';

  // Block mutation without confirm
  if (!dryRun && !confirm) {
    return {
      success: false,
      intent: 'unknown',
      requestSignals: { visualStyle: [], businessGoal: [], keywords: [], mentionsDesignEngine: [], mentionsStack: [], confidence: 0 },
      selectedPack: 'none',
      skills: [], agents: [], suggestedDesignEngines: [],
      executionPlan: [],
      dryRun: false, requiresConfirm: true,
      warnings: ['Mutation requires confirm=true when dryRun is false'],
    };
  }

  // 1. Scan project
  const projectScan = await scanProject(projectPath);

  // 2. Extract signals from natural language request
  const requestSignals = extractRequestSignals({
    userRequest,
    projectPath,
    explicitGoal: undefined,
  });

  // 3. Classify intent
  const { intent, confidence: intentConfidence } = classifyIntent({
    userRequest,
    signals: requestSignals,
    projectScan,
  });

  if (intentConfidence < 0.3) {
    warnings.push('Baixa confiança na classificação da intenção — recomendação conservadora');
  }

  // 4. Select pack for intent
  const selectResult = selectPackForIntent({
    intent,
    projectType: projectScan.projectType,
    framework: projectScan.framework,
    ui: projectScan.ui,
    signals: requestSignals,
    explicitPack,
    allowAdvanced: mode === 'prepare' || mode === 'apply' || explicitPack !== undefined,
  });

  if (selectResult.packId === 'none' && intent !== 'unknown') {
    warnings.push(`Nenhum pack encontrado para intenção: ${intent}`);
  }

  // 5. Get recommendation
  let skills: string[] = [];
  let agents: string[] = [];
  const selectedPack = selectResult.packId;
  let suggestedDesignEngines: RouteRequestResult['suggestedDesignEngines'] = [];

  if (selectedPack !== 'none') {
    const recommendation = await recommendSkills(
      {
        projectType: projectScan.projectType,
        framework: projectScan.framework,
        ui: projectScan.ui,
      },
      getRegistryPath()
    );

    // Use recommendation, but override pack if explicitly selected
    if (explicitPack || selectResult.packId !== recommendation.recommendedPack) {
      // Re-recommend with the selected pack's skills
      const registry = await (await import('../registry/loadRegistry.js')).loadRegistry(getRegistryPath());
      const pack = registry.packs.find(p => p.id === selectedPack);
      if (pack) {
        skills = pack.skills.slice(0, pack.maxSkills);
        agents = pack.agents.slice(0, pack.maxAgents);
        if (pack.suggestedDesignEngines) {
          for (const engineId of pack.suggestedDesignEngines) {
            const engine = registry.designEngines.find(e => e.id === engineId);
            if (engine) {
              suggestedDesignEngines.push({
                id: engine.id,
                name: engine.name,
                reason: engine.recommendedFor.includes(projectScan.projectType)
                  ? engine.useWhen
                  : `Referência para ${engine.bestFor.slice(0, 2).join(' e ')}`,
              });
            }
          }
        }
      } else {
        skills = recommendation.skills;
        agents = recommendation.agents;
        suggestedDesignEngines = recommendation.suggestedDesignEngines;
      }
    } else {
      skills = recommendation.skills;
      agents = recommendation.agents;
      suggestedDesignEngines = recommendation.suggestedDesignEngines;
    }
  }

  // 6. Generate execution plan
  const executionPlan = generateExecutionPlan({
    intent,
    selectedPack,
    isDryRun: dryRun,
    requiresConfirm: !dryRun,
  });

  // 7. Apply if mode is 'apply' and dryRun is false
  let applied = false;
  if (mode === 'apply' && !dryRun && confirm && selectedPack !== 'none') {
    const installResult = await installSkillPack({
      targetProjectPath: projectPath,
      packId: selectedPack,
      dryRun: false,
    });
    applied = installResult.success;
    if (!installResult.success) {
      warnings.push(`Falha ao aplicar pack: ${installResult.errors.join(', ')}`);
    }
  }

  return {
    success: true,
    intent,
    requestSignals,
    projectScan,
    selectedPack,
    skills,
    agents,
    suggestedDesignEngines,
    executionPlan,
    dryRun,
    requiresConfirm: !dryRun,
    applied: mode === 'apply' ? applied : undefined,
    warnings,
  };
}
