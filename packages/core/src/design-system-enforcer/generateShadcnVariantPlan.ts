// Phase 16.2 — Generate shadcn/ui variant plan based on brand template

import type { BrandTemplate } from '../schemas/lovablePipelineSchema.js';

export interface ShadcnVariant {
  component: string;
  variants: Array<{ name: string; classes: string }>;
}

export function generateShadcnVariantPlan(tmpl: BrandTemplate): ShadcnVariant[] {
  const primary = tmpl.recommendedPalette.primary;
  const accent = tmpl.recommendedPalette.accent;

  return [
    {
      component: 'Button',
      variants: [
        { name: 'default', classes: `bg-[${primary}] text-white hover:bg-[${primary}]/90 shadow-sm` },
        { name: 'accent', classes: `bg-[${accent}] text-white hover:bg-[${accent}]/90 shadow-sm` },
        { name: 'outline', classes: `border-[${primary}]/20 text-[${primary}] hover:bg-[${primary}]/5` },
        { name: 'ghost', classes: `text-[${primary}] hover:bg-[${primary}]/5` },
        { name: 'premium', classes: `bg-gradient-to-r from-[${primary}] to-[${darken(primary, 0.2)}] text-white shadow-lg` },
      ],
    },
    {
      component: 'Card',
      variants: [
        { name: 'default', classes: 'bg-[--color-surface] rounded-lg shadow-sm border-[--color-border]' },
        { name: 'glass', classes: 'bg-white/80 backdrop-blur rounded-xl shadow-card border-white/20' },
        { name: 'premium', classes: `bg-white rounded-xl shadow-premium border-[${primary}]/10` },
        { name: 'interactive', classes: 'bg-white rounded-lg shadow-sm border hover:shadow-card hover:-translate-y-0.5 transition-all' },
      ],
    },
    {
      component: 'Badge',
      variants: [
        { name: 'default', classes: `bg-[${primary}]/10 text-[${primary}] rounded-full px-3 py-1 text-sm font-medium` },
        { name: 'accent', classes: `bg-[${accent}]/10 text-[${accent}] rounded-full px-3 py-1 text-sm font-medium` },
        { name: 'success', classes: 'bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-medium' },
      ],
    },
    {
      component: 'Section',
      variants: [
        { name: 'default', classes: 'py-20 md:py-28' },
        { name: 'alt', classes: 'py-20 md:py-28 bg-[--color-muted]' },
        { name: 'hero', classes: 'min-h-screen flex items-center py-20 md:py-32 bg-gradient-to-b from-white to-[--color-muted]' },
        { name: 'cta', classes: `py-24 md:py-32 bg-gradient-to-r from-[${primary}] to-[${darken(primary, 0.2)}]` },
      ],
    },
    {
      component: 'Hero',
      variants: [
        { name: 'default', classes: 'min-h-[90vh] flex items-center relative overflow-hidden' },
        { name: 'gradient', classes: `min-h-[90vh] flex items-center relative overflow-hidden bg-gradient-to-br from-[${primary}]/5 via-white to-[${accent}]/5` },
        { name: 'image', classes: 'min-h-[90vh] flex items-center relative overflow-hidden' },
      ],
    },
  ];
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
