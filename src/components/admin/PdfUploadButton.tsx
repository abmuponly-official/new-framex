'use client';

import { useRef, useState } from 'react';

interface Props {
  /** Current value (URL) of the capability_pdf field */
  currentUrl: string;
  /** Called after a successful upload with the public URL */
  onUploaded: (url: string) => void;
}

export default function PdfUploadButton({ currentUrl, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setStatus('error');
      setErrorMsg('Chỉ chấp nhận file PDF.');
      return;
    }

    setStatus('uploading');
    setErrorMsg('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'settings');

      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(json.error ?? 'Upload thất bại.');
        return;
      }

      onUploaded(json.url as string);
      setStatus('done');
    } catch {
      setStatus('error');
      setErrorMsg('Lỗi kết nối, vui lòng thử lại.');
    } finally {
      // reset input so user can upload the same file again if needed
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div style={{ marginTop: 8 }}>
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Upload button */}
      <button
        type="button"
        className="btn btn-secondary"
        style={{ fontSize: 13, padding: '6px 14px' }}
        disabled={status === 'uploading'}
        onClick={() => inputRef.current?.click()}
      >
        {status === 'uploading' ? (
          <>⏳ Đang tải lên…</>
        ) : (
          <>📎 Tải lên file PDF mới</>
        )}
      </button>

      {/* Current file preview */}
      {currentUrl && (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginLeft: 12,
            fontSize: 12,
            color: '#6b7280',
            textDecoration: 'underline',
          }}
        >
          📄 Xem file hiện tại
        </a>
      )}

      {/* Status messages */}
      {status === 'done' && (
        <p style={{ marginTop: 6, fontSize: 12, color: '#16a34a' }}>
          ✅ Upload thành công! URL đã được cập nhật — nhấn "Lưu tất cả cài đặt" để lưu.
        </p>
      )}
      {status === 'error' && (
        <p style={{ marginTop: 6, fontSize: 12, color: '#dc2626' }}>❌ {errorMsg}</p>
      )}

      <p style={{ marginTop: 6, fontSize: 11, color: '#9ca3af' }}>
        Chỉ hỗ trợ PDF · Tối đa 20 MB
      </p>
    </div>
  );
}
