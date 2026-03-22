/**
 * getSiteSettings()
 * Fetches all rows from the `site_settings` table using the admin client
 * (bypasses RLS) and returns a typed key→{vi,en} map.
 *
 * Uses Next.js unstable_cache so the result is revalidated every 60 s in
 * production (ISR-style) while staying fresh during local development.
 */

import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

export type SettingsMap = Record<string, { vi: string; en: string }>;

/** Well-known keys stored in site_settings */
export const SETTINGS_KEYS = {
  CONTACT_EMAIL:  'contact_email',
  CONTACT_PHONE:  'contact_phone',
  ADDRESS:        'address',
  CAPABILITY_PDF: 'capability_pdf',
  FACEBOOK_URL:   'facebook_url',
  ZALO_URL:       'zalo_url',
  YOUTUBE_URL:    'youtube_url',
} as const;

/** Fallback values – used when Supabase is unreachable or table is empty */
const FALLBACK: SettingsMap = {
  contact_email:  { vi: 'hello@framex.vn',              en: 'hello@framex.vn' },
  contact_phone:  { vi: '+84 xxx xxx xxx',               en: '+84 xxx xxx xxx' },
  address:        { vi: 'TP. Hồ Chí Minh, Việt Nam',    en: 'Ho Chi Minh City, Vietnam' },
  capability_pdf: { vi: '/files/framex-capability.pdf',  en: '/files/framex-capability.pdf' },
  facebook_url:   { vi: '', en: '' },
  zalo_url:       { vi: '', en: '' },
  youtube_url:    { vi: '', en: '' },
};

async function _fetchSettings(): Promise<SettingsMap> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('site_settings')
      .select('key, value_vi, value_en');

    if (error || !data) return FALLBACK;

    const map: SettingsMap = { ...FALLBACK };
    for (const row of data) {
      map[row.key] = {
        vi: row.value_vi ?? '',
        en: row.value_en ?? '',
      };
    }
    return map;
  } catch {
    return FALLBACK;
  }
}

/**
 * Cached version — revalidates every 60 s on Vercel edge/serverless.
 * Tagged 'site_settings' so you can call revalidateTag('site_settings')
 * after a PUT /api/admin/settings to bust the cache immediately.
 */
export const getSiteSettings = unstable_cache(
  _fetchSettings,
  ['site_settings'],
  { revalidate: 60, tags: ['site_settings'] }
);

/** Convenience: get a single value for a locale (falls back to other locale) */
export function getSetting(
  map: SettingsMap,
  key: string,
  locale: 'vi' | 'en'
): string {
  const entry = map[key];
  if (!entry) return FALLBACK[key]?.[locale] ?? '';
  return entry[locale] || entry[locale === 'vi' ? 'en' : 'vi'] || '';
}
