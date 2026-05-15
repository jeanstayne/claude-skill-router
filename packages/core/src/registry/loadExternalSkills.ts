import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { ExternalSkillSchema, type ExternalSkill } from '../schemas/externalSkillSchema.js';

export async function loadExternalSkills(registryPath: string): Promise<ExternalSkill[]> {
  const externalPath = path.join(registryPath, 'external-skills');
  const skills: ExternalSkill[] = [];

  try {
    const files = await fs.readdir(externalPath, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith('.json')) continue;
      try {
        const content = await fs.readFile(path.join(externalPath, file.name), 'utf-8');
        const raw = JSON.parse(content);
        const parsed = ExternalSkillSchema.parse(raw);
        skills.push(parsed);
      } catch {
        // Skip invalid files
      }
    }
  } catch {
    // No external-skills dir yet
  }

  return skills;
}
