'use client';

import { useState } from 'react';

interface Props {
  leadId: string;
  initialNotes?: string | null;
}

export default function LeadNotesButton({ leadId, initialNotes }: Props) {
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    const newNotes = window.prompt('Ghi chú cho lead này:', notes);
    if (newNotes === null) return; // user cancelled

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: newNotes }),
      });
      if (res.ok) {
        setNotes(newNotes);
      } else {
        const d = await res.json();
        alert('Lỗi: ' + (d.error ?? 'Không thể lưu ghi chú'));
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      title={notes || 'Thêm ghi chú'}
      onClick={handleClick}
      disabled={saving}
    >
      {notes ? '📝' : '+ Ghi chú'}
    </button>
  );
}
