-- ============================================================
-- FrameX: 0005_storage_allow_pdf.sql
-- Run ONCE in Supabase SQL Editor
-- Fix: bucket framex-media was locked to image/* only.
--      Add application/pdf and raise file_size_limit to 20 MB.
-- ============================================================

-- ─── 1. Update existing bucket to allow PDF ──────────────────
UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf'
  ],
  -- 20 MB limit applies to all files in this bucket.
  -- Server-side code enforces stricter limits per type (5 MB images, 20 MB PDF).
  file_size_limit = 20971520
WHERE id = 'framex-media';

-- ─── 2. Verify ───────────────────────────────────────────────
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'framex-media';
