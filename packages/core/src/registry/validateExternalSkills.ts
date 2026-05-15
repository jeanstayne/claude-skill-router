import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { ExternalSkillSchema } from '../schemas/externalSkillSchema.js';
import type { ExternalSkill } from '../schemas/externalSkillSchema.js';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  skillsLoaded: number;
}

export async function validateExternalSkills(registryPath: string): Promise<ValidationResult> {
  const externalPath = path.join(registryPath, 'external-skills');
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if directory exists
  try {
    await fs.access(externalPath);
  } catch {
    return { valid: false, errors: ['external-skills directory not found'], warnings: [], skillsLoaded: 0 };
  }

  const files = await fs.readdir(externalPath, { withFileTypes: true });
  const jsonFiles = files.filter(f => f.isFile() && f.name.endsWith('.json'));

  if (jsonFiles.length === 0) {
    return { valid: false, errors: ['No external skill JSON files found'], warnings: [], skillsLoaded: 0 };
  }

  const skills: ExternalSkill[] = [];
  for (const file of jsonFiles) {
    const filePath = path.join(externalPath, file.name);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const raw = JSON.parse(content);

      // Validate required fields
      if (!raw.id) { errors.push(`${file.name}: missing id`); continue; }
      if (!raw.repository) { errors.push(`${file.name}: missing repository`); continue; }
      if (!raw.installCommand) { errors.push(`${file.name}: missing installCommand`); continue; }

      // Check auto-install/execute defaults
      if (raw.autoInstallAllowed === true) {
        errors.push(`${file.name}: autoInstallAllowed must be false by default`);
      }
      if (raw.autoExecuteAllowed === true) {
        errors.push(`${file.name}: autoExecuteAllowed must be false by default`);
      }

      // Risk level checks
      if (raw.requiresExternalCli && raw.riskLevel === 'low') {
        errors.push(`${file.name}: requiresExternalCli=true but riskLevel=low`);
      }
      if (raw.requiresLogin && raw.riskLevel === 'low') {
        errors.push(`${file.name}: requiresLogin=true but riskLevel=low`);
      }
      if (raw.requiresNetwork && raw.autoExecuteAllowed) {
        errors.push(`${file.name}: requiresNetwork=true but autoExecuteAllowed=true`);
      }
      if (raw.riskLevel === 'high' && !raw.requiresExternalCli && !raw.requiresLogin && !raw.requiresNetwork) {
        warnings.push(`${file.name}: riskLevel=high but no external requirement flags set`);
      }

      // Full schema validation
      try {
        const parsed = ExternalSkillSchema.parse(raw);
        skills.push(parsed);
      } catch (zodErr: any) {
        errors.push(`${file.name}: ${zodErr.message}`);
      }
    } catch (parseErr: any) {
      errors.push(`${file.name}: invalid JSON — ${parseErr.message}`);
    }
  }

  // Check for high risk skills
  const highRiskCount = skills.filter(s => s.riskLevel === 'high').length;
  if (highRiskCount > 0) {
    warnings.push(`${highRiskCount} high-risk external skills found. These require explicit confirmation.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    skillsLoaded: skills.length,
  };
}
