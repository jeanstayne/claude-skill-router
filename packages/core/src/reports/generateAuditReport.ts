export interface AuditReport {
  timestamp: string;
  policiesChecked: string[];
  violations: Array<{ policy: string; severity: string; description: string; file?: string }>;
  passed: boolean;
}

export function generateAuditReport(report: AuditReport): string {
  // Phase 1+ implementation
  let md = `# Auditoria — ${report.timestamp}\n\n`;
  md += `## Políticas verificadas\n${report.policiesChecked.map(p => `- ${p}`).join('\n')}\n\n`;
  md += `## Violações\n`;
  if (report.violations.length === 0) {
    md += 'Nenhuma violação encontrada.\n';
  } else {
    for (const v of report.violations) {
      md += `- [${v.severity}] ${v.policy}: ${v.description}${v.file ? ` (${v.file})` : ''}\n`;
    }
  }
  md += `\n## Resultado\n${report.passed ? 'Aprovado' : 'Reprovado'}\n`;
  return md;
}
