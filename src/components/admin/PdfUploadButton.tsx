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
  const [status, setStatus]   = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side guard (belt + suspenders alongside server validation)
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setStatus('error');
      setErrorMsg(`Chỉ chấp nhận file PDF. File bạn chọn: "${file.name}" (${file.type || 'unknown type'})`);
      return;
    }

    setStatus('uploading');
    setErrorMsg('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'brochures'); // dedicated folder in framex-media bucket

      // ── Use the dedicated PDF endpoint (not the shared image endpoint) ──
      const res  = await fetch('/api/admin/upload/pdf', { method: 'POST', body: fd });
      const json = await res.json() as { url?: string; error?: string };

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(json.error ?? 'Upload thất bại, vui lòng thử lại.');
        return;
      }

      onUploaded(json.url!);
      setStatus('done');
    } catch {
      setStatus('error');
      setErrorMsg('Lỗi kết nối tới server, vui lòng thử lại.');
    } finally {
      // Reset so same file can be re-uploaded if needed
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div style={{ marginTop: 8 }}>
      {/* Hidden native file input — only accepts PDF */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Upload trigger button */}
      <button
        type="button"
        className="btn btn-secondary"
        style={{ fontSize: 13, padding: '6px 14px' }}
        disabled={status === 'uploading'}
        onClick={() => {
          setStatus('idle');
          setErrorMsg('');
          inputRef.current?.click();
        }}
      >
        {status === 'uploading' ? '⏳ Đang tải lên…' : '📎 Tải lên file PDF mới'}
      </button>

      {/* Preview current file */}
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

      {/* Success */}
      {status === 'done' && (
        <p style={{ marginTop: 6, fontSize: 12, color: '#16a34a' }}>
          ✅ Upload thành công! URL đã được điền — nhấn &ldquo;Lưu tất cả cài đặt&rdquo; để lưu vào database.
        </p>
      )}

      {/* Error */}
      {status === 'error' && (
        <p style={{ marginTop: 6, fontSize: 12, color: '#dc2626' }}>❌ {errorMsg}</p>
      )}

      <p style={{ marginTop: 6, fontSize: 11, color: '#9ca3af' }}>
        Chỉ hỗ trợ PDF · Tối đa 20 MB
      </p>
    </div>
  );
}
