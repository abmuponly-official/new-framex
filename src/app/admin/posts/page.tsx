import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';
import type { Post } from '@/types/content';

export const metadata = { title: 'Quản lý Bài viết' };

export default async function AdminPostsPage({
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

  let query = admin.from('posts').select('*', { count: 'exact' });
  if (status && status !== 'all') query = query.eq('status', status);
  if (q) query = query.ilike('title_vi', `%${q}%`);
  query = query.order('updated_at', { ascending: false }).range(from, from + perPage - 1);

  const { data: posts, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <AdminShell user={user}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Bài viết / Blog</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '4px 0 0' }}>{count ?? 0} bài viết tổng cộng</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary">+ Thêm bài viết</Link>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: 24, padding: 16 }}>
        <form style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input name="q" defaultValue={q} className="form-input" style={{ width: 240 }} placeholder="Tìm theo tiêu đề…" />
          <select name="status" defaultValue={status ?? 'all'} className="form-select" style={{ width: 160 }}>
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã đăng</option>
            <option value="draft">Nháp</option>
            <option value="archived">Lưu trữ</option>
          </select>
          <button type="submit" className="btn btn-secondary">Lọc</button>
          <Link href="/admin/posts" className="btn btn-secondary">Xoá bộ lọc</Link>
        </form>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tiêu đề (VI)</th>
                <th>Chủ đề</th>
                <th>Trạng thái</th>
                <th>Thời gian đọc</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts?.length ? posts.map((p: Post) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.title_vi || '(chưa có tiêu đề)'}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{p.slug}</div>
                  </td>
                  <td>{p.category ?? '—'}</td>
                  <td>
                    <span className={`badge badge-${p.status}`}>
                      {p.status === 'published' ? 'Đã đăng' : p.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                    </span>
                  </td>
                  <td>{p.reading_time ? `${p.reading_time} phút` : '—'}</td>
                  <td style={{ fontSize: 12, color: '#9ca3af' }}>{formatDate(p.updated_at)}</td>
                  <td>
                    <div className="actions">
                      <Link href={`/admin/posts/${p.id}/edit`} className="btn btn-secondary btn-sm">Sửa</Link>
                      <Link href={`/vi/tin-tuc/${p.slug}`} target="_blank" className="btn btn-secondary btn-sm">Xem</Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                    Chưa có bài viết nào.{' '}
                    <Link href="/admin/posts/new" style={{ color: '#3b82f6' }}>Thêm bài viết đầu tiên →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link key={p} href={`/admin/posts?page=${p}`} className={`page-btn${page === p ? ' active' : ''}`}>{p}</Link>
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
