-- ============================================================
-- FrameX: 0004_site_settings_social_and_rls.sql
-- Run ONCE in Supabase SQL Editor (Dashboard → SQL Editor)
-- Adds: social URL defaults, site_settings RLS (public read)
-- ============================================================

-- ─── 1. Add social URL defaults (idempotent) ─────────────────
INSERT INTO site_settings (key, value_vi, value_en, description) VALUES
  ('facebook_url', '', '', 'Facebook page URL'),
  ('zalo_url',     '', '', 'Zalo official account URL'),
  ('youtube_url',  '', '', 'YouTube channel URL')
ON CONFLICT (key) DO NOTHING;

-- ─── 2. Enable RLS on site_settings (public read is safe) ────
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read site settings (email, phone, etc. are public)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'site_settings'
      AND policyname = 'Public read site_settings'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read site_settings"
      ON site_settings FOR SELECT TO anon, authenticated
      USING (true)';
  END IF;
END$$;

-- Only service_role (admin client) can upsert settings
-- (handled by createAdminClient which uses SERVICE_ROLE_KEY bypassing RLS)

-- ─── 3. Verify all expected keys exist ───────────────────────
SELECT key, value_vi, value_en
FROM site_settings
ORDER BY key;
