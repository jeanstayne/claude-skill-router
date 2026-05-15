// Phase 16.4 — Recommend best sandbox template for a project

import { loadSandboxTemplates, type SandboxTemplate } from './loadSandboxTemplates.js';

export interface TemplateRecommendation {
  template: SandboxTemplate;
  score: number;
  reasons: string[];
}

export interface RecommendSandboxTemplateResult {
  recommendations: TemplateRecommendation[];
  topPick: TemplateRecommendation | null;
}

export async function recommendSandboxTemplate(opts: {
  projectType?: string;
  framework?: string;
  language?: string;
  needsUi?: boolean;
  needsApi?: boolean;
  needsDatabase?: boolean;
  registryPath?: string;
}): Promise<RecommendSandboxTemplateResult> {
  const templates = await loadSandboxTemplates(opts.registryPath);
  const recommendations: TemplateRecommendation[] = [];

  for (const tpl of templates) {
    let score = 0;
    const reasons: string[] = [];

    if (opts.projectType && tpl.recommendedFor.includes(opts.projectType)) {
      score += 3;
      reasons.push(`Recomendado para projectType="${opts.projectType}"`);
    }

    if (opts.framework && tpl.framework === opts.framework) {
      score += 3;
      reasons.push(`Framework "${opts.framework}" compatível`);
    }

    if (opts.language && tpl.language === opts.language) {
      score += 2;
      reasons.push(`Linguagem "${opts.language}" compatível`);
    }

    if (opts.needsUi && tpl.ui.length > 0) {
      score += 2;
      reasons.push(`Inclui UI: ${tpl.ui.join(', ')}`);
    } else if (opts.needsUi === false && tpl.ui.length === 0) {
      score += 1;
      reasons.push('Minimal (sem UI lib)');
    }

    if (opts.needsApi && tpl.framework === 'nextjs' && tpl.id !== 'astro-landing') {
      score += 2;
      reasons.push('Suporta API routes');
    }

    if (opts.needsDatabase && tpl.id === 'nextjs-api') {
      score += 3;
      reasons.push('Inclui Prisma + PostgreSQL setup');
    }

    if (score > 0) {
      recommendations.push({ template: tpl, score, reasons });
    }
  }

  recommendations.sort((a, b) => b.score - a.score);

  return {
    recommendations,
    topPick: recommendations[0] ?? null,
  };
}
