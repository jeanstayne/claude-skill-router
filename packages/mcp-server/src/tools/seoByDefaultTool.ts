import { z } from 'zod';
import { runSeoByDefault } from '@claude-skill-router/core/seo-by-default/runSeoByDefault';
import { ProductMarketingContextSchema } from '@claude-skill-router/core/schemas/lovablePipelineSchema';

const InputSchema = z.object({
  projectPath: z.string().min(1).describe('Path to the target project'),
  context: ProductMarketingContextSchema.describe('Product marketing context'),
  baseUrl: z.string().optional().describe('Production URL for canonical/hreflang'),
  imageUrl: z.string().optional().describe('Open Graph image URL'),
  phone: z.string().optional().describe('Business phone for LocalBusiness JSON-LD'),
  email: z.string().optional().describe('Contact email'),
  price: z.string().optional().describe('Product price for Product JSON-LD'),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional().describe('FAQs for FAQPage JSON-LD'),
  applicationCategory: z.string().optional().describe('Application category for SoftwareApplication JSON-LD'),
});

export const seoByDefaultTool = {
  name: 'seo_by_default',
  description: 'Generate SEO plan: title, meta description, OG/Twitter cards, metadata plan (canonical/robots/viewport), JSON-LD structured data (Organization, LocalBusiness, Product, FAQPage, SoftwareApplication, Article), and semantic HTML checklist.',
  inputSchema: InputSchema,
  handler: async (rawInput: z.infer<typeof InputSchema>) => {
    const input = InputSchema.parse(rawInput);
    const result = await runSeoByDefault(input.projectPath, input.context, {
      baseUrl: input.baseUrl,
      imageUrl: input.imageUrl,
      phone: input.phone,
      email: input.email,
      price: input.price,
      faqs: input.faqs,
      applicationCategory: input.applicationCategory,
    });
    return result as unknown as Record<string, unknown>;
  },
};
