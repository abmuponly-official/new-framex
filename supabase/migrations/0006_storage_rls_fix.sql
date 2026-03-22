-- ============================================================
-- FrameX: 0006_storage_rls_fix.sql
-- Run ONCE in Supabase SQL Editor
-- Ensures all required RLS policies exist on storage.objects
-- for the framex-media bucket (idempotent — safe to re-run).
-- ============================================================

-- ─── Helper: add policy only if it doesn't exist ─────────────
DO $$
BEGIN
  -- 1. Public SELECT (read) — needed for getPublicUrl() to work
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'Public can read media'
  ) THEN
    EXECUTE '
      CREATE POLICY "Public can read media"
        ON storage.objects FOR SELECT TO public
        USING (bucket_id = ''framex-media'')
    ';
  END IF;

  -- 2. Authenticated INSERT (upload)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'Admin can upload media'
  ) THEN
    EXECUTE '
      CREATE POLICY "Admin can upload media"
        ON storage.objects FOR INSERT TO authenticated
        WITH CHECK (bucket_id = ''framex-media'')
    ';
  END IF;

  -- 3. Authenticated UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'Admin can update media'
  ) THEN
    EXECUTE '
      CREATE POLICY "Admin can update media"
        ON storage.objects FOR UPDATE TO authenticated
        USING (bucket_id = ''framex-media'')
    ';
  END IF;

  -- 4. Authenticated DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'Admin can delete media'
  ) THEN
    EXECUTE '
      CREATE POLICY "Admin can delete media"
        ON storage.objects FOR DELETE TO authenticated
        USING (bucket_id = ''framex-media'')
    ';
  END IF;
END$$;

-- ─── Verify: list all policies on storage.objects ────────────
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;
