'use client';
import { useState, useRef, useCallback } from 'react';

interface UploadedFile {
  url: string;
  path: string;
  name: string;
  size: number;
}

interface Props {
  /** Current value — single URL string */
  value: string;
  onChange: (url: string) => void;
  /** Subfolder in Supabase Storage bucket */
  folder?: string;
  label?: string;
  hint?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = 'general',
  label = 'Ảnh',
  hint,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError('');

      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);

      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? 'Upload thất bại');
          return;
        }

        onChange((data as UploadedFile).url);
      } catch {
        setError('Lỗi kết nối khi upload');
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleRemove() {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      <label className="form-label">{label}</label>

      {/* Drop zone / preview */}
      {value ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={value}
            alt="Preview"
            style={{
              maxWidth: 360,
              maxHeight: 240,
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              display: 'block',
            }}
          />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => inputRef.current?.click()}
            >
              🔄 Đổi ảnh
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleRemove}
            >
              🗑️ Xoá
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`upload-zone${dragOver ? ' drag-over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div style={{ color: '#6b7280', fontSize: 14 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              Đang upload…
            </div>
          ) : (
            <>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
              <div className="upload-zone-text">
                Kéo thả ảnh vào đây hoặc <span style={{ color: '#3b82f6', fontWeight: 500 }}>chọn file</span>
              </div>
              <div className="upload-zone-hint">JPG, PNG, WebP · Tối đa 5MB</div>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Manual URL input */}
      <div style={{ marginTop: 10 }}>
        <input
          className="form-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Hoặc dán URL ảnh trực tiếp…"
          style={{ fontSize: 12, color: '#6b7280' }}
        />
      </div>

      {error && <p className="form-error">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  );
}
