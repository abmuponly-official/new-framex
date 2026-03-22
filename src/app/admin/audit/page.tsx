import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminShell from '@/components/admin/AdminShell';
import type { AuditLog } from '@/types/content';

export const metadata = { title: 'Nhật ký thay đổi' };

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: { page?: string; table?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const admin = createAdminClient();
  const page = parseInt(searchParams.page ?? '1', 10);
  const perPage = 20;
  const from = (page - 1) * perPage;
  const table = searchParams.table;

  // Note: do NOT join user_id — it can be NULL (public contact form triggers)
  // which causes PostgREST FK join to throw a server error
  let query = admin
    .from('audit_log')
    .select('id, action, table_name, record_id, new_values, user_id, created_at', { count: 'exact' });
  if (table && table !== 'all') query = query.eq('table_name', table);
  query = query.order('created_at', { ascending: false }).range(from, from + perPage - 1);

  const { data: logs, count, error: auditError } = await query;
  if (auditError) console.error('[audit] query error:', auditError.message);
  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <AdminShell user={user}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Nhật ký thay đổi</h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: '4px 0 0' }}>
          Lịch sử tất cả thay đổi dữ liệu — {count ?? 0} bản ghi
        </p>
      </div>

      {/* Filter */}
      <div className="admin-card" style={{ marginBottom: 24, padding: 16 }}>
        <form style={{ display: 'flex', gap: 12 }}>
          <select name="table" defaultValue={table ?? 'all'} className="form-select" style={{ width: 180 }}>
            <option value="all">Tất cả bảng</option>
            <option value="projects">projects</option>
            <option value="posts">posts</option>
            <option value="leads">leads</option>
            <option value="site_settings">site_settings</option>
          </select>
          <button type="submit" className="btn btn-secondary">Lọc</button>
        </form>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Hành động</th>
                <th>Bảng</th>
                <th>ID bản ghi</th>
                <th>Người thực hiện</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {logs?.length ? logs.map((log: AuditLog) => (
                <tr key={log.id}>
                  <td style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {formatDateTime(log.created_at)}
                  </td>
                  <td>
                    <span className={`badge ${
                      log.action === 'INSERT' ? 'badge-new' :
                      log.action === 'UPDATE' ? 'badge-draft' :
                      'badge-archived'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{log.table_name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#9ca3af' }}>
                    {log.record_id?.slice(0, 8)}…
                  </td>
                  <td style={{ fontSize: 13, color: '#9ca3af' }}>
                    {log.user_id ? log.user_id.slice(0, 8) + '…' : 'Public'}
                  </td>
                  <td>
                    {log.new_values && (
                      <details style={{ cursor: 'pointer' }}>
                        <summary style={{ fontSize: 12, color: '#3b82f6' }}>Xem chi tiết</summary>
                        <pre style={{
                          fontSize: 11, background: '#f9fafb', padding: 8,
                          borderRadius: 4, marginTop: 4, overflowX: 'auto',
                          maxWidth: 300, whiteSpace: 'pre-wrap',
                        }}>
                          {JSON.stringify(log.new_values, null, 2).slice(0, 300)}
                        </pre>
                      </details>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                    Chưa có nhật ký nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <a
                key={p}
                href={`/admin/audit?page=${p}${table ? `&table=${table}` : ''}`}
                className={`page-btn${page === p ? ' active' : ''}`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function formatDateTime(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
