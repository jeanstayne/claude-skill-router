import type { ExecutionPlanStep } from '../schemas/requestRouterSchema.js';

interface PlanInput {
  intent: string;
  selectedPack: string;
  isDryRun: boolean;
  requiresConfirm: boolean;
}

export function generateExecutionPlan(input: PlanInput): ExecutionPlanStep[] {
  const steps: ExecutionPlanStep[] = [];

  if (input.intent === 'unknown') {
    steps.push({
      id: 'analyze', title: 'Analisar projeto para determinar necessidades',
      required: true, mutation: false,
    });
    steps.push({
      id: 'report', title: 'Gerar relatório de análise sem aplicar alterações',
      required: true, mutation: false,
    });
    return steps;
  }

  if (input.intent === 'review-visual-quality' || input.intent === 'improve-copy') {
    steps.push({
      id: 'scan', title: 'Escanear projeto atual',
      required: true, mutation: false,
    });
    steps.push({
      id: 'recommend', title: `Selecionar skills para: ${input.intent}`,
      required: true, mutation: false,
    });
    steps.push({
      id: 'review', title: 'Executar revisão sem aplicar mudanças',
      required: true, mutation: false,
    });
    return steps;
  }

  // Default creation/improvement flow
  steps.push({
    id: 'scan', title: 'Escanear projeto',
    required: true, mutation: false,
  });
  steps.push({
    id: 'recommend', title: 'Selecionar pack por intenção',
    required: true, mutation: false,
  });
  steps.push({
    id: 'apply-dry-run',
    title: 'Simular aplicação das skills',
    required: true, mutation: false,
  });

  if (input.isDryRun) {
    steps.push({
      id: 'review-plan',
      title: 'Revisar plano de aplicação antes de confirmar',
      required: true, mutation: false,
    });
  } else {
    steps.push({
      id: 'apply-confirmed',
      title: 'Aplicar skills com confirmação',
      required: false, mutation: true, requiresConfirm: true,
    });
  }

  steps.push({
    id: 'implement',
    title: 'Implementar usando as skills recomendadas',
    required: false, mutation: true, requiresConfirm: false,
  });
  steps.push({
    id: 'validate',
    title: 'Rodar validações (QA visual, lint, build)',
    required: false, mutation: false,
  });

  return steps;
}
