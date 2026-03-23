'use client';
import { useState } from 'react';
import type { SiteSetting } from '@/types/content';
import PdfUploadButton from '@/components/admin/PdfUploadButton';

const SETTING_LABELS: Record<string, { label: string; hint?: string }> = {
  contact_email:    { label: 'Email liên lạc', hint: 'Hiển thị trong footer và trang liên hệ' },
  contact_phone:    { label: 'Số điện thoại', hint: 'Hiển thị trong footer và trang liên hệ' },
  address:          { label: 'Địa chỉ văn phòng', hint: 'Hiển thị trong footer' },
  capability_pdf:   { label: 'Hồ sơ năng lực (PDF)', hint: 'File PDF có thể tải lên Supabase Storage hoặc nhập URL thủ công' },
  facebook_url:     { label: 'Facebook URL', hint: '' },
  zalo_url:         { label: 'Zalo URL', hint: '' },
  youtube_url:      { label: 'YouTube URL', hint: 'Kênh YouTube của FrameX' },
  warehouse_url:    { label: '3D Warehouse URL', hint: 'Trang SketchUp 3D Warehouse của FrameX' },
  pinterest_url:    { label: 'Pinterest URL', hint: 'Trang Pinterest của FrameX' },
};

export default function SettingsForm({ settings }: { settings: SiteSetting[] }) {
  const [values, setValues] = useState<Record<string, { vi: string; en: string }>>(() => {
    const map: Record<string, { vi: string; en: string }> = {};
    settings.forEach((s) => {
      map[s.key] = { vi: s.value_vi ?? '', en: s.value_en ?? '' };
    });
    return map;
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSave() {
    setSaving(true);
    setMessage('');

    const updates = Object.entries(values).map(([key, val]) => ({
      key, value_vi: val.vi, value_en: val.en,
    }));

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: updates }),
    });

    setSaving(false);
    if (res.ok) {
      setMessage('✅ Đã lưu cài đặt thành công!');
    } else {
      const j = await res.json();
      setMessage(`❌ Lỗi: ${j.error}`);
    }
  }

  const allKeys = [...new Set([...settings.map(s => s.key), ...Object.keys(SETTING_LABELS)])];

  return (
    <div>
      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>
          {message}
        </div>
      )}

      {allKeys.map((key) => {
        const meta = SETTING_LABELS[key];
        const val = values[key] ?? { vi: '', en: '' };
        const isBilingual = !['facebook_url', 'zalo_url', 'youtube_url', 'warehouse_url', 'pinterest_url', 'capability_pdf'].includes(key);

        return (
          <div key={key} className="admin-card" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{meta?.label ?? key}</div>
              {meta?.hint && <div style={{ fontSize: 12, color: '#9ca3af' }}>{meta.hint}</div>}
            </div>

            {isBilingual ? (
              /* ── Bilingual text fields (email, phone, address, …) ── */
              <div className="bilingual-grid">
                <div>
                  <div className="bilingual-col-header vi">
                    <span className="lang-flag vi">VI</span> Tiếng Việt
                  </div>
                  <input
                    className="form-input"
                    value={val.vi}
                    onChange={(e) => setValues((prev) => ({ ...prev, [key]: { ...prev[key], vi: e.target.value } }))}
                    placeholder={`Giá trị tiếng Việt cho ${key}`}
                  />
                </div>
                <div>
                  <div className="bilingual-col-header en">
                    <span className="lang-flag en">EN</span> English
                  </div>
                  <input
                    className="form-input"
                    value={val.en}
                    onChange={(e) => setValues((prev) => ({ ...prev, [key]: { ...prev[key], en: e.target.value } }))}
                    placeholder={`English value for ${key}`}
                  />
                </div>
              </div>
            ) : key === 'capability_pdf' ? (
              /* ── Capability PDF: URL input + upload button ── */
              <div>
                <input
                  className="form-input"
                  style={{ maxWidth: 520 }}
                  value={val.vi}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [key]: { vi: e.target.value, en: e.target.value } }))
                  }
                  placeholder="/files/framex-capability.pdf hoặc URL Supabase Storage"
                />
                <PdfUploadButton
                  currentUrl={val.vi}
                  onUploaded={(url) =>
                    setValues((prev) => ({ ...prev, [key]: { vi: url, en: url } }))
                  }
                />
              </div>
            ) : (
              /* ── Single-value URL fields (social, …) ── */
              <input
                className="form-input"
                style={{ maxWidth: 480 }}
                value={val.vi}
                onChange={(e) => setValues((prev) => ({ ...prev, [key]: { vi: e.target.value, en: e.target.value } }))}
                placeholder={`Value for ${key}`}
              />
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 24 }}>
        <button type="button" className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu…' : '💾 Lưu tất cả cài đặt'}
        </button>
      </div>
    </div>
  );
}
