import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';

export const metadata = { title: 'Tổng quan' };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const admin = createAdminClient();

  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: totalPosts },
    { count: totalLeads },
    { count: newLeads },
  ] = await Promise.all([
    admin.from('projects').select('*', { count: 'exact', head: true }),
    admin.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    admin.from('posts').select('*', { count: 'exact', head: true }),
    admin.from('leads').select('*', { count: 'exact', head: true }),
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ]);

  const { data: recentLeads } = await admin
    .from('leads')
    .select('id, name, phone, role, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  // audit_log: graceful fallback — table may have RLS or join issues
  let recentAudit: Array<{ id: string; action: string; table_name: string; created_at: string }> | null = null;
  try {
    const { data } = await admin
      .from('audit_log')
      .select('id, action, table_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    recentAudit = data;
  } catch {
    recentAudit = null;
  }

  return (
    <AdminShell user={user}>
      <div className="admin-stat-grid">
        <StatCard label="Dự án" value={totalProjects ?? 0} sub={`${publishedProjects ?? 0} đã đăng`} />
        <StatCard label="Bài viết" value={totalPosts ?? 0} sub="Blog &amp; Tin tức" />
        <StatCard label="Leads" value={totalLeads ?? 0} sub={`${newLeads ?? 0} mới chưa xử lý`} accent={newLeads ? '#dc2626' : undefined} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent leads */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Leads gần đây</h2>
            <Link href="/admin/leads" className="btn btn-secondary btn-sm">Xem tất cả</Link>
          </div>
          {recentLeads?.length ? (
            <table className="admin-table">
              <thead><tr><th>Tên</th><th>Vai trò</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id}>
                    <td>{l.name}<div style={{fontSize:11,color:'#9ca3af'}}>{l.phone}</div></td>
                    <td>{l.role ?? '—'}</td>
                    <td><StatusBadge status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Chưa có lead nào.</p>
          )}
        </div>

        {/* Recent audit */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Thay đổi gần đây</h2>
            <Link href="/admin/audit" className="btn btn-secondary btn-sm">Xem tất cả</Link>
          </div>
          {recentAudit?.length ? (
            <table className="admin-table">
              <thead><tr><th>Hành động</th><th>Bảng</th><th>Thời gian</th></tr></thead>
              <tbody>
                {recentAudit.map((a) => (
                  <tr key={a.id}>
                    <td style={{ textTransform: 'capitalize' }}>{a.action}</td>
                    <td>{a.table_name}</td>
                    <td style={{ fontSize: 12, color: '#9ca3af' }}>{formatDate(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Chưa có thay đổi nào.</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-card" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Thao tác nhanh</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/admin/projects/new" className="btn btn-primary">🏗️ Thêm dự án</Link>
          <Link href="/admin/posts/new" className="btn btn-primary">📝 Thêm bài viết</Link>
          <Link href="/admin/leads" className="btn btn-secondary">📬 Xem leads</Link>
          <Link href="/admin/settings" className="btn btn-secondary">⚙️ Cài đặt</Link>
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: number; sub: string; accent?: string }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value" style={accent ? { color: accent } : {}}>{value}</div>
      <div className="admin-stat-sub">{sub}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: 'badge-new', contacted: 'badge-contacted', closed: 'badge-closed',
  };
  const labels: Record<string, string> = {
    new: 'Mới', contacted: 'Đã liên hệ', closed: 'Đóng',
  };
  return <span className={`badge ${map[status] ?? 'badge-draft'}`}>{labels[status] ?? status}</span>;
}

function formatDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
