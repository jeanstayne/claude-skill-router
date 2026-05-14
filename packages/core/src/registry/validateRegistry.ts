import type { RegistryData } from './loadRegistry.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateRegistry(registry: RegistryData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const skillIds = new Set(registry.skills.map(s => s.id));
  const agentIds = new Set(registry.agents.map(a => a.id));
  const packIds = new Set(registry.packs.map(p => p.id));

  // Check for duplicate skill IDs
  if (skillIds.size !== registry.skills.length) {
    errors.push('Duplicate skill IDs found');
  }

  // Check for duplicate agent IDs
  if (agentIds.size !== registry.agents.length) {
    errors.push('Duplicate agent IDs found');
  }

  // Check for duplicate pack IDs
  if (packIds.size !== registry.packs.length) {
    errors.push('Duplicate pack IDs found');
  }

  // Validate pack references
  for (const pack of registry.packs) {
    // Check skills exist
    for (const skillId of pack.skills) {
      if (!skillIds.has(skillId)) {
        errors.push(`Pack "${pack.id}" references non-existent skill "${skillId}"`);
      }
    }

    // Check agents exist
    for (const agentId of pack.agents) {
      if (!agentIds.has(agentId)) {
        errors.push(`Pack "${pack.id}" references non-existent agent "${agentId}"`);
      }
    }

    // Check optionalSkills exist (warnings only)
    if (pack.optionalSkills) {
      for (const skillId of pack.optionalSkills) {
        if (!skillIds.has(skillId)) {
          warnings.push(`Pack "${pack.id}" has optional skill "${skillId}" that doesn't exist`);
        }
      }
    }

    // Check max limits
    if (pack.skills.length > pack.maxSkills) {
      errors.push(`Pack "${pack.id}" has ${pack.skills.length} skills but maxSkills is ${pack.maxSkills}`);
    }

    if (pack.agents.length > pack.maxAgents) {
      errors.push(`Pack "${pack.id}" has ${pack.agents.length} agents but maxAgents is ${pack.maxAgents}`);
    }

    // Check projectTypes
    if (!pack.projectTypes || pack.projectTypes.length === 0) {
      warnings.push(`Pack "${pack.id}" has no projectTypes defined`);
    }
  }

  // Check skills have required fields
  for (const skill of registry.skills) {
    if (!skill.name) {
      errors.push(`Skill "${skill.id}" has no name`);
    }
    if (!skill.description) {
      warnings.push(`Skill "${skill.id}" has no description`);
    }
    if (!skill.projectTypes || skill.projectTypes.length === 0) {
      warnings.push(`Skill "${skill.id}" has no projectTypes`);
    }
  }

  // Check agents have names
  for (const agent of registry.agents) {
    if (!agent.name || agent.name === agent.id) {
      warnings.push(`Agent "${agent.id}" may not have a proper name defined`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
