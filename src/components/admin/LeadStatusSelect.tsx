'use client';

import { useState } from 'react';

interface Props {
  leadId: string;
  currentStatus: string;
}

export default function LeadStatusSelect({ leadId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: string) {
    setSaving(true);
    setStatus(newStatus);
    try {
      const fd = new FormData();
      fd.set('status', newStatus);
      await fetch(`/api/admin/leads/${leadId}/status`, { method: 'POST', body: fd });
    } catch {
      // revert on error
      setStatus(currentStatus);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      name="status"
      value={status}
      disabled={saving}
      className="form-select"
      style={{ width: 140, fontSize: 12, padding: '4px 8px', opacity: saving ? 0.6 : 1 }}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="new">Mới</option>
      <option value="contacted">Đã liên hệ</option>
      <option value="qualified">Tiềm năng cao</option>
      <option value="closed">Đóng</option>
    </select>
  );
}
