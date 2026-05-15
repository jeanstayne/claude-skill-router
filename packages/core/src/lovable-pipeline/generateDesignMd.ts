// Phase 15.8 — DESIGN.md Generator
// Generates DESIGN.md content and optionally writes to .claude/design/DESIGN.md

import type { DesignMd, ProductMarketingContext, VisualDirection, BrandTemplate } from '../schemas/lovablePipelineSchema.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

interface GenerateDesignMdInput {
  projectPath: string;
  productMarketingContext: ProductMarketingContext;
  selectedVisualDirection: VisualDirection;
  selectedBrandTemplate: BrandTemplate;
  dryRun: boolean;
  confirm: boolean;
}

function generateContent(input: GenerateDesignMdInput): string {
  const { productMarketingContext: ctx, selectedVisualDirection: dir, selectedBrandTemplate: tmpl } = input;

  const sections = [
    `# DESIGN.md — ${ctx.brand}`,
    '',
    '> Gerado pelo Lovable-Style Design Pipeline do claude-skill-router.',
    '> Este arquivo define a direção visual e de design do projeto.',
    '',
    '## Product Marketing Context',
    '',
    `- **Marca**: ${ctx.brand}`,
    `- **Produto/Serviço**: ${ctx.productOrService}`,
    `- **Audiência**: ${ctx.audience}`,
    `- **Dor principal**: ${ctx.primaryPain}`,
    `- **Desejo principal**: ${ctx.primaryDesire}`,
    `- **Oferta**: ${ctx.offer}`,
    `- **Diferenciais**: ${ctx.differentiators.map(d => `"${d}"`).join(', ')}`,
    `- **Objeções**: ${ctx.objections.map(o => `"${o}"`).join(', ')}`,
    `- **Tom de voz**: ${ctx.toneOfVoice}`,
    `- **Meta de conversão**: ${ctx.conversionGoal}`,
    '',
    '## Visual Direction Selected',
    '',
    `**${dir.name}** — ${dir.summary}`,
    '',
    `- **Mood**: ${dir.mood.join(', ')}`,
    `- **Best for**: ${dir.bestFor.join('; ')}`,
    '',
    '## Brand Template',
    '',
    `**${tmpl.name}**`,
    '',
    `- **Personalidade visual**: ${tmpl.visualPersonality.join(', ')}`,
    `- **Segmentos**: ${tmpl.segments.join(', ')}`,
    '',
    '## Visual Personality',
    '',
    ...tmpl.visualPersonality.map(p => `- ${p}`),
    '',
    '## Color System',
    '',
    `- **Primary**: ${tmpl.recommendedPalette.primary}`,
    `- **Accent**: ${tmpl.recommendedPalette.accent}`,
    `- **Background**: ${tmpl.recommendedPalette.background}`,
    '',
    `**Estratégia de cor**: ${dir.colorStrategy}`,
    '',
    '## Typography',
    '',
    `- **Headline**: ${tmpl.typography.headline}`,
    `- **Body**: ${tmpl.typography.body}`,
    '',
    `**Estratégia tipográfica**: ${dir.typographyStrategy}`,
    '',
    '## Layout System',
    '',
    dir.layoutStrategy,
    '',
    '## Component System',
    '',
    `- **Botões**: ${tmpl.componentStyle.buttons}`,
    `- **Cards**: ${tmpl.componentStyle.cards}`,
    `- **Seções**: ${tmpl.componentStyle.sections}`,
    '',
    `**Estilo de componentes**: ${dir.componentStyle}`,
    '',
    '## Section Patterns',
    '',
    ...tmpl.recommendedSections.map((s, i) => `${i + 1}. ${s}`),
    '',
    '## Image Direction',
    '',
    dir.imageStyle,
    '',
    '## Motion Direction',
    '',
    dir.motionStyle,
    '',
    '## Copy Direction',
    '',
    `Tom de voz: **${ctx.toneOfVoice}**`,
    'Headlines curtas e impactantes. CTAs com verbos de ação.',
    `Abordar objeções: ${ctx.objections.join(', ')}.`,
    '',
    '## Accessibility Notes',
    '',
    '- Contraste mínimo WCAG AA (4.5:1 para texto normal)',
    '- Todos os elementos interativos com focus visible',
    '- Imagens com alt text descritivo',
    '- Formulários com labels e error states claros',
    '- Navegação por teclado funcional',
    '',
    '## Do Not Use',
    '',
    ...(tmpl.avoid || ['Genérico', 'Stock photos']).map(a => `- ${a}`),
    '',
    ...dir.avoid.map(a => `- ${a}`),
    '',
    '## Implementation Notes',
    '',
    '- Seguir plano component-first',
    '- Implementar animações com framer-motion (React) ou CSS transitions',
    '- Usar CSS custom properties para tokens de design',
    '- Design system no `index.css` ou `tailwind.config`',
    '- Testar nos breakpoints: 390px (mobile), 768px (tablet), 1280px (desktop)',
  ];

  return sections.join('\n');
}

export async function generateDesignMd(input: GenerateDesignMdInput): Promise<DesignMd> {
  const { projectPath, dryRun, confirm } = input;
  const targetDir = path.join(projectPath, '.claude', 'design');
  const targetPath = path.join(targetDir, 'DESIGN.md');
  const content = generateContent(input);

  const sections = [
    { title: 'Product Marketing Context', content: '' },
    { title: 'Visual Direction Selected', content: '' },
    { title: 'Brand Template', content: '' },
    { title: 'Visual Personality', content: '' },
    { title: 'Color System', content: '' },
    { title: 'Typography', content: '' },
    { title: 'Layout System', content: '' },
    { title: 'Component System', content: '' },
    { title: 'Section Patterns', content: '' },
    { title: 'Image Direction', content: '' },
    { title: 'Motion Direction', content: '' },
    { title: 'Copy Direction', content: '' },
    { title: 'Accessibility Notes', content: '' },
    { title: 'Do Not Use', content: '' },
    { title: 'Implementation Notes', content: '' },
  ];

  let wouldCreate = false;

  if (!dryRun && confirm) {
    // Backup existing file if any
    try {
      await fs.access(targetPath);
      const backupPath = targetPath + `.backup-${Date.now()}.md`;
      await fs.copyFile(targetPath, backupPath);
    } catch {
      // No existing file to backup
    }

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(targetPath, content, 'utf-8');
    wouldCreate = true;
  } else if (dryRun) {
    wouldCreate = true; // Would be created if confirmed
  }

  return {
    path: targetPath,
    content,
    wouldCreate,
    sections,
  };
}
