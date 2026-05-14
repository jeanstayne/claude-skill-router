import { z } from 'zod';

export const InstallerManifestSchema = z.object({
  managedBy: z.literal('claude-skill-router'),
  version: z.string(),
  projectType: z.string(),
  activePack: z.string(),
  activeSkills: z.array(z.string()),
  activeAgents: z.array(z.string()),
  lastScan: z.string(),
});

export type InstallerManifest = z.infer<typeof InstallerManifestSchema>;
