export interface ScoreEntry {
  skillId: string;
  score: number;
  reasons: string[];
}

export function scoreSkills(
  projectType: string,
  framework: string,
  ui: string[],
  availableSkills: Array<{
    id: string;
    name: string;
    projectTypes: string[];
    stacks: string[];
    maxDefaultUse?: boolean;
    description: string;
  }>
): ScoreEntry[] {
  const entries: ScoreEntry[] = [];

  for (const skill of availableSkills) {
    let score = 0;
    const reasons: string[] = [];

    // Project type match (highest weight)
    if (skill.projectTypes.includes(projectType)) {
      score += 50;
      reasons.push(`Skill compatível com ${projectType}`);
    }

    // Stack match
    for (const stack of skill.stacks) {
      if (framework === stack) {
        score += 30;
        reasons.push(`Stack compatível: ${framework}`);
        break;
      }
    }

    // UI library match
    const matchingUi = skill.stacks.filter(s => ui.includes(s));
    if (matchingUi.length > 0) {
      score += matchingUi.length * 10;
      reasons.push(`UI compatível: ${matchingUi.join(', ')}`);
    }

    // MaxDefaultUse bonus
    if (skill.maxDefaultUse) {
      score += 5;
      reasons.push('Uso padrão recomendado');
    }

    entries.push({ skillId: skill.id, score, reasons });
  }

  // Sort by score descending
  entries.sort((a, b) => b.score - a.score);

  return entries;
}
