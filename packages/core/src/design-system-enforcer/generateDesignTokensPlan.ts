// Phase 16.2 — Generate semantic design tokens plan based on brand template and visual direction

import type { BrandTemplate, VisualDirection } from '../schemas/lovablePipelineSchema.js';

export interface TokenGroup {
  name: string;
  tokens: Array<{ name: string; value: string; description: string }>;
}

export interface DesignTokensPlan {
  colors: TokenGroup;
  gradients: TokenGroup;
  shadows: TokenGroup;
  radius: TokenGroup;
  motion: TokenGroup;
  typography: TokenGroup;
}

export function generateDesignTokensPlan(tmpl: BrandTemplate, _dir: VisualDirection): DesignTokensPlan {
  return {
    colors: {
      name: 'Colors',
      tokens: [
        { name: '--color-primary', value: tmpl.recommendedPalette.primary, description: 'Cor principal da marca' },
        { name: '--color-accent', value: tmpl.recommendedPalette.accent, description: 'Cor de destaque para CTAs e elementos interativos' },
        { name: '--color-background', value: tmpl.recommendedPalette.background, description: 'Cor de fundo principal' },
        { name: '--color-surface', value: brighten(tmpl.recommendedPalette.background, 0.02), description: 'Superfície elevada (cards, modals)' },
        { name: '--color-muted', value: darken(tmpl.recommendedPalette.background, 0.05), description: 'Fundo alternativo sutil' },
        { name: '--color-text-primary', value: '#111827', description: 'Texto principal (alto contraste)' },
        { name: '--color-text-secondary', value: '#6b7280', description: 'Texto secundário' },
        { name: '--color-text-muted', value: '#9ca3af', description: 'Texto de baixa ênfase' },
        { name: '--color-border', value: '#e5e7eb', description: 'Bordas padrão' },
        { name: '--color-border-focus', value: tmpl.recommendedPalette.primary, description: 'Borda de foco visível' },
      ],
    },
    gradients: {
      name: 'Gradients',
      tokens: [
        { name: '--gradient-hero', value: `linear-gradient(135deg, ${tmpl.recommendedPalette.primary}, ${darken(tmpl.recommendedPalette.primary, 0.3)})`, description: 'Gradiente para hero section' },
        { name: '--gradient-cta', value: `linear-gradient(135deg, ${tmpl.recommendedPalette.accent}, ${darken(tmpl.recommendedPalette.accent, 0.15)})`, description: 'Gradiente para CTAs' },
        { name: '--gradient-section', value: `linear-gradient(180deg, ${tmpl.recommendedPalette.background}, ${darken(tmpl.recommendedPalette.background, 0.03)})`, description: 'Gradiente sutil entre seções' },
      ],
    },
    shadows: {
      name: 'Shadows',
      tokens: [
        { name: '--shadow-sm', value: '0 1px 2px rgba(0,0,0,0.06)', description: 'Sombra sutil para cards baixos' },
        { name: '--shadow-card', value: '0 4px 12px rgba(0,0,0,0.08)', description: 'Sombra padrão para cards' },
        { name: '--shadow-elevated', value: '0 8px 24px rgba(0,0,0,0.12)', description: 'Sombra para elementos elevados (modals, dropdowns)' },
        { name: '--shadow-premium', value: '0 12px 40px rgba(0,0,0,0.15)', description: 'Sombra premium para hero ou elementos destaque' },
      ],
    },
    radius: {
      name: 'Border Radius',
      tokens: [
        { name: '--radius-sm', value: '4px', description: 'Bordas sutis (inputs, badges)' },
        { name: '--radius-card', value: '8px', description: 'Bordas de cards' },
        { name: '--radius-component', value: '12px', description: 'Bordas de componentes maiores (modals)' },
        { name: '--radius-full', value: '9999px', description: 'Bordas fully rounded (pills, avatars)' },
      ],
    },
    motion: {
      name: 'Motion',
      tokens: [
        { name: '--motion-duration-fast', value: '150ms', description: 'Transições rápidas (hover, focus)' },
        { name: '--motion-duration-normal', value: '300ms', description: 'Transições padrão' },
        { name: '--motion-duration-slow', value: '500ms', description: 'Transições lentas (page transitions)' },
        { name: '--motion-ease-out', value: 'cubic-bezier(0.22, 1, 0.36, 1)', description: 'Easing padrão do projeto' },
        { name: '--motion-ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)', description: 'Easing simétrico' },
      ],
    },
    typography: {
      name: 'Typography',
      tokens: [
        { name: '--font-headline', value: tmpl.typography.headline, description: 'Fonte para headlines' },
        { name: '--font-body', value: tmpl.typography.body, description: 'Fonte para corpo de texto' },
        { name: '--text-headline-xl', value: 'clamp(2.5rem, 5vw, 4rem)', description: 'Headline principal (hero)' },
        { name: '--text-headline-lg', value: 'clamp(1.75rem, 3vw, 2.5rem)', description: 'Headline de seção' },
        { name: '--text-headline-md', value: '1.5rem', description: 'Headline de card' },
        { name: '--text-body', value: '1rem', description: 'Texto corpo padrão' },
        { name: '--text-small', value: '0.875rem', description: 'Texto auxiliar' },
      ],
    },
  };
}

function brighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darken(hex: string, amount: number): string {
  return brighten(hex, -amount);
}
