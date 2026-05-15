import { z } from 'zod';
import { createProductMarketingContext } from '@claude-skill-router/core/lovable-pipeline/createProductMarketingContext';
import { generateVisualDirections } from '@claude-skill-router/core/lovable-pipeline/generateVisualDirections';
import { selectBrandTemplate } from '@claude-skill-router/core/lovable-pipeline/selectBrandTemplate';
import { generateDesignMd } from '@claude-skill-router/core/lovable-pipeline/generateDesignMd';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the target project'),
  userRequest: z.string().min(1).describe('Natural language request from user'),
  stylePreference: z.string().optional().describe('Style preference hint'),
  dryRun: z.boolean().default(true).describe('Preview mode — does not write files (default: true)'),
  confirm: z.boolean().default(false).describe('Required for real writes. Must be true when dryRun is false.'),
});

export const generateDesignMdTool = {
  name: 'generate_design_md',
  description: 'Generate DESIGN.md with full design specification: visual direction, color system, typography, layout, components, image, motion, copy, and accessibility. Writes to .claude/design/DESIGN.md. Dry-run by default.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const ctx = createProductMarketingContext({ userRequest: input.userRequest });
    const { recommended } = generateVisualDirections({ userRequest: input.userRequest, productMarketingContext: ctx, stylePreference: input.stylePreference });
    const { template } = await selectBrandTemplate({ brand: ctx.brand, userRequest: input.userRequest });
    const fallbackTemplate = template || {
      id: 'tech-product-lp', name: 'Tech Product LP',
      segments: [], bestForBrands: [], visualPersonality: ['professional'],
      recommendedPalette: { primary: '#2563eb', accent: '#f59e0b', background: '#ffffff' },
      typography: { headline: 'Inter', body: 'Inter' },
      componentStyle: { buttons: 'rounded-lg', cards: 'shadow-sm', sections: 'py-16' },
      recommendedSections: ['Hero', 'Benefits', 'CTA'], avoid: [],
    };
    const result = await generateDesignMd({
      projectPath: input.projectPath,
      productMarketingContext: ctx,
      selectedVisualDirection: recommended,
      selectedBrandTemplate: fallbackTemplate,
      dryRun: input.dryRun,
      confirm: input.confirm,
    });
    return result as unknown as Record<string, unknown>;
  },
};
