'use client';
import { useState, useRef } from 'react';

interface Props {
  value: string[];           // array of public URLs managed by the parent
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
}

// ── Component ──────────────────────────────────────────────────────────────
//
// BUG FIXED: "only the last image survives when selecting multiple files"
//
// ROOT CAUSE (old code):
//   uploadFile was wrapped in useCallback([value, …]).
//   handleFiles called `await uploadFile(file)` in a for…of loop.
//   Each call captured the SAME stale `value` snapshot from the render
//   when the batch started, so every iteration executed:
//     onChange([...staleValue, newUrl])   ← always starts from the same empty array
//   Result: each file overwrote the previous one; only the last URL survived.
//
// FIX:
//   Keep a LOCAL mutable array `accumulated` that starts as a copy of `value`.
//   After each successful upload, push the new URL into `accumulated` and
//   call onChange(accumulated) with the COMPLETE, always-up-to-date list.
//   This is a plain variable inside the async function — no closure trap,
//   no stale state, no React re-render dependency.
//
export default function MultiImageUploader({
  value = [],
  onChange,
  folder = 'general',
  label = 'Thư viện ảnh',
  maxImages = 20,
}: Props) {
  // ── Upload-progress state ──────────────────────────────────────────────────
  const [uploadState, setUploadState] = useState<{
    total: number;   // files in this batch (incl. skipped)
    done: number;    // successfully uploaded
    failed: number;  // failed or skipped
  }>({ total: 0, done: 0, failed: 0 });

  // Per-file error map:  filename → error message
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isUploading =
    uploadState.total > 0 &&
    uploadState.done + uploadState.failed < uploadState.total;

  // ── Upload one file, append its URL to `accumulated` ──────────────────────
  // Returns the uploaded URL on success, null on failure.
  async function uploadOneFile(
    file: File,
    currentCount: number,      // length of `accumulated` at call time
    accumulated: string[],     // mutable array — push URL here on success
  ): Promise<string | null> {
    if (currentCount >= maxImages) {
      setFileErrors(prev => ({
        ...prev,
        [file.name]: `Đã đạt giới hạn ${maxImages} ảnh`,
      }));
      return null;
    }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);

    try {
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json() as { url?: string; error?: string };

      if (!res.ok) {
        setFileErrors(prev => ({
          ...prev,
          [file.name]: data.error ?? 'Upload thất bại',
        }));
        return null;
      }

      const url = data.url!;
      accumulated.push(url);          // ← mutate the shared local array
      onChange([...accumulated]);     // ← send complete up-to-date list to parent
      return url;
    } catch {
      setFileErrors(prev => ({
        ...prev,
        [file.name]: 'Lỗi kết nối',
      }));
      return null;
    }
  }

  // ── Batch handler ──────────────────────────────────────────────────────────
  async function handleFiles(files: FileList) {
    const list = Array.from(files);
    if (list.length === 0) return;

    setFileErrors({});

    // How many slots remain?
    const slots     = maxImages - value.length;
    const toUpload  = list.slice(0, Math.max(0, slots));
    const skipped   = list.length - toUpload.length;

    if (toUpload.length === 0) {
      setFileErrors({ _batch: `Đã đạt giới hạn ${maxImages} ảnh.` });
      return;
    }

    setUploadState({ total: list.length, done: 0, failed: skipped });

    // ✅ The accumulated array starts as a copy of the current gallery URLs.
    //    We pass it by reference into uploadOneFile so every iteration sees the
    //    URLs added by all previous iterations — no closure staleness possible.
    const accumulated: string[] = [...value];
    let doneSoFar   = 0;
    let failedSoFar = skipped;

    for (const file of toUpload) {
      const url = await uploadOneFile(file, accumulated.length, accumulated);
      // Note: uploadOneFile already pushed into `accumulated` on success.

      if (url !== null) {
        doneSoFar++;
      } else {
        failedSoFar++;
      }

      setUploadState({ total: list.length, done: doneSoFar, failed: failedSoFar });
    }

    // Reset <input> so the same files can be re-selected after a failure
    if (inputRef.current) inputRef.current.value = '';

    // Show final status for 1.5 s then clear progress bar
    setTimeout(() => setUploadState({ total: 0, done: 0, failed: 0 }), 1500);
  }

  // ── Reorder / remove ───────────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  const progressPct =
    uploadState.total > 0
      ? Math.round(
          ((uploadState.done + uploadState.failed) / uploadState.total) * 100,
        )
      : 0;

  const batchErrors = Object.entries(fileErrors);

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <label className="form-label" style={{ margin: 0 }}>{label}</label>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{value.length}/{maxImages} ảnh</span>
      </div>

      {/* Thumbnail grid of already-uploaded images */}
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
              {/* Order badge */}
              <div style={{
                position: 'absolute', top: 4, left: 4,
                background: 'rgba(0,0,0,0.6)', color: '#fff',
                borderRadius: 4, fontSize: 10, padding: '1px 5px', fontWeight: 600,
              }}>
                {i + 1}
              </div>
              {/* Controls overlay (visible on hover) */}
              <div
                className="img-controls"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0)', borderRadius: 7,
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                  gap: 2, paddingBottom: 4,
                  opacity: 0, transition: 'opacity .2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0)';
                }}
              >
                <button type="button" onClick={() => handleMoveLeft(i)}
                  style={{ fontSize: 12, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 3, padding: '2px 5px', cursor: 'pointer' }}
                  title="Di chuyển trái">←</button>
                <button type="button" onClick={() => handleRemove(i)}
                  style={{ fontSize: 12, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 3, padding: '2px 5px', cursor: 'pointer' }}
                  title="Xoá">✕</button>
                <button type="button" onClick={() => handleMoveRight(i)}
                  style={{ fontSize: 12, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 3, padding: '2px 5px', cursor: 'pointer' }}
                  title="Di chuyển phải">→</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload progress bar — visible during and just after a batch */}
      {uploadState.total > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{
            height: 6, borderRadius: 3,
            background: '#e5e7eb', overflow: 'hidden', marginBottom: 6,
          }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: isUploading
                ? '#3b82f6'
                : uploadState.failed > 0 && uploadState.done === 0
                  ? '#dc2626'
                  : '#16a34a',
              transition: 'width .3s ease',
              borderRadius: 3,
            }} />
          </div>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
            {isUploading
              ? `⏳ Đang upload ${uploadState.done + uploadState.failed + 1} / ${uploadState.total}…`
              : uploadState.failed === 0
                ? `✅ Đã upload ${uploadState.done} ảnh thành công`
                : `⚠️ ${uploadState.done} thành công · ${uploadState.failed} thất bại`
            }
          </p>
        </div>
      )}

      {/* Drop zone — hidden when at capacity */}
      {value.length < maxImages && (
        <div
          className={`upload-zone${dragOver ? ' drag-over' : ''}`}
          style={{
            padding: '20px', marginBottom: 8,
            cursor: isUploading ? 'not-allowed' : 'pointer',
            opacity: isUploading ? 0.6 : 1,
          }}
          onClick={() => { if (!isUploading) inputRef.current?.click(); }}
          onDragOver={(e) => { e.preventDefault(); if (!isUploading) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!isUploading && e.dataTransfer.files.length > 0) {
              handleFiles(e.dataTransfer.files);
            }
          }}
        >
          {isUploading ? (
            <div style={{ fontSize: 14, color: '#6b7280' }}>⏳ Đang upload…</div>
          ) : (
            <>
              <div style={{ fontSize: 24, marginBottom: 6 }}>+</div>
              <div className="upload-zone-text" style={{ fontSize: 13 }}>
                Kéo thả hoặc <span style={{ color: '#3b82f6' }}>chọn ảnh</span>
              </div>
              <div className="upload-zone-hint">
                Có thể chọn nhiều ảnh cùng lúc · Tối đa {maxImages} ảnh
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden file input — multiple selection enabled */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
          }
        }}
      />

      {/* Per-file error list */}
      {batchErrors.length > 0 && (
        <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none' }}>
          {batchErrors.map(([filename, msg]) => (
            <li key={filename} className="form-error" style={{ marginBottom: 2 }}>
              {filename === '_batch' ? msg : `${filename}: ${msg}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
