// Phase 16.3 — Generate SEO plan: titles, meta descriptions, OG, Twitter cards

export interface SeoTag {
  name: string;
  content: string;
  maxLength?: number;
  currentLength?: number;
}

export interface SeoPlan {
  title: SeoTag;
  metaDescription: SeoTag;
  ogTitle: SeoTag;
  ogDescription: SeoTag;
  ogImage: SeoTag;
  ogType: SeoTag;
  twitterCard: SeoTag;
  twitterTitle: SeoTag;
  twitterDescription: SeoTag;
  twitterImage: SeoTag;
  additionalTags: SeoTag[];
  warnings: string[];
}

const TITLE_MAX = 60;
const DESC_MAX = 160;

export function generateSeoPlan(opts: {
  brand: string;
  productOrService: string;
  audience?: string;
  primaryPain?: string;
  primaryDesire?: string;
  offer?: string;
  imageUrl?: string;
}): SeoPlan {
  const warnings: string[] = [];

  const title = buildTitle(opts);
  if (title.length > TITLE_MAX) {
    warnings.push(`Title excede ${TITLE_MAX} caracteres (${title.length}).`);
  }

  const metaDescription = buildMetaDescription(opts);
  if (metaDescription.length > DESC_MAX) {
    warnings.push(`Meta description excede ${DESC_MAX} caracteres (${metaDescription.length}).`);
  }

  const ogImage = opts.imageUrl ?? 'https://og-image.vercel.app/og-image.png';

  return {
    title: { name: 'title', content: title, maxLength: TITLE_MAX, currentLength: title.length },
    metaDescription: { name: 'description', content: metaDescription, maxLength: DESC_MAX, currentLength: metaDescription.length },
    ogTitle: { name: 'og:title', content: title, maxLength: 95, currentLength: title.length },
    ogDescription: { name: 'og:description', content: metaDescription, maxLength: 200, currentLength: metaDescription.length },
    ogImage: { name: 'og:image', content: ogImage },
    ogType: { name: 'og:type', content: 'website' },
    twitterCard: { name: 'twitter:card', content: 'summary_large_image' },
    twitterTitle: { name: 'twitter:title', content: title, maxLength: 70, currentLength: title.length },
    twitterDescription: { name: 'twitter:description', content: metaDescription, maxLength: 200, currentLength: metaDescription.length },
    twitterImage: { name: 'twitter:image', content: ogImage },
    additionalTags: [],
    warnings,
  };
}

function buildTitle(o: { brand: string; productOrService: string; offer?: string }): string {
  const offer = o.offer ? ` — ${o.offer}` : '';
  const base = `${o.productOrService} | ${o.brand}${offer}`;
  return base.slice(0, TITLE_MAX);
}

function buildMetaDescription(o: {
  brand: string;
  productOrService: string;
  audience?: string;
  primaryPain?: string;
  primaryDesire?: string;
}): string {
  const audience = o.audience ?? 'você';
  const pain = o.primaryPain ? ` Cansado de ${o.primaryPain.toLowerCase()}?` : '';
  const desire = o.primaryDesire ? ` ${o.primaryDesire}.` : '';
  const desc = `${o.productOrService} da ${o.brand} para ${audience}.${pain}${desire} Conheça agora.`;
  return desc.slice(0, DESC_MAX);
}
