-- ─────────────────────────────────────────────────────────────────────────────
-- FrameX — Supabase Storage Setup
-- Run this in Supabase → SQL Editor after creating the project
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create the media bucket (public = images are accessible without auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'framex-media',
  'framex-media',
  true,
  5242880,  -- 5 MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- 2. Allow authenticated users (admin) to upload
CREATE POLICY "Admin can upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'framex-media');

-- 3. Allow authenticated users to update their uploads
CREATE POLICY "Admin can update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'framex-media');

-- 4. Allow authenticated users to delete
CREATE POLICY "Admin can delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'framex-media');

-- 5. Allow EVERYONE to read (public bucket = public images)
CREATE POLICY "Public can read media" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'framex-media');

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Add notes field to leads table (if not already present)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Ensure user_roles has unique constraint on user_id
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_key;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);
