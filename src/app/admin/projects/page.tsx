import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminShell from '@/components/admin/AdminShell';
import DeleteProjectButton from '@/components/admin/DeleteProjectButton';
import Link from 'next/link';
import type { Project } from '@/types/content';

export const metadata = { title: 'Quản lý Dự án' };

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; q?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const admin = createAdminClient();
  const page = parseInt(searchParams.page ?? '1', 10);
  const perPage = 12;
  const from = (page - 1) * perPage;
  const status = searchParams.status;
  const q = searchParams.q;

  let query = admin.from('projects').select('*', { count: 'exact' });
  if (status && status !== 'all') query = query.eq('status', status);
  if (q) query = query.ilike('title_vi', `%${q}%`);
  query = query.order('updated_at', { ascending: false }).range(from, from + perPage - 1);

  const { data: projects, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <AdminShell user={user}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Dự án</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '4px 0 0' }}>{count ?? 0} dự án tổng cộng</p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary">
          + Thêm dự án
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: 24, padding: 16 }}>
        <form style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            name="q"
            defaultValue={q}
            className="form-input"
            style={{ width: 240, marginBottom: 0 }}
            placeholder="Tìm theo tên dự án…"
          />
          <select name="status" defaultValue={status ?? 'all'} className="form-select" style={{ width: 160 }}>
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã đăng</option>
            <option value="draft">Nháp</option>
            <option value="archived">Lưu trữ</option>
          </select>
          <button type="submit" className="btn btn-secondary">Lọc</button>
          <Link href="/admin/projects" className="btn btn-secondary">Xoá bộ lọc</Link>
        </form>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên dự án (VI)</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Năm</th>
                <th>Nổi bật</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {projects?.length ? (
                projects.map((p: Project) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{p.title_vi || '(chưa có tiêu đề)'}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{p.slug}</div>
                    </td>
                    <td>{p.category ?? '—'}</td>
                    <td>
                      <span className={`badge badge-${p.status}`}>
                        {p.status === 'published' ? 'Đã đăng' : p.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                      </span>
                    </td>
                    <td>{p.year ?? '—'}</td>
                    <td>{p.featured ? '⭐' : '—'}</td>
                    <td style={{ fontSize: 12, color: '#9ca3af' }}>{formatDate(p.updated_at)}</td>
                    <td>
                      <div className="actions">
                        <Link href={`/admin/projects/${p.id}/edit`} className="btn btn-secondary btn-sm">Sửa</Link>
                        <Link href={`/vi/du-an/${p.slug}`} target="_blank" className="btn btn-secondary btn-sm">Xem</Link>
                        <DeleteProjectButton id={p.id} title={p.title_vi ?? 'dự án này'} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                    Chưa có dự án nào.{' '}
                    <Link href="/admin/projects/new" style={{ color: '#3b82f6' }}>Thêm dự án đầu tiên →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/projects?page=${p}${status ? `&status=${status}` : ''}${q ? `&q=${q}` : ''}`}
                className={`page-btn${page === p ? ' active' : ''}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}



function formatDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
