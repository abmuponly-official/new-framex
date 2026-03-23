'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
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
          <div className="bilingual-grid" style={{ marginBottom: 20 }}>
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

          {/* 3-col meta row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 16 }}>
            <div className="form-group" style={{ minWidth: 0 }}>
              <label className="form-label">Slug <span className="required">*</span></label>
              <input className="form-input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="bai-viet-slug" />
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
            {coverImage && (
              <img src={coverImage} alt="Cover preview" className="cover-preview" />
            )}
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

      {/* ── Sticky action bar ─────────────────────────────────────────────── */}
      <div className="form-action-bar">
        <button type="button" className="btn btn-secondary" onClick={() => router.push('/admin/posts')}>
          ← Quay lại
        </button>
        <div className="form-action-bar-right">
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

// ── SimpleEditor ─────────────────────────────────────────────────────────────
//
// Key fixes vs the old implementation:
//
// 1. useRef instead of dangerouslySetInnerHTML
//    The old editor used dangerouslySetInnerHTML={{ __html: value }} on every
//    render. Because value comes from React state (updated on every keystroke),
//    React kept replacing the editor's innerHTML — destroying the browser's
//    cursor/selection position on every keypress. Fix: mount the initial HTML
//    once via useEffect on the ref, then NEVER write innerHTML again from React;
//    let the browser own the DOM and only read from it via onInput.
//
// 2. mousedown.preventDefault() on toolbar buttons
//    Without this, clicking a toolbar button causes the editor to lose focus
//    first (blur event fires), then execCommand runs on no selection. Fix:
//    preventDefault() on mousedown stops the blur from happening, so the editor
//    selection is preserved when execCommand fires on the click event.
//
// 3. Placeholder via CSS class (is-empty)
//    contentEditable with :empty:before works only when the element is truly
//    empty in the DOM. After the user types then deletes everything, the div
//    contains a <br> (inserted by contentEditable) so :empty never matches.
//    Fix: toggle the .is-empty class based on whether innerHTML is ''/'<br>'.
//
// 4. editor-wrap container
//    Wraps toolbar + editor in a flex-column so they form one visual unit and
//    correctly obey min-width:0 inside the bilingual-grid.
//
// ────────────────────────────────────────────────────────────────────────────

const TOOLBAR_BUTTONS = [
  { cmd: 'bold',               label: 'B',      style: { fontWeight: 700 },       title: 'Bold (Ctrl+B)',          group: 1 },
  { cmd: 'italic',             label: 'I',      style: { fontStyle: 'italic' },   title: 'Italic (Ctrl+I)',        group: 1 },
  { cmd: 'underline',          label: 'U',      style: { textDecoration: 'underline' }, title: 'Underline (Ctrl+U)', group: 1 },
  { cmd: 'insertUnorderedList',label: '• List', style: {},                        title: 'Bullet list',            group: 2 },
  { cmd: 'insertOrderedList',  label: '1. List',style: {},                        title: 'Numbered list',          group: 2 },
  { cmd: 'h2',                 label: 'H2',     style: { fontWeight: 700 },       title: 'Heading 2',              group: 3, isBlock: true },
  { cmd: 'h3',                 label: 'H3',     style: { fontWeight: 600 },       title: 'Heading 3',              group: 3, isBlock: true },
  { cmd: 'p',                  label: 'P',      style: {},                        title: 'Paragraph',              group: 3, isBlock: true },
];

function SimpleEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  // Track whether we are initialised to avoid writing innerHTML after mount
  const initialised = useRef(false);

  // Mount: write initial HTML once
  useEffect(() => {
    if (!initialised.current && editorRef.current) {
      editorRef.current.innerHTML = value;
      initialised.current = true;
      updatePlaceholder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the parent resets value to '' (e.g. after form submit), clear the editor
  useEffect(() => {
    if (initialised.current && value === '' && editorRef.current) {
      editorRef.current.innerHTML = '';
      updatePlaceholder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function updatePlaceholder() {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const isEmpty = html === '' || html === '<br>';
    editorRef.current.classList.toggle('is-empty', isEmpty);
  }

  function handleInput() {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
    updatePlaceholder();
  }

  // Execute a formatting command without losing editor focus.
  // mouseDown.preventDefault() must be called on the button to stop blur,
  // but we still need to call exec AFTER the event bubbles — that happens
  // naturally because click fires after mousedown + mouseup.
  const execCmd = useCallback((cmd: string, isBlock?: boolean) => {
    if (isBlock) {
      document.execCommand('formatBlock', false, cmd);
    } else {
      document.execCommand(cmd, false, undefined);
    }
    // Re-read content after command
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      updatePlaceholder();
      editorRef.current.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange]);

  return (
    <div className="editor-wrap">
      <div className="editor-toolbar">
        {TOOLBAR_BUTTONS.map((btn, idx) => {
          // Insert a visual separator when group changes
          const prevGroup = idx > 0 ? TOOLBAR_BUTTONS[idx - 1].group : btn.group;
          const sep = btn.group !== prevGroup;
          return (
            <span key={btn.cmd} style={{ display: 'contents' }}>
              {sep && <span className="editor-toolbar-sep" aria-hidden="true" />}
              <button
                type="button"
                title={btn.title}
                style={btn.style as React.CSSProperties}
                // CRITICAL: preventDefault stops the editor from losing focus
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCmd(btn.cmd, btn.isBlock)}
              >
                {btn.label}
              </button>
            </span>
          );
        })}
      </div>
      <div
        ref={editorRef}
        className="rich-editor editor-has-toolbar"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight: 400, maxWidth: '100%', boxSizing: 'border-box' }}
      />
    </div>
  );
}
