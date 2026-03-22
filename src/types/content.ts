export type Locale = 'vi' | 'en';

// ─── Bilingual helpers ───────────────────────────────────────────────────────

export type BilingualString = {
  vi: string;
  en: string;
};

/**
 * Get the localized value of a field from a Supabase record.
 * Falls back to the other locale if the requested one is empty.
 */
export function t(
  record: Record<string, unknown>,
  field: string,
  locale: Locale
): string {
  const primary = record[`${field}_${locale}`] as string | undefined;
  const fallback = record[`${field}_${locale === 'vi' ? 'en' : 'vi'}`] as string | undefined;
  return primary || fallback || '';
}

// ─── Database types (mirrors Supabase schema) ─────────────────────────────────

export type ProjectStatus = 'draft' | 'published' | 'archived';
export type PostStatus = 'draft' | 'published' | 'archived';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed';
export type UserRole = 'super_admin' | 'editor' | 'viewer';

export type ProjectCategory =
  | 'residential'
  | 'fnb'
  | 'hospitality'
  | 'industrial';

export type PostCategory =
  | 'pain-based'
  | 'comparative'
  | 'case-based'
  | 'technical';

export type GalleryItem = {
  url: string;
  caption_vi: string;
  caption_en: string;
};

export type ProofDoc = {
  url: string;
  label_vi: string;
  label_en: string;
  type: 'watertest' | 'co' | 'itp' | 'other';
};

export type Project = {
  id: string;
  slug: string;
  title_vi: string;
  title_en: string;
  excerpt_vi: string;
  excerpt_en: string;
  content_vi: string;
  content_en: string;
  category: ProjectCategory;
  client_name?: string;
  location?: string;
  year?: number;
  tags: string[];
  cover_image?: string;
  gallery: GalleryItem[];
  has_watertest: boolean;
  has_co: boolean;
  proof_docs: ProofDoc[];
  meta_title_vi?: string;
  meta_title_en?: string;
  meta_desc_vi?: string;
  meta_desc_en?: string;
  featured: boolean;
  status: ProjectStatus;
  published_at: string | null;
  sort_order: number;
  created_by?: string;
  updated_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title_vi: string;
  title_en: string;
  excerpt_vi: string;
  excerpt_en: string;
  content_vi: string;
  content_en: string;
  author_id?: string;
  category?: PostCategory;
  tags: string[];
  cover_image?: string;
  reading_time?: number;
  meta_title_vi?: string;
  meta_title_en?: string;
  meta_desc_vi?: string;
  meta_desc_en?: string;
  status: PostStatus;
  published_at: string | null;
  updated_at: string;
  created_by?: string;
};

export type Lead = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role?: string;
  message?: string;
  project_type?: string;
  budget_range?: string;
  attachments: string[];
  source_page?: string;
  locale: Locale;
  created_at: string;
  status: LeadStatus;
  notes?: string;
};

export type AuditLog = {
  id: string;
  user_id?: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  table_name: string;
  record_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  created_at: string;
};

export type SiteSetting = {
  key: string;
  value_vi?: string;
  value_en?: string;
  description?: string;
};
