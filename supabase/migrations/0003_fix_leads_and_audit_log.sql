-- ============================================================
-- FrameX: MASTER FIX — Run this ONCE in Supabase SQL Editor
-- File: supabase/migrations/0003_fix_leads_and_audit_log.sql
-- Covers: leads.notes column, audit_log table, RLS, triggers
-- ============================================================

-- ─── 1. leads.notes column (safe: ADD IF NOT EXISTS) ─────────
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- ─── 2. audit_log table (safe: CREATE IF NOT EXISTS) ─────────
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

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);

-- ─── 3. Disable RLS on audit_log (service_role reads all) ────
ALTER TABLE audit_log DISABLE ROW LEVEL SECURITY;

-- ─── 4. audit_log trigger function ───────────────────────────
-- user_id = NULL is expected when public contact form submits
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD)::jsonb ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW)::jsonb ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 5. Attach audit triggers (idempotent) ───────────────────
DROP TRIGGER IF EXISTS audit_projects ON projects;
CREATE TRIGGER audit_projects
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION log_audit();

DROP TRIGGER IF EXISTS audit_posts ON posts;
CREATE TRIGGER audit_posts
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- ─── 6. user_roles unique constraint (idempotent) ────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_roles_user_id_key'
      AND conrelid = 'user_roles'::regclass
  ) THEN
    ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);
  END IF;
END$$;

-- ─── 7. Verify (should return 4 rows with counts) ────────────
SELECT 'audit_log' AS tbl, COUNT(*) AS rows FROM audit_log
UNION ALL SELECT 'leads',    COUNT(*) FROM leads
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'posts',    COUNT(*) FROM posts;
