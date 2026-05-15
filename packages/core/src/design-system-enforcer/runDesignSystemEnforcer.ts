// Phase 16.2 — Design System Enforcer orchestrator
// Analyzes project, detects hardcoded classes, generates token plan and shadcn variant plan.

import { analyzeDesignSystem, type DesignSystemAnalysis } from './analyzeDesignSystem.js';
import { detectHardcodedVisualClasses, type HardcodedClassIssue } from './detectHardcodedVisualClasses.js';
import { generateDesignTokensPlan, type DesignTokensPlan } from './generateDesignTokensPlan.js';
import { generateShadcnVariantPlan, type ShadcnVariant } from './generateShadcnVariantPlan.js';
import { generateDesignSystemFirstChecklist, type DesignSystemFirstChecklist } from './generateDesignSystemFirstChecklist.js';
import type { BrandTemplate, VisualDirection } from '../schemas/lovablePipelineSchema.js';

export interface DesignSystemEnforcerResult {
  analysis: DesignSystemAnalysis;
  hardcodedIssues: HardcodedClassIssue[];
  tokenPlan: DesignTokensPlan | null;
  shadcnVariantPlan: ShadcnVariant[];
  checklist: DesignSystemFirstChecklist;
  summary: string;
}

export async function runDesignSystemEnforcer(
  projectPath: string,
  tmpl?: BrandTemplate,
  dir?: VisualDirection,
): Promise<DesignSystemEnforcerResult> {
  const analysis = await analyzeDesignSystem(projectPath);
  const hardcodedIssues = await detectHardcodedVisualClasses(projectPath);
  const checklist = generateDesignSystemFirstChecklist();

  let tokenPlan: DesignTokensPlan | null = null;
  if (tmpl && dir) {
    tokenPlan = generateDesignTokensPlan(tmpl, dir);
  }

  let shadcnVariantPlan: ShadcnVariant[] = [];
  if (tmpl) {
    shadcnVariantPlan = generateShadcnVariantPlan(tmpl);
  }

  const issueCount = hardcodedIssues.length;
  const highIssues = hardcodedIssues.filter(i => i.severity === 'high').length;
  const medIssues = hardcodedIssues.filter(i => i.severity === 'medium').length;

  const summary = analysis.hasDesignSystem
    ? `Design system detectado (confiança ${(analysis.confidence * 100).toFixed(0)}%). ${issueCount} classes hardcoded encontradas (${highIssues} high, ${medIssues} medium).`
    : `Design system NÃO detectado. ${analysis.gaps.length} gaps. ${issueCount} classes hardcoded encontradas.`;

  return { analysis, hardcodedIssues, tokenPlan, shadcnVariantPlan, checklist, summary };
}
