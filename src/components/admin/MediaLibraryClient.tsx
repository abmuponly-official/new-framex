'use client';
import { useState, useEffect, useRef } from 'react';

interface MediaFile {
  name: string;
  url: string;
  path: string;
  folder?: string;
  metadata?: { size?: number; mimetype?: string };
  created_at?: string;
}

// Must stay in sync with ALL_FOLDERS in /api/admin/upload/route.ts
const FOLDERS = ['all', 'projects', 'posts', 'settings', 'general', 'brochures'];

function isPdf(file: MediaFile) {
  return (
    file.metadata?.mimetype === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf')
  );
}

/** Thumbnail for one media item — shows PDF icon for PDFs */
function MediaThumb({ file, selected }: { file: MediaFile; selected: boolean }) {
  const pdf = isPdf(file);
  return (
    <div
      style={{
        cursor: 'pointer',
        borderRadius: 8,
        border: `2px solid ${selected ? '#3b82f6' : '#e5e7eb'}`,
        overflow: 'hidden',
        background: '#f9fafb',
        transition: 'border .15s',
      }}
    >
      <div
        style={{
          width: '100%',
          paddingBottom: '75%',
          position: 'relative',
          background: pdf ? '#fef3c7' : '#f3f4f6',
        }}
      >
        {pdf ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 32 }}>📄</span>
            <span style={{ fontSize: 10, color: '#92400e', fontWeight: 600 }}>PDF</span>
          </div>
        ) : (
          <img
            src={file.url}
            alt={file.name}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 75"><rect fill="%23f3f4f6" width="100" height="75"/><text y="40" x="50" text-anchor="middle" fill="%23d1d5db" font-size="12">IMG</text></svg>';
            }}
          />
        )}
      </div>
      <div style={{ padding: '6px 8px' }}>
        <div
          style={{
            fontSize: 11,
            color: '#374151',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {file.name}
        </div>
        {file.folder && (
          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>
            {file.folder}/
          </div>
        )}
      </div>
    </div>
  );
}

export default function MediaLibraryClient() {
  const [folder, setFolder]     = useState('all');
  const [files, setFiles]       = useState<MediaFile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadFiles(f: string) {
    setLoading(true);
    setError('');
    setSelected(null);
    try {
      // Pass folder param — empty string = 'all' handled by API
      const res  = await fetch(`/api/admin/upload?folder=${f === 'all' ? '' : f}&limit=200`);
      const data = await res.json() as { files?: MediaFile[]; error?: string };
      if (!res.ok) { setError(data.error ?? 'Lỗi không xác định'); return; }
      setFiles(data.files ?? []);
    } catch {
      setError('Không thể tải danh sách file');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFiles(folder); }, [folder]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadFolder = folder === 'all' ? 'general' : folder;
    const selectedFiles = Array.from(e.target.files ?? []);
    if (!selectedFiles.length) return;

    setUploading(true);
    setError('');

    for (const file of selectedFiles) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', uploadFolder);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setError(d.error ?? 'Upload thất bại');
      }
    }

    setUploading(false);
    // Reload after all uploads complete
    await loadFiles(folder);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function handleDelete(path: string) {
    if (!confirm('Xoá file này? Hành động không thể hoàn tác.')) return;
    const res = await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f.path !== path));
      if (selected === path) setSelected(null);
    } else {
      const d = await res.json() as { error?: string };
      setError(d.error ?? 'Xoá thất bại');
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const selectedFile = files.find((f) => f.path === selected);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
      {/* ── Main panel ──────────────────────────────────────────── */}
      <div>
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 20,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Folder tabs */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {FOLDERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`btn btn-sm ${folder === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFolder(f)}
              >
                {f}
                {f === 'all' && files.length > 0 && folder === 'all' && (
                  <span
                    style={{
                      marginLeft: 5,
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: 10,
                      padding: '1px 6px',
                      fontSize: 10,
                    }}
                  >
                    {files.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Refresh button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => loadFiles(folder)}
            disabled={loading}
            title="Làm mới danh sách"
          >
            🔄
          </button>

          {/* Upload button — images only in media library */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? '⏳ Đang upload…' : '📤 Upload ảnh'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            multiple
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
            ⏳ Đang tải…
          </div>
        ) : files.length === 0 ? (
          <div
            className="upload-zone"
            style={{ padding: 60 }}
            onClick={() => inputRef.current?.click()}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
            <div className="upload-zone-text">
              {folder === 'all'
                ? 'Chưa có file nào — click để upload ảnh đầu tiên'
                : `Thư mục "${folder}" trống — click để upload`}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 10,
            }}
          >
            {files.map((f) => (
              <div
                key={f.path}
                onClick={() => setSelected(f.path === selected ? null : f.path)}
              >
                <MediaThumb file={f} selected={selected === f.path} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail panel ─────────────────────────────────────────── */}
      <div>
        {selectedFile ? (
          <div className="admin-card" style={{ position: 'sticky', top: 80 }}>
            {/* Preview: image or PDF icon */}
            {isPdf(selectedFile) ? (
              <div
                style={{
                  width: '100%',
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fef3c7',
                  borderRadius: 7,
                  marginBottom: 16,
                  border: '1px solid #fde68a',
                }}
              >
                <span style={{ fontSize: 48 }}>📄</span>
              </div>
            ) : (
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                style={{
                  width: '100%',
                  borderRadius: 7,
                  marginBottom: 16,
                  border: '1px solid #e5e7eb',
                  maxHeight: 200,
                  objectFit: 'cover',
                }}
              />
            )}

            <div style={{ fontSize: 13, wordBreak: 'break-all', marginBottom: 8 }}>
              <strong>Tên file:</strong>
              <br />
              <span style={{ color: '#6b7280' }}>{selectedFile.name}</span>
            </div>
            {selectedFile.folder && (
              <div style={{ fontSize: 13, marginBottom: 8 }}>
                <strong>Thư mục:</strong>{' '}
                <span style={{ color: '#6b7280' }}>{selectedFile.folder}/</span>
              </div>
            )}
            <div style={{ fontSize: 13, marginBottom: 12 }}>
              <strong>Đường dẫn:</strong>
              <br />
              <span
                style={{ color: '#6b7280', fontFamily: 'monospace', fontSize: 11 }}
              >
                {selectedFile.path}
              </span>
            </div>
            {selectedFile.metadata?.size ? (
              <div style={{ fontSize: 13, marginBottom: 16 }}>
                <strong>Kích thước:</strong>{' '}
                <span style={{ color: '#6b7280' }}>
                  {selectedFile.metadata.size >= 1024 * 1024
                    ? `${(selectedFile.metadata.size / 1024 / 1024).toFixed(1)} MB`
                    : `${(selectedFile.metadata.size / 1024).toFixed(1)} KB`}
                </span>
              </div>
            ) : null}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => copyUrl(selectedFile.url)}
                style={{ justifyContent: 'center' }}
              >
                {copied ? '✅ Đã copy!' : '📋 Copy URL'}
              </button>
              <a
                href={selectedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ justifyContent: 'center', textAlign: 'center' }}
              >
                {isPdf(selectedFile) ? '📄 Mở PDF' : '🔗 Mở ảnh'}
              </a>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(selectedFile.path)}
                style={{ justifyContent: 'center' }}
              >
                🗑️ Xoá file
              </button>
            </div>
          </div>
        ) : (
          <div
            className="admin-card"
            style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>👆</div>
            <div style={{ fontSize: 14 }}>Chọn một file để xem chi tiết</div>
          </div>
        )}
      </div>
    </div>
  );
}
