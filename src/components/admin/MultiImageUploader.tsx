'use client';
import { useState, useRef, useCallback } from 'react';

interface ImageItem {
  url: string;
  path: string;
  name: string;
}

interface Props {
  value: string[];           // array of URLs
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
}

export default function MultiImageUploader({
  value = [],
  onChange,
  folder = 'general',
  label = 'Thư viện ảnh',
  maxImages = 20,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (value.length >= maxImages) {
        setError(`Tối đa ${maxImages} ảnh.`);
        return;
      }

      setUploading(true);
      setError('');
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);

      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? 'Upload thất bại'); return; }
        onChange([...value, (data as ImageItem).url]);
      } catch {
        setError('Lỗi kết nối khi upload');
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, folder, maxImages]
  );

  async function handleFiles(files: FileList) {
    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
  }

  function handleRemove(index: number) {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  }

  function handleMoveLeft(index: number) {
    if (index === 0) return;
    const next = [...value];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function handleMoveRight(index: number) {
    if (index === value.length - 1) return;
    const next = [...value];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <label className="form-label" style={{ margin: 0 }}>{label}</label>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{value.length}/{maxImages} ảnh</span>
      </div>

      {/* Existing images */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          {value.map((url, i) => (
            <div
              key={`${url}-${i}`}
              style={{ position: 'relative', display: 'inline-block' }}
            >
              <img
                src={url}
                alt={`Image ${i + 1}`}
                style={{
                  width: 100, height: 80, objectFit: 'cover',
                  borderRadius: 7, border: '1px solid #e5e7eb',
                  display: 'block',
                }}
              />
              {/* Order indicator */}
              <div style={{
                position: 'absolute', top: 4, left: 4,
                background: 'rgba(0,0,0,0.6)', color: '#fff',
                borderRadius: 4, fontSize: 10, padding: '1px 5px',
                fontWeight: 600,
              }}>
                {i + 1}
              </div>
              {/* Controls overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0)', borderRadius: 7,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                gap: 2, paddingBottom: 4,
                opacity: 0, transition: 'opacity .2s',
              }}
                className="img-controls"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.4)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0)'; }}
              >
                <button type="button" onClick={() => handleMoveLeft(i)} style={{ fontSize: 12, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 3, padding: '2px 5px', cursor: 'pointer' }} title="Di chuyển trái">←</button>
                <button type="button" onClick={() => handleRemove(i)} style={{ fontSize: 12, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 3, padding: '2px 5px', cursor: 'pointer' }} title="Xoá">✕</button>
                <button type="button" onClick={() => handleMoveRight(i)} style={{ fontSize: 12, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 3, padding: '2px 5px', cursor: 'pointer' }} title="Di chuyển phải">→</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {value.length < maxImages && (
        <div
          className={`upload-zone${dragOver ? ' drag-over' : ''}`}
          style={{ padding: '20px', marginBottom: 8 }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
        >
          {uploading ? (
            <div style={{ fontSize: 14, color: '#6b7280' }}>⏳ Đang upload…</div>
          ) : (
            <>
              <div style={{ fontSize: 24, marginBottom: 6 }}>+</div>
              <div className="upload-zone-text" style={{ fontSize: 13 }}>
                Kéo thả hoặc <span style={{ color: '#3b82f6' }}>chọn ảnh</span>
              </div>
              <div className="upload-zone-hint">Có thể chọn nhiều ảnh cùng lúc</div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
      />

      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
