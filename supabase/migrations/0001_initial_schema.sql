-- FrameX Supabase Migration: 0001_initial_schema.sql
-- Run: npx supabase db push OR apply via Supabase dashboard

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── User Roles ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role       TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title_vi      TEXT NOT NULL,
  title_en      TEXT NOT NULL,
  excerpt_vi    TEXT DEFAULT '',
  excerpt_en    TEXT DEFAULT '',
  content_vi    TEXT DEFAULT '',
  content_en    TEXT DEFAULT '',
  category      TEXT DEFAULT 'residential' CHECK (category IN ('residential','fnb','hospitality','industrial')),
  client_name   TEXT,
  location      TEXT,
  year          INTEGER,
  tags          TEXT[] DEFAULT '{}',
  cover_image   TEXT,
  gallery       JSONB DEFAULT '[]',
  has_watertest BOOLEAN DEFAULT false,
  has_co        BOOLEAN DEFAULT false,
  proof_docs    JSONB DEFAULT '[]',
  meta_title_vi TEXT,
  meta_title_en TEXT,
  meta_desc_vi  TEXT,
  meta_desc_en  TEXT,
  featured      BOOLEAN DEFAULT false,
  status        TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at  TIMESTAMPTZ,
  sort_order    INTEGER DEFAULT 0,
  created_by    UUID REFERENCES auth.users(id),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_projects_status   ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_category ON projects(category);

-- ─── Posts (Blog) ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title_vi      TEXT NOT NULL,
  title_en      TEXT NOT NULL,
  excerpt_vi    TEXT DEFAULT '',
  excerpt_en    TEXT DEFAULT '',
  content_vi    TEXT DEFAULT '',
  content_en    TEXT DEFAULT '',
  author_id     UUID REFERENCES auth.users(id),
  category      TEXT,
  tags          TEXT[] DEFAULT '{}',
  cover_image   TEXT,
  reading_time  INTEGER,
  meta_title_vi TEXT,
  meta_title_en TEXT,
  meta_desc_vi  TEXT,
  meta_desc_en  TEXT,
  status        TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at  TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now(),
  created_by    UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_posts_status       ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);

-- ─── Leads (Contact submissions) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  role         TEXT,
  message      TEXT,
  project_type TEXT,
  budget_range TEXT,
  attachments  JSONB DEFAULT '[]',
  source_page  TEXT,
  locale       TEXT DEFAULT 'vi',
  created_at   TIMESTAMPTZ DEFAULT now(),
  status       TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','closed')),
  notes        TEXT
);

CREATE INDEX idx_leads_status     ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- ─── Audit Log ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,
  table_name  TEXT NOT NULL,
  record_id   UUID,
  old_values  JSONB,
  new_values  JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Site Settings ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value_vi    TEXT,
  value_en    TEXT,
  description TEXT
);

-- Seed default settings
INSERT INTO site_settings (key, value_vi, value_en, description) VALUES
  ('contact_email',  'hello@framex.vn',     'hello@framex.vn',   'Primary contact email'),
  ('contact_phone',  '+84 xxx xxx xxx',     '+84 xxx xxx xxx',   'Primary phone number'),
  ('address',        'TP. Hồ Chí Minh',     'Ho Chi Minh City',  'Office address'),
  ('capability_pdf', '/files/framex-capability.pdf', '/files/framex-capability.pdf', 'Capability profile PDF path')
ON CONFLICT (key) DO NOTHING;

-- ─── Audit Trigger ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_projects
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_posts
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- ─── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles   ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public read published projects"
  ON projects FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Public read published posts"
  ON posts FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Authenticated editors can manage content
CREATE POLICY "Editors full access projects"
  ON projects FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin','editor'))
  );

CREATE POLICY "Editors full access posts"
  ON posts FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin','editor'))
  );

-- Only authenticated users (editors+) can see leads
CREATE POLICY "Authenticated view leads"
  ON leads FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin','editor','viewer'))
  );

-- Only service role can insert leads (API route uses admin client)
-- Anon insert for public contact form:
CREATE POLICY "Public insert leads"
  ON leads FOR INSERT TO anon, authenticated
  WITH CHECK (true);
