import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General crawlers — allow all public pages, block CMS + API
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      // AI training crawlers — disallow to protect proprietary content
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'anthropic-ai', 'ClaudeBot', 'PerplexityBot', 'Amazonbot', 'CCBot'],
        disallow: '/',
      },
      // AI search/answer engines — allow indexing for AI-powered search visibility
      {
        userAgent: ['Googlebot', 'Bingbot', 'DuckDuckBot'],
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: 'https://framex.vn/sitemap.xml',
    host: 'https://framex.vn',
  };
}
