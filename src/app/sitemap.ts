import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://framex.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/giai-phap-3-trong-1',
    '/chu-dau-tu',
    '/nha-thau',
    '/kien-truc-su',
    '/du-an',
    '/tin-tuc',
    '/ve-chung-toi',
    '/lien-he',
    '/chinh-sach-bao-mat',
    '/dieu-khoan-su-dung',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((path) => [
    {
      url: `${BASE_URL}/vi${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: {
        languages: {
          vi: `${BASE_URL}/vi${path}`,
          en: `${BASE_URL}/en${path}`,
        },
      },
    },
  ]);

  // Dynamic: projects
  let projectEntries: MetadataRoute.Sitemap = [];
  let postEntries: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();
    
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('status', 'published');

    projectEntries = (projects ?? []).flatMap((p) => [
      {
        url: `${BASE_URL}/vi/du-an/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: {
          languages: {
            vi: `${BASE_URL}/vi/du-an/${p.slug}`,
            en: `${BASE_URL}/en/du-an/${p.slug}`,
          },
        },
      },
    ]);

    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('status', 'published');

    postEntries = (posts ?? []).flatMap((p) => [
      {
        url: `${BASE_URL}/vi/tin-tuc/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        alternates: {
          languages: {
            vi: `${BASE_URL}/vi/tin-tuc/${p.slug}`,
            en: `${BASE_URL}/en/tin-tuc/${p.slug}`,
          },
        },
      },
    ]);
  } catch {
    // Gracefully skip dynamic entries if DB unavailable at build time
  }

  return [...staticEntries, ...projectEntries, ...postEntries];
}
