// Phase 16.3 — Generate metadata plan: canonical, robots, viewport, hreflang, favicon

export interface MetaTag {
  tag: string;
  attributes: Record<string, string>;
}

export interface MetadataPlan {
  canonical: MetaTag | null;
  robots: MetaTag;
  viewport: MetaTag;
  charset: MetaTag;
  hreflang: MetaTag[];
  favicon: MetaTag[];
  themeColor: MetaTag | null;
  applicationName: MetaTag | null;
  additional: MetaTag[];
}

export function generateMetadataPlan(opts: {
  baseUrl?: string;
  path?: string;
  brand?: string;
  themeColorHex?: string;
  languages?: string[];
  faviconPath?: string;
}): MetadataPlan {
  const plan: MetadataPlan = {
    canonical: null,
    robots: { tag: 'meta', attributes: { name: 'robots', content: 'index, follow' } },
    viewport: { tag: 'meta', attributes: { name: 'viewport', content: 'width=device-width, initial-scale=1' } },
    charset: { tag: 'meta', attributes: { charset: 'UTF-8' } },
    hreflang: [],
    favicon: [],
    themeColor: null,
    applicationName: null,
    additional: [],
  };

  if (opts.baseUrl) {
    const url = opts.path ? `${opts.baseUrl.replace(/\/$/, '')}/${opts.path.replace(/^\//, '')}` : opts.baseUrl;
    plan.canonical = { tag: 'link', attributes: { rel: 'canonical', href: url } };

    for (const lang of opts.languages ?? []) {
      plan.hreflang.push({
        tag: 'link',
        attributes: { rel: 'alternate', hreflang: lang, href: url },
      });
    }
  }

  if (opts.brand) {
    plan.applicationName = { tag: 'meta', attributes: { name: 'application-name', content: opts.brand } };
  }

  if (opts.themeColorHex) {
    plan.themeColor = { tag: 'meta', attributes: { name: 'theme-color', content: opts.themeColorHex } };
  }

  const favicon = opts.faviconPath ?? '/favicon.ico';
  plan.favicon.push({ tag: 'link', attributes: { rel: 'icon', type: 'image/x-icon', href: favicon } });
  plan.favicon.push({ tag: 'link', attributes: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } });

  return plan;
}
