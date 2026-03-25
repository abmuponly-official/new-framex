/**
 * seo.ts — Shared SEO / metadata helpers
 *
 * Why this file exists:
 * Next.js App Router REPLACES the layout's openGraph object when a child page
 * defines its own openGraph (it does NOT deep-merge individual keys).
 * This means layout-level og:locale, og:type, og:siteName are silently dropped
 * on every inner page that provides its own openGraph block.
 *
 * Solution: every page.tsx calls `buildOpenGraph()` to get a complete,
 * locale-aware openGraph block instead of writing it by hand.
 */

const BASE_URL = 'https://framex.vn';
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/og-default.png`;

export type SeoLocale = 'vi' | 'en';

export interface OpenGraphOptions {
  locale: SeoLocale;
  title: string;
  description?: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Returns a complete openGraph metadata object for use in generateMetadata().
 * Always includes locale, alternateLocale, type, siteName, and images.
 */
export function buildOpenGraph(opts: OpenGraphOptions) {
  const {
    locale,
    title,
    description,
    url,
    image = DEFAULT_OG_IMAGE,
    type = 'website',
    publishedTime,
    modifiedTime,
  } = opts;

  return {
    title,
    ...(description ? { description } : {}),
    url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
    locale: locale === 'vi' ? 'vi_VN' : 'en_US',
    alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN'],
    type,
    siteName: 'FrameX',
    images: [
      {
        url: image.startsWith('http') ? image : `${BASE_URL}${image}`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    ...(publishedTime ? { publishedTime } : {}),
    ...(modifiedTime ? { modifiedTime } : {}),
  };
}

/**
 * Returns the canonical + hreflang alternates block for a given path.
 * Path should be the locale-agnostic slug, e.g. '/giai-phap-3-trong-1'
 * or '' for the homepage.
 */
export function buildAlternates(locale: SeoLocale, path: string = '') {
  const slug = path.startsWith('/') ? path : `/${path}`;
  return {
    canonical: `/${locale}${slug}`,
    languages: {
      vi: `/vi${slug}`,
      en: `/en${slug}`,
    },
  };
}
