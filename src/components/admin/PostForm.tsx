'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/types/content';
import ImageUploader from './ImageUploader';

type Mode = 'create' | 'edit';
interface Props { mode: Mode; initialData?: Partial<Post>; userId: string; }

const CATEGORIES = [
  { value: 'pain-based', label: 'Pain-based (vấn đề thực tế)' },
  { value: 'comparative', label: 'Comparative (so sánh)' },
  { value: 'case-based', label: 'Case-based (dự án thực tế)' },
  { value: 'technical', label: 'Technical / Process (kỹ thuật)' },
];

export default function PostForm({ mode, initialData, userId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState<'basic' | 'content' | 'seo'>('basic');

  const [titleVi, setTitleVi]     = useState(initialData?.title_vi ?? '');
  const [titleEn, setTitleEn]     = useState(initialData?.title_en ?? '');
  const [excerptVi, setExcerptVi] = useState(initialData?.excerpt_vi ?? '');
  const [excerptEn, setExcerptEn] = useState(initialData?.excerpt_en ?? '');
  const [contentVi, setContentVi] = useState(initialData?.content_vi ?? '');
  const [contentEn, setContentEn] = useState(initialData?.content_en ?? '');
  const [slug, setSlug]           = useState(initialData?.slug ?? '');
  const [category, setCategory]   = useState(initialData?.category ?? 'pain-based');
  const [tags, setTags]           = useState((initialData?.tags ?? []).join(', '));
  const [coverImage, setCoverImage] = useState(initialData?.cover_image ?? '');
  const [readingTime, setReadingTime] = useState(String(initialData?.reading_time ?? ''));
  const [status, setStatus]       = useState<'draft' | 'published' | 'archived'>(initialData?.status ?? 'draft');
  const [metaTitleVi, setMetaTitleVi] = useState(initialData?.meta_title_vi ?? '');
  const [metaTitleEn, setMetaTitleEn] = useState(initialData?.meta_title_en ?? '');
  const [metaDescVi, setMetaDescVi]   = useState(initialData?.meta_desc_vi ?? '');
  const [metaDescEn, setMetaDescEn]   = useState(initialData?.meta_desc_en ?? '');

  function genSlug(title: string) {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  }

  async function handleSubmit(e: React.FormEvent, publish?: boolean) {
    e.preventDefault();
    if (!titleVi.trim()) { setError('Tiêu đề tiếng Việt là bắt buộc.'); return; }
    if (!slug.trim()) { setError('Slug là bắt buộc.'); return; }

    setSaving(true); setError(''); setSuccess('');

    const payload = {
      title_vi: titleVi, title_en: titleEn,
      excerpt_vi: excerptVi, excerpt_en: excerptEn,
      content_vi: contentVi, content_en: contentEn,
      slug, category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      cover_image: coverImage,
      reading_time: readingTime ? parseInt(readingTime, 10) : null,
      status: publish ? 'published' : status,
      meta_title_vi: metaTitleVi, meta_title_en: metaTitleEn,
      meta_desc_vi: metaDescVi, meta_desc_en: metaDescEn,
      created_by: userId,
      published_at: publish ? new Date().toISOString() : (initialData?.published_at ?? null),
    };

    const url = mode === 'create' ? '/api/admin/posts' : `/api/admin/posts/${initialData?.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await res.json();
    setSaving(false);

    if (!res.ok) { setError(json.error ?? 'Có lỗi xảy ra.'); return; }
    setSuccess(mode === 'create' ? 'Tạo bài viết thành công!' : 'Cập nhật thành công!');
    setTimeout(() => router.push('/admin/posts'), 1000);
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="tab-bar">
        {(['basic', 'content', 'seo'] as const).map(t => (
          <button key={t} type="button" className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {{ basic: '📋 Thông tin', content: '📝 Nội dung', seo: '🔍 SEO' }[t]}
          </button>
        ))}
      </div>

      {tab === 'basic' && (
        <div className="admin-card">
          <div className="bilingual-grid" style={{ marginBottom: 24 }}>
            <div>
              <div className="bilingual-col-header vi"><span className="lang-flag vi">VI</span> Tiếng Việt</div>
              <div className="form-group">
                <label className="form-label">Tiêu đề <span className="required">*</span></label>
                <input className="form-input" value={titleVi} onChange={e => { setTitleVi(e.target.value); if (!initialData?.slug) setSlug(genSlug(e.target.value)); }} placeholder="Tiêu đề bài viết tiếng Việt" />
              </div>
              <div className="form-group">
                <label className="form-label">Tóm tắt</label>
                <textarea className="form-textarea" value={excerptVi} onChange={e => setExcerptVi(e.target.value)} rows={3} placeholder="Mô tả ngắn (hiện ở danh sách blog)…" />
              </div>
            </div>
            <div>
              <div className="bilingual-col-header en"><span className="lang-flag en">EN</span> English</div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="English article title" />
              </div>
              <div className="form-group">
                <label className="form-label">Excerpt</label>
                <textarea className="form-textarea" value={excerptEn} onChange={e => setExcerptEn(e.target.value)} rows={3} placeholder="Short description…" />
              </div>
            </div>
          </div>

          {/* 3-col meta row — min-width:0 on each cell prevents content from overflowing
              on narrow admin panels; collapses to 1-col below 640px via flex-wrap */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 16 }}>
            <div className="form-group" style={{ minWidth: 0 }}>
              <label className="form-label">Slug <span className="required">*</span></label>
              <input className="form-input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="bai-viet-slug" />
              {/* title attribute shows the full path on hover; CSS truncates long slugs */}
              <p className="form-hint" title={`/vi/tin-tuc/${slug || '…'}`}>/vi/tin-tuc/{slug || '…'}</p>
            </div>
            <div className="form-group" style={{ minWidth: 0 }}>
              <label className="form-label">Chủ đề</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value as 'pain-based' | 'comparative' | 'case-based' | 'technical')}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ minWidth: 0 }}>
              <label className="form-label">Thời gian đọc (phút)</label>
              <input className="form-input" type="number" value={readingTime} onChange={e => setReadingTime(e.target.value)} placeholder="5" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <input className="form-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="chống thấm, kết cấu thép, tư vấn (phân cách bằng dấu phẩy)" />
          </div>

          <div className="form-group">
            <ImageUploader
              label="Ảnh bìa"
              value={coverImage}
              onChange={setCoverImage}
              folder="posts"
              hint="Tỷ lệ khuyến nghị 16:9 hoặc 2:1, WebP, tối đa 5MB."
            />
          </div>

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

      {tab === 'content' && (
        <div className="admin-card">
          <div className="bilingual-grid">
            <div>
              <div className="bilingual-col-header vi"><span className="lang-flag vi">VI</span> Nội dung tiếng Việt</div>
              <SimpleEditor value={contentVi} onChange={setContentVi} placeholder="Nội dung bài viết tiếng Việt…" />
            </div>
            <div>
              <div className="bilingual-col-header en"><span className="lang-flag en">EN</span> English content</div>
              <SimpleEditor value={contentEn} onChange={setContentEn} placeholder="Article content in English…" />
            </div>
          </div>
        </div>
      )}

      {tab === 'seo' && (
        <div className="admin-card">
          <div className="bilingual-grid">
            <div>
              <div className="bilingual-col-header vi"><span className="lang-flag vi">VI</span> SEO tiếng Việt</div>
              <div className="form-group">
                <label className="form-label">Meta title</label>
                <input className="form-input" value={metaTitleVi} onChange={e => setMetaTitleVi(e.target.value)} maxLength={60} />
                <p className="form-hint">{metaTitleVi.length}/60</p>
              </div>
              <div className="form-group">
                <label className="form-label">Meta description</label>
                <textarea className="form-textarea" value={metaDescVi} onChange={e => setMetaDescVi(e.target.value)} maxLength={160} rows={3} />
                <p className="form-hint">{metaDescVi.length}/160</p>
              </div>
            </div>
            <div>
              <div className="bilingual-col-header en"><span className="lang-flag en">EN</span> SEO English</div>
              <div className="form-group">
                <label className="form-label">Meta title</label>
                <input className="form-input" value={metaTitleEn} onChange={e => setMetaTitleEn(e.target.value)} maxLength={60} />
                <p className="form-hint">{metaTitleEn.length}/60</p>
              </div>
              <div className="form-group">
                <label className="form-label">Meta description</label>
                <textarea className="form-textarea" value={metaDescEn} onChange={e => setMetaDescEn(e.target.value)} maxLength={160} rows={3} />
                <p className="form-hint">{metaDescEn.length}/160</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card" style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" className="btn btn-secondary" onClick={() => router.push('/admin/posts')}>← Quay lại</button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-secondary" disabled={saving} onClick={(e) => handleSubmit(e)}>
            {saving ? 'Đang lưu…' : '💾 Lưu nháp'}
          </button>
          <button type="button" className="btn btn-success" disabled={saving} onClick={(e) => handleSubmit(e, true)}>
            {saving ? 'Đang đăng…' : '🚀 Đăng ngay'}
          </button>
        </div>
      </div>
    </form>
  );
}

function SimpleEditor({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <div className="editor-toolbar">
        {[['bold','B',{fontWeight:700}],['italic','I',{fontStyle:'italic'}],['underline','U',{textDecoration:'underline'}]].map(([cmd, label, style]) => (
          <button key={cmd as string} type="button" onClick={() => document.execCommand(cmd as string, false)} style={style as React.CSSProperties}>{label as string}</button>
        ))}
        <button type="button" onClick={() => document.execCommand('insertUnorderedList', false)}>• List</button>
        <button type="button" onClick={() => document.execCommand('insertOrderedList', false)}>1. List</button>
        <button type="button" onClick={() => document.execCommand('formatBlock', false, 'h2')}>H2</button>
        <button type="button" onClick={() => document.execCommand('formatBlock', false, 'h3')}>H3</button>
        <button type="button" onClick={() => document.execCommand('formatBlock', false, 'p')}>P</button>
      </div>
      <div
        className="rich-editor editor-has-toolbar"
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        style={{ minHeight: 240, maxWidth: '100%', boxSizing: 'border-box' }}
      />
    </div>
  );
}
