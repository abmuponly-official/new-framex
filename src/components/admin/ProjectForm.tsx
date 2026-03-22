'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types/content';
import ImageUploader from './ImageUploader';
import MultiImageUploader from './MultiImageUploader';

type Mode = 'create' | 'edit';

interface Props {
  mode: Mode;
  initialData?: Partial<Project>;
  userId: string;
}

const CATEGORIES = [
  { value: 'residential', label: 'Nhà ở (Residential)' },
  { value: 'fnb', label: 'F&B' },
  { value: 'hospitality', label: 'Nhà nghỉ / Homestay' },
  { value: 'industrial', label: 'Công nghiệp (Industrial)' },
];

export default function ProjectForm({ mode, initialData, userId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState<'basic' | 'content' | 'seo' | 'media'>('basic');

  // ── Form state ──────────────────────────────────────────
  const [titleVi, setTitleVi]           = useState(initialData?.title_vi ?? '');
  const [titleEn, setTitleEn]           = useState(initialData?.title_en ?? '');
  const [excerptVi, setExcerptVi]       = useState(initialData?.excerpt_vi ?? '');
  const [excerptEn, setExcerptEn]       = useState(initialData?.excerpt_en ?? '');
  const [contentVi, setContentVi]       = useState(initialData?.content_vi ?? '');
  const [contentEn, setContentEn]       = useState(initialData?.content_en ?? '');
  const [slug, setSlug]                 = useState(initialData?.slug ?? '');
  const [category, setCategory]         = useState(initialData?.category ?? 'residential');
  const [clientName, setClientName]     = useState(initialData?.client_name ?? '');
  const [location, setLocation]         = useState(initialData?.location ?? '');
  const [year, setYear]                 = useState(String(initialData?.year ?? new Date().getFullYear()));
  const [tags, setTags]                 = useState((initialData?.tags ?? []).join(', '));
  const [coverImage, setCoverImage]     = useState(initialData?.cover_image ?? '');
  const [galleryUrls, setGalleryUrls]   = useState<string[]>(
    (initialData?.gallery ?? []).map((g: { url: string }) => g.url)
  );
  const [featured, setFeatured]         = useState(initialData?.featured ?? false);
  const [hasWatertest, setHasWatertest] = useState(initialData?.has_watertest ?? false);
  const [hasCo, setHasCo]              = useState(initialData?.has_co ?? false);
  const [status, setStatus]             = useState<'draft' | 'published' | 'archived'>(initialData?.status ?? 'draft');
  const [metaTitleVi, setMetaTitleVi]   = useState(initialData?.meta_title_vi ?? '');
  const [metaTitleEn, setMetaTitleEn]   = useState(initialData?.meta_title_en ?? '');
  const [metaDescVi, setMetaDescVi]     = useState(initialData?.meta_desc_vi ?? '');
  const [metaDescEn, setMetaDescEn]     = useState(initialData?.meta_desc_en ?? '');

  // Auto-generate slug from Vietnamese title
  function genSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  async function handleSubmit(e: React.FormEvent, publish?: boolean) {
    e.preventDefault();
    if (!titleVi.trim()) { setError('Tiêu đề tiếng Việt là bắt buộc.'); return; }
    if (!slug.trim()) { setError('Slug là bắt buộc.'); return; }

    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      title_vi: titleVi, title_en: titleEn,
      excerpt_vi: excerptVi, excerpt_en: excerptEn,
      content_vi: contentVi, content_en: contentEn,
      slug, category,
      client_name: clientName, location,
      year: year ? parseInt(year, 10) : null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      cover_image: coverImage,
      gallery: galleryUrls.map((url) => ({ url, caption_vi: '', caption_en: '' })),
      featured, has_watertest: hasWatertest, has_co: hasCo,
      status: publish ? 'published' : status,
      meta_title_vi: metaTitleVi, meta_title_en: metaTitleEn,
      meta_desc_vi: metaDescVi, meta_desc_en: metaDescEn,
      created_by: userId,
      published_at: publish ? new Date().toISOString() : (initialData?.published_at ?? null),
    };

    const url = mode === 'create'
      ? '/api/admin/projects'
      : `/api/admin/projects/${initialData?.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(json.error ?? 'Có lỗi xảy ra. Vui lòng thử lại.');
      return;
    }

    setSuccess(mode === 'create' ? 'Tạo dự án thành công!' : 'Cập nhật thành công!');
    setTimeout(() => router.push('/admin/projects'), 1000);
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      {/* Tab bar */}
      <div className="tab-bar">
        {(['basic', 'content', 'seo', 'media'] as const).map(t => (
          <button
            key={t}
            type="button"
            className={`tab-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {{ basic: '📋 Thông tin cơ bản', content: '📝 Nội dung', seo: '🔍 SEO', media: '🖼️ Media' }[t]}
          </button>
        ))}
      </div>

      {/* ── Tab: Basic ───────────────────────────────────────────── */}
      {tab === 'basic' && (
        <div className="admin-card">
          {/* Bilingual titles */}
          <div className="bilingual-grid" style={{ marginBottom: 24 }}>
            <div>
              <div className="bilingual-col-header vi">
                <span className="lang-flag vi">VI</span> Tiếng Việt
              </div>
              <div className="form-group">
                <label className="form-label">Tiêu đề <span className="required">*</span></label>
                <input
                  className="form-input"
                  value={titleVi}
                  onChange={e => {
                    setTitleVi(e.target.value);
                    if (!initialData?.slug) setSlug(genSlug(e.target.value));
                  }}
                  placeholder="Ví dụ: Tuệ House — Nhà phố tích hợp 3-trong-1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tóm tắt</label>
                <textarea
                  className="form-textarea"
                  value={excerptVi}
                  onChange={e => setExcerptVi(e.target.value)}
                  placeholder="Mô tả ngắn gọn hiển thị trên danh sách…"
                  rows={3}
                />
              </div>
            </div>
            <div>
              <div className="bilingual-col-header en">
                <span className="lang-flag en">EN</span> English
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  value={titleEn}
                  onChange={e => setTitleEn(e.target.value)}
                  placeholder="e.g. Tuệ House — Integrated 3-in-1 Town House"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Excerpt</label>
                <textarea
                  className="form-textarea"
                  value={excerptEn}
                  onChange={e => setExcerptEn(e.target.value)}
                  placeholder="Short description for listing page…"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Slug + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Slug (URL) <span className="required">*</span></label>
              <input
                className="form-input"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="tue-house"
              />
              <p className="form-hint">URL: /vi/du-an/{slug || '…'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value as 'residential' | 'fnb' | 'hospitality' | 'industrial')}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Client / Location / Year */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Tên khách hàng</label>
              <input className="form-input" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Anh Tuệ" />
            </div>
            <div className="form-group">
              <label className="form-label">Địa điểm</label>
              <input className="form-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="TP. HCM" />
            </div>
            <div className="form-group">
              <label className="form-label">Năm hoàn thành</label>
              <input className="form-input" type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="2024" />
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags</label>
            <input className="form-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="thép tiền chế, chống thấm, nhà phố (cách nhau bằng dấu phẩy)" />
          </div>

          {/* Flags */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              { label: '⭐ Nổi bật (Featured)', value: featured, set: setFeatured },
              { label: '💧 Có Water-test', value: hasWatertest, set: setHasWatertest },
              { label: '📄 Có Change Order (CO)', value: hasCo, set: setHasCo },
            ].map(({ label, value, set }) => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={value} onChange={e => set(e.target.checked)} style={{ width: 16, height: 16 }} />
                {label}
              </label>
            ))}
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-select" style={{ width: 200 }} value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published' | 'archived')}>
              <option value="draft">Nháp</option>
              <option value="published">Đã đăng</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>
        </div>
      )}

      {/* ── Tab: Content ─────────────────────────────────────────── */}
      {tab === 'content' && (
        <div className="admin-card">
          <div className="bilingual-grid">
            <div>
              <div className="bilingual-col-header vi">
                <span className="lang-flag vi">VI</span> Nội dung tiếng Việt
              </div>
              <SimpleRichEditor value={contentVi} onChange={setContentVi} placeholder="Mô tả chi tiết dự án bằng tiếng Việt…" />
            </div>
            <div>
              <div className="bilingual-col-header en">
                <span className="lang-flag en">EN</span> English content
              </div>
              <SimpleRichEditor value={contentEn} onChange={setContentEn} placeholder="Detailed project description in English…" />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: SEO ─────────────────────────────────────────────── */}
      {tab === 'seo' && (
        <div className="admin-card">
          <div className="bilingual-grid">
            <div>
              <div className="bilingual-col-header vi">
                <span className="lang-flag vi">VI</span> SEO tiếng Việt
              </div>
              <div className="form-group">
                <label className="form-label">Meta title</label>
                <input className="form-input" value={metaTitleVi} onChange={e => setMetaTitleVi(e.target.value)} placeholder="Tối đa 60 ký tự" maxLength={60} />
                <p className="form-hint">{metaTitleVi.length}/60 ký tự</p>
              </div>
              <div className="form-group">
                <label className="form-label">Meta description</label>
                <textarea className="form-textarea" value={metaDescVi} onChange={e => setMetaDescVi(e.target.value)} placeholder="Tối đa 160 ký tự" maxLength={160} rows={3} />
                <p className="form-hint">{metaDescVi.length}/160 ký tự</p>
              </div>
            </div>
            <div>
              <div className="bilingual-col-header en">
                <span className="lang-flag en">EN</span> SEO English
              </div>
              <div className="form-group">
                <label className="form-label">Meta title</label>
                <input className="form-input" value={metaTitleEn} onChange={e => setMetaTitleEn(e.target.value)} placeholder="Max 60 characters" maxLength={60} />
                <p className="form-hint">{metaTitleEn.length}/60 characters</p>
              </div>
              <div className="form-group">
                <label className="form-label">Meta description</label>
                <textarea className="form-textarea" value={metaDescEn} onChange={e => setMetaDescEn(e.target.value)} placeholder="Max 160 characters" maxLength={160} rows={3} />
                <p className="form-hint">{metaDescEn.length}/160 characters</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Media ───────────────────────────────────────────── */}
      {tab === 'media' && (
        <div className="admin-card">
          <div className="form-group" style={{ marginBottom: 32 }}>
            <ImageUploader
              label="Ảnh bìa (Cover image)"
              value={coverImage}
              onChange={setCoverImage}
              folder="projects"
              hint="Tỷ lệ khuyến nghị 4:3, WebP, tối đa 5MB. Ảnh này hiển thị trên danh sách dự án."
            />
          </div>
          <MultiImageUploader
            label="Thư viện ảnh dự án (Gallery)"
            value={galleryUrls}
            onChange={setGalleryUrls}
            folder="projects"
            maxImages={20}
          />
        </div>
      )}

      {/* ── Action bar ───────────────────────────────────────────── */}
      <div className="admin-card" style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.push('/admin/projects')}
        >
          ← Quay lại
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={saving}
            onClick={(e) => handleSubmit(e)}
          >
            {saving ? 'Đang lưu…' : '💾 Lưu nháp'}
          </button>
          <button
            type="button"
            className="btn btn-success"
            disabled={saving}
            onClick={(e) => handleSubmit(e, true)}
          >
            {saving ? 'Đang đăng…' : '🚀 Đăng ngay'}
          </button>
        </div>
      </div>
    </form>
  );
}

// ── Minimal rich text editor (no external deps) ─────────────────────────────
function SimpleRichEditor({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  function exec(cmd: string, val?: string) {
    document.execCommand(cmd, false, val);
  }

  return (
    <div>
      <div className="editor-toolbar">
        {[
          { cmd: 'bold', label: 'B', style: { fontWeight: 700 } },
          { cmd: 'italic', label: 'I', style: { fontStyle: 'italic' } },
          { cmd: 'underline', label: 'U', style: { textDecoration: 'underline' } },
        ].map(({ cmd, label, style }) => (
          <button key={cmd} type="button" onClick={() => exec(cmd)} style={style}>{label}</button>
        ))}
        <button type="button" onClick={() => exec('insertUnorderedList')}>• List</button>
        <button type="button" onClick={() => exec('insertOrderedList')}>1. List</button>
        <button type="button" onClick={() => exec('formatBlock', 'h2')}>H2</button>
        <button type="button" onClick={() => exec('formatBlock', 'h3')}>H3</button>
        <button type="button" onClick={() => exec('formatBlock', 'p')}>P</button>
      </div>
      <div
        className="rich-editor editor-has-toolbar"
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        style={{ minHeight: 220 }}
      />
    </div>
  );
}
