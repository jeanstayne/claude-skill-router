export interface PhaseReport {
  phase: string;
  title: string;
  objective: string;
  filesCreated: string[];
  filesModified: string[];
  testsExecuted: string[];
  testResults: string;
  typecheck: string;
  lint: string;
  build: string;
  policyGuard: string;
  problemsFound: string[];
  fixesApplied: string[];
  risks: string[];
  pending: string[];
  preExistingErrors: string[];
  introducedErrors: string[];
  status: 'completed' | 'partial' | 'blocked';
}

export function generatePhaseReport(report: PhaseReport): string {
  // Phase 1+ implementation
  let md = `# Relatório da Fase ${report.phase} — ${report.title}\n\n`;
  md += `## Objetivo da fase\n${report.objective}\n\n`;
  md += `## Arquivos criados\n${report.filesCreated.map(f => `- ${f}`).join('\n')}\n\n`;
  md += `## Arquivos alterados\n${report.filesModified.map(f => `- ${f}`).join('\n')}\n\n`;
  md += `## Testes executados\n${report.testsExecuted.join(', ') || 'Nenhum'}\n\n`;
  md += `## Resultado dos testes\n${report.testResults}\n\n`;
  md += `## Typecheck\n${report.typecheck}\n\n`;
  md += `## Lint\n${report.lint}\n\n`;
  md += `## Build\n${report.build}\n\n`;
  md += `## Policy Guard\n${report.policyGuard}\n\n`;
  md += `## Problemas encontrados\n${report.problemsFound.map(p => `- ${p}`).join('\n')}\n\n`;
  md += `## Correções aplicadas\n${report.fixesApplied.map(f => `- ${f}`).join('\n')}\n\n`;
  md += `## Riscos\n${report.risks.map(r => `- ${r}`).join('\n')}\n\n`;
  md += `## Pendências\n${report.pending.map(p => `- ${p}`).join('\n')}\n\n`;
  md += `## Erros existentes antes da fase\n${report.preExistingErrors.map(e => `- ${e}`).join('\n')}\n\n`;
  md += `## Erros introduzidos nesta fase\n${report.introducedErrors.map(e => `- ${e}`).join('\n')}\n\n`;
  md += `## Status final\n${report.status}\n`;
  return md;
}
