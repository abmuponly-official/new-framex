'use client';

export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={`/api/admin/projects/${id}`}
      method="POST"
      onSubmit={(e) => {
        e.preventDefault();
        if (!confirm(`Xoá dự án "${title}"? Hành động này không thể hoàn tác.`)) return;
        fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
          .then((res) => {
            if (res.ok) window.location.reload();
            else res.json().then((d) => alert('Lỗi: ' + (d.error ?? 'Không thể xoá')));
          })
          .catch(() => alert('Lỗi kết nối máy chủ'));
      }}
    >
      <button type="submit" className="btn btn-danger btn-sm">Xoá</button>
    </form>
  );
}
