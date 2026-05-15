// Phase 16.3 — Generate JSON-LD structured data plan
// Supports: Organization, LocalBusiness, Product, FAQPage, SoftwareApplication, Article

export type JsonLdType =
  | 'Organization'
  | 'LocalBusiness'
  | 'Product'
  | 'FAQPage'
  | 'SoftwareApplication'
  | 'Article';

export interface JsonLdBlock {
  type: JsonLdType;
  json: Record<string, unknown>;
  priority: 'high' | 'medium' | 'low';
  injectLocation: 'head' | 'body' | 'footer';
}

export interface JsonLdPlan {
  blocks: JsonLdBlock[];
  recommendations: string[];
}

export function generateJsonLdPlan(opts: {
  brand: string;
  productOrService: string;
  url?: string;
  description?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  price?: string;
  currency?: string;
  imageUrl?: string;
  faqs?: Array<{ question: string; answer: string }>;
  authorName?: string;
  datePublished?: string;
  applicationCategory?: string;
  operatingSystem?: string;
}): JsonLdPlan {
  const blocks: JsonLdBlock[] = [];

  // Organization (always recommended)
  blocks.push({
    type: 'Organization',
    priority: 'high',
    injectLocation: 'head',
    json: buildOrganization(opts),
  });

  // LocalBusiness (if address data exists)
  if (opts.streetAddress || opts.city) {
    blocks.push({
      type: 'LocalBusiness',
      priority: 'medium',
      injectLocation: 'head',
      json: buildLocalBusiness(opts),
    });
  }

  // Product (if price exists)
  if (opts.price) {
    blocks.push({
      type: 'Product',
      priority: 'medium',
      injectLocation: 'head',
      json: buildProduct(opts),
    });
  }

  // FAQPage (if FAQs exist)
  if (opts.faqs && opts.faqs.length > 0) {
    blocks.push({
      type: 'FAQPage',
      priority: 'high',
      injectLocation: 'body',
      json: buildFaqPage(opts.faqs),
    });
  }

  // SoftwareApplication
  if (opts.applicationCategory) {
    blocks.push({
      type: 'SoftwareApplication',
      priority: 'medium',
      injectLocation: 'head',
      json: buildSoftwareApplication(opts),
    });
  }

  // Article
  if (opts.authorName && opts.datePublished) {
    blocks.push({
      type: 'Article',
      priority: 'medium',
      injectLocation: 'head',
      json: buildArticle(opts),
    });
  }

  return {
    blocks,
    recommendations: buildRecommendations(blocks),
  };
}

function buildOrganization(o: {
  brand: string;
  url?: string;
  description?: string;
  logoUrl?: string;
}): Record<string, unknown> {
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: o.brand,
  };
  if (o.url) org.url = o.url;
  if (o.description) org.description = o.description;
  if (o.logoUrl) org.logo = o.logoUrl;
  return org;
}

function buildLocalBusiness(o: {
  brand: string;
  url?: string;
  phone?: string;
  email?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  logoUrl?: string;
  imageUrl?: string;
  price?: string;
}): Record<string, unknown> {
  const lb: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: o.brand,
  };
  if (o.url) lb.url = o.url;
  if (o.phone) lb.telephone = o.phone;
  if (o.email) lb.email = o.email;
  if (o.imageUrl) lb.image = o.imageUrl;
  if (o.price) lb.priceRange = o.price;

  if (o.streetAddress || o.city) {
    const address: Record<string, string> = { '@type': 'PostalAddress' };
    if (o.streetAddress) address.streetAddress = o.streetAddress;
    if (o.city) address.addressLocality = o.city;
    if (o.state) address.addressRegion = o.state;
    if (o.zip) address.postalCode = o.zip;
    if (o.country) address.addressCountry = o.country;
    lb.address = address;
  }

  return lb;
}

function buildProduct(o: {
  brand: string;
  productOrService: string;
  description?: string;
  price?: string;
  currency?: string;
  imageUrl?: string;
  url?: string;
}): Record<string, unknown> {
  const product: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${o.productOrService} — ${o.brand}`,
  };
  if (o.description) product.description = o.description;
  if (o.imageUrl) product.image = o.imageUrl;
  if (o.url) product.url = o.url;
  if (o.price) {
    product.offers = {
      '@type': 'Offer',
      price: o.price,
      priceCurrency: o.currency ?? 'BRL',
      availability: 'https://schema.org/InStock',
    };
  }
  return product;
}

function buildFaqPage(faqs: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

function buildSoftwareApplication(o: {
  brand: string;
  productOrService: string;
  applicationCategory?: string;
  operatingSystem?: string;
  url?: string;
  description?: string;
}): Record<string, unknown> {
  const app: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${o.productOrService} — ${o.brand}`,
  };
  if (o.applicationCategory) app.applicationCategory = o.applicationCategory;
  if (o.operatingSystem) app.operatingSystem = o.operatingSystem;
  if (o.url) app.url = o.url;
  if (o.description) app.description = o.description;
  return app;
}

function buildArticle(o: {
  brand: string;
  productOrService: string;
  authorName?: string;
  datePublished?: string;
  imageUrl?: string;
  url?: string;
  description?: string;
}): Record<string, unknown> {
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${o.productOrService} — ${o.brand}`,
  };
  if (o.authorName) {
    article.author = { '@type': 'Person', name: o.authorName };
    article.publisher = { '@type': 'Organization', name: o.brand };
  }
  if (o.datePublished) article.datePublished = o.datePublished;
  if (o.imageUrl) article.image = o.imageUrl;
  if (o.url) article.url = o.url;
  if (o.description) article.description = o.description;
  return article;
}

function buildRecommendations(blocks: JsonLdBlock[]): string[] {
  const recs: string[] = [];
  const types = new Set(blocks.map(b => b.type));

  if (!types.has('Organization')) {
    recs.push('Adicionar JSON-LD Organization (mínimo recomendado).');
  }
  if (!types.has('FAQPage')) {
    recs.push('Adicionar FAQ com JSON-LD FAQPage para rich snippets.');
  }
  if (!types.has('LocalBusiness') && !types.has('Organization')) {
    recs.push('Adicionar JSON-LD LocalBusiness se houver endereço físico.');
  }
  if (recs.length === 0) {
    recs.push('JSON-LD está completo para os dados fornecidos.');
  }

  return recs;
}
