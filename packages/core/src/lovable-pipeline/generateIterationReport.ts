// Phase 15.11 — Iteration Report Generator
// Generates a comprehensive iteration report summarizing all pipeline steps and outputs.

import type {
  IterationReport,
  ProductMarketingContext,
  VisualDirection,
  BrandTemplate,
  DesignMd,
  ComponentFirstPlan,
  VisualQaPlan,
} from '../schemas/lovablePipelineSchema.js';

interface GenerateIterationReportInput {
  userRequest: string;
  intent: string;
  productMarketingContext: ProductMarketingContext;
  visualDirections: VisualDirection[];
  selectedDirection: VisualDirection;
  brandTemplate: BrandTemplate;
  designMd: DesignMd;
  componentFirstPlan: ComponentFirstPlan;
  visualQaPlan: VisualQaPlan;
}

export function generateIterationReport(input: GenerateIterationReportInput): IterationReport {
  const {
    userRequest,
    intent,
    productMarketingContext: ctx,
    visualDirections,
    selectedDirection,
    brandTemplate: tmpl,
    designMd,
    componentFirstPlan,
    visualQaPlan,
  } = input;

  const warnings: string[] = [];

  // Generate next steps based on pipeline output
  const nextSteps: string[] = [
    `Revisar e aprovar a direção visual "${selectedDirection.name}"`,
    `Aplicar DesignMd ao projeto (${designMd.path})`,
    'Implementar componentes na ordem do Component-First Plan',
    'Executar Visual QA Plan antes da entrega final',
    'Coletar feedback do cliente/stakeholder na primeira iteração',
  ];

  // Add direction-specific next steps
  if (designMd.wouldCreate) {
    nextSteps.unshift(`DESIGN.md criado em ${designMd.path} — revisar antes de implementar`);
  }

  // Detect risks
  const risks: string[] = [];

  const highSeverityQAChecks = visualQaPlan.checks.filter(c => c.severity === 'high').length;
  if (highSeverityQAChecks > 5) {
    risks.push(`${highSeverityQAChecks} checks de QA de alta severidade pendentes — priorizar antes do deploy`);
  }

  if (componentFirstPlan.components.length > 10) {
    risks.push(`${componentFirstPlan.components.length} componentes planejados — considere dividir em múltiplas iterações`);
  }

  // Visual direction risks
  if (selectedDirection.id === 'editorial-clean') {
    risks.push('Direção editorial clean pode não performar bem em landing pages de conversão direta — monitorar taxa de conversão');
  } else if (selectedDirection.id === 'conversao-impacto') {
    risks.push('Direção de conversão de impacto pode parecer agressiva para marcas premium — validar com stakeholders');
  }

  // Brand template confidence warning
  if (!tmpl.id || tmpl.id === 'tech-product-lp') {
    warnings.push('Template de marca é fallback genérico — considere criar template customizado');
  }

  // Visual direction count validation
  if (visualDirections.length < 3) {
    warnings.push(`Apenas ${visualDirections.length} direções visuais geradas — ideal são 3 para comparação`);
  }

  return {
    userRequest,
    intent,
    productMarketingContext: ctx,
    visualDirections,
    selectedDirection,
    brandTemplate: tmpl,
    designMd,
    componentFirstPlan,
    visualQaPlan,
    nextSteps,
    risks,
    warnings,
  };
}
