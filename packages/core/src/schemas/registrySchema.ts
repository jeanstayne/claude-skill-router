import { z } from 'zod';

export const RegistryEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  category: z.string().optional(),
  projectTypes: z.array(z.string()),
  stacks: z.array(z.string()),
  maxDefaultUse: z.boolean().optional(),
  description: z.string(),
});

export type RegistryEntry = z.infer<typeof RegistryEntrySchema>;
