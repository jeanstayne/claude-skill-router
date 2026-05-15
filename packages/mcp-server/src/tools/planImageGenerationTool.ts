import { z } from 'zod';
import {
  ImageGenerationInputSchema,
} from '@claude-skill-router/core/schemas/imageGenerationSchema';
import { runImageGenerationPlan } from '@claude-skill-router/core/image-generation/runImageGenerationPlan';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the target project'),
  userRequest: z.string().min(1).describe('What kind of image is needed'),
  brand: z.string().optional().describe('Brand name for context'),
  provider: z.enum(['gpt-image-2', 'nano-banana']).optional()
    .describe('Target provider (default: auto-recommend based on request)'),
  purpose: z.enum(['hero', 'section', 'ad', 'social', 'background', 'mockup']).optional()
    .describe('Purpose of the image'),
  dryRun: z.boolean().default(true)
    .describe('Dry-run mode (default: true). Generates plan without executing external calls.'),
  confirm: z.boolean().default(false)
    .describe('Explicit confirmation for external execution. Must be true to execute.'),
});

export const planImageGenerationTool = {
  name: 'plan_image_generation',
  description: 'Plan image generation: recommend provider, generate brief, create prompts for all formats, preview command. NEVER executes external generation without confirm:true.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = ImageGenerationInputSchema.parse(rawInput);

    if (!input.dryRun && !input.confirm) {
      return {
        success: false,
        error: 'Execução externa requer confirm: true. Dry-run é o padrão seguro.',
        requiresConfirm: true,
      };
    }

    const plan = runImageGenerationPlan(input);

    // Strip sensitive data from command preview
    if (plan.commandPreview) {
      plan.commandPreview = plan.commandPreview
        .replace(/AIzaSy[A-Za-z0-9_-]+/g, '<API_KEY>')
        .replace(/sk-[A-Za-z0-9]+/g, '<API_KEY>');
    }

    return plan;
  },
};
