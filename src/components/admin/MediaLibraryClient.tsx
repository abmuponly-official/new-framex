'use client';
import { useState, useEffect, useRef } from 'react';

interface MediaFile {
  name: string;
  url: string;
  path: string;
  metadata?: { size?: number; mimetype?: string };
  created_at?: string;
}

const FOLDERS = ['all', 'projects', 'posts', 'settings', 'general'];

export default function MediaLibraryClient() {
  const [folder, setFolder] = useState('all');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadFiles(f: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/upload?folder=${f === 'all' ? '' : f}&limit=100`);
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setFiles(data.files ?? []);
    } catch {
      setError('Không thể tải danh sách ảnh');
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
        const d = await res.json();
        setError(d.error ?? 'Upload thất bại');
      }
    }
    setUploading(false);
    loadFiles(folder);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function handleDelete(path: string) {
    if (!confirm('Xoá ảnh này? Hành động không thể hoàn tác.')) return;
    const res = await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f.path !== path));
      if (selected === path) setSelected(null);
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
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Folder tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {FOLDERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`btn btn-sm ${folder === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFolder(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Upload button */}
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

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

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
            <div className="upload-zone-text">Thư mục trống — click để upload ảnh đầu tiên</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {files.map((f) => (
              <div
                key={f.path}
                onClick={() => setSelected(f.path === selected ? null : f.path)}
                style={{
                  cursor: 'pointer',
                  borderRadius: 8,
                  border: `2px solid ${selected === f.path ? '#3b82f6' : '#e5e7eb'}`,
                  overflow: 'hidden',
                  background: '#f9fafb',
                  transition: 'border .15s',
                }}
              >
                <div style={{ width: '100%', paddingBottom: '75%', position: 'relative', background: '#f3f4f6' }}>
                  <img
                    src={f.url}
                    alt={f.name}
                    loading="lazy"
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 75"><rect fill="%23f3f4f6" width="100" height="75"/><text y="40" x="50" text-anchor="middle" fill="%23d1d5db" font-size="12">IMG</text></svg>';
                    }}
                  />
                </div>
                <div style={{ padding: '6px 8px' }}>
                  <div style={{ fontSize: 11, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail panel ─────────────────────────────────────────── */}
      <div>
        {selectedFile ? (
          <div className="admin-card" style={{ position: 'sticky', top: 80 }}>
            <img
              src={selectedFile.url}
              alt={selectedFile.name}
              style={{ width: '100%', borderRadius: 7, marginBottom: 16, border: '1px solid #e5e7eb' }}
            />
            <div style={{ fontSize: 13, wordBreak: 'break-all', marginBottom: 12 }}>
              <strong>Tên file:</strong><br />
              <span style={{ color: '#6b7280' }}>{selectedFile.name}</span>
            </div>
            <div style={{ fontSize: 13, marginBottom: 12 }}>
              <strong>Đường dẫn:</strong><br />
              <span style={{ color: '#6b7280', fontFamily: 'monospace', fontSize: 11 }}>{selectedFile.path}</span>
            </div>
            {selectedFile.metadata?.size && (
              <div style={{ fontSize: 13, marginBottom: 16 }}>
                <strong>Kích thước:</strong>{' '}
                <span style={{ color: '#6b7280' }}>{(selectedFile.metadata.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
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
                🔗 Mở ảnh
              </a>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(selectedFile.path)}
                style={{ justifyContent: 'center' }}
              >
                🗑️ Xoá ảnh
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-card" style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>👆</div>
            <div style={{ fontSize: 14 }}>Chọn một ảnh để xem chi tiết</div>
          </div>
        )}
      </div>
    </div>
  );
}
