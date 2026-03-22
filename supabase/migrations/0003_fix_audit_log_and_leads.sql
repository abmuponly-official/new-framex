-- ============================================================
-- FrameX: Fix Migration — run in Supabase SQL Editor
-- File: supabase/migrations/0003_fix_audit_log_and_leads.sql
-- ============================================================

-- ─── 1. Create audit_log table (if not exists) ───────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  table_name  TEXT NOT NULL,
  record_id   UUID,
  old_values  JSONB,
  new_values  JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at  ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name  ON audit_log(table_name);

-- ─── 2. RLS for audit_log ─────────────────────────────────────
-- Service role bypasses RLS automatically. 
-- Disable RLS so PostgREST can read via service_role without policies.
ALTER TABLE audit_log DISABLE ROW LEVEL SECURITY;

-- ─── 3. audit_log trigger function ───────────────────────────
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (
    auth.uid(),           -- NULL is fine for public/anon operations
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD)::jsonb ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW)::jsonb ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 4. Attach triggers (idempotent) ─────────────────────────
DROP TRIGGER IF EXISTS audit_projects ON projects;
CREATE TRIGGER audit_projects
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION log_audit();

DROP TRIGGER IF EXISTS audit_posts ON posts;
CREATE TRIGGER audit_posts
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- ─── 5. leads table fixes ────────────────────────────────────
-- Add notes column if missing (from migration 0002)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- ─── 6. user_roles unique constraint ─────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_roles_user_id_key' AND conrelid = 'user_roles'::regclass
  ) THEN
    ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);
  END IF;
END$$;

-- ─── 7. Verify ───────────────────────────────────────────────
SELECT 'audit_log' AS tbl, COUNT(*) FROM audit_log
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'posts', COUNT(*) FROM posts;
