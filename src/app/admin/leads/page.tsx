import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';
import type { Lead } from '@/types/content';

export const metadata = { title: 'Khách hàng tiềm năng (Leads)' };

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; role?: string; q?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const admin = createAdminClient();
  const page = parseInt(searchParams.page ?? '1', 10);
  const perPage = 15;
  const from = (page - 1) * perPage;
  const status = searchParams.status;
  const role = searchParams.role;
  const q = searchParams.q;

  let query = admin.from('leads').select('*', { count: 'exact' });
  if (status && status !== 'all') query = query.eq('status', status);
  if (role && role !== 'all') query = query.eq('role', role);
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  query = query.order('created_at', { ascending: false }).range(from, from + perPage - 1);

  const { data: leads, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / perPage);

  // Stats
  const [{ count: cNew }, { count: cContacted }, { count: cClosed }] = await Promise.all([
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
    admin.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
  ]);

  return (
    <AdminShell user={user}>
      {/* Stats */}
      <div className="admin-stat-grid" style={{ marginBottom: 24 }}>
        <StatCard label="Tổng cộng" value={count ?? 0} sub="tất cả leads" />
        <StatCard label="Mới" value={cNew ?? 0} sub="chưa liên hệ" accent="#dc2626" />
        <StatCard label="Đã liên hệ" value={cContacted ?? 0} sub="đang xử lý" accent="#7c3aed" />
        <StatCard label="Đóng" value={cClosed ?? 0} sub="hoàn thành" />
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: 24, padding: 16 }}>
        <form style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 4 }}>Tìm kiếm</label>
            <input name="q" defaultValue={q} className="form-input" style={{ width: 220 }} placeholder="Tên, email, SĐT…" />
          </div>
          <div>
            <label className="form-label" style={{ marginBottom: 4 }}>Trạng thái</label>
            <select name="status" defaultValue={status ?? 'all'} className="form-select" style={{ width: 160 }}>
              <option value="all">Tất cả</option>
              <option value="new">Mới</option>
              <option value="contacted">Đã liên hệ</option>
              <option value="qualified">Tiềm năng cao</option>
              <option value="closed">Đóng</option>
            </select>
          </div>
          <div>
            <label className="form-label" style={{ marginBottom: 4 }}>Vai trò</label>
            <select name="role" defaultValue={role ?? 'all'} className="form-select" style={{ width: 160 }}>
              <option value="all">Tất cả</option>
              <option value="chu-dau-tu">Chủ đầu tư</option>
              <option value="nha-thau">Nhà thầu</option>
              <option value="kien-truc-su">Kiến trúc sư</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <button type="submit" className="btn btn-secondary">Lọc</button>
          <Link href="/admin/leads" className="btn btn-secondary">Xoá bộ lọc</Link>
        </form>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Liên lạc</th>
                <th>Vai trò</th>
                <th>Tin nhắn</th>
                <th>Nguồn</th>
                <th>Ngôn ngữ</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {leads?.length ? leads.map((lead: Lead) => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: 500 }}>{lead.name}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{lead.phone ?? '—'}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{lead.email ?? ''}</div>
                  </td>
                  <td>{ROLE_LABELS[lead.role ?? ''] ?? lead.role ?? '—'}</td>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontSize: 13, color: '#374151' }}>
                      {lead.message ?? '—'}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{lead.source_page ?? '—'}</td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{lead.locale?.toUpperCase()}</span>
                  </td>
                  <td style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatDate(lead.created_at)}</td>
                  <td>
                    <StatusSelect leadId={lead.id} currentStatus={lead.status} />
                  </td>
                  <td>
                    <LeadNotesButton lead={lead} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                    Chưa có lead nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link key={p} href={`/admin/leads?page=${p}${status ? `&status=${status}` : ''}`} className={`page-btn${page === p ? ' active' : ''}`}>{p}</Link>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

const ROLE_LABELS: Record<string, string> = {
  'chu-dau-tu': 'Chủ đầu tư',
  'nha-thau': 'Nhà thầu',
  'kien-truc-su': 'Kiến trúc sư',
  'other': 'Khác',
};

function StatusSelect({ leadId, currentStatus }: { leadId: string; currentStatus: string }) {
  return (
    <form action={`/api/admin/leads/${leadId}/status`} method="POST">
      <select
        name="status"
        defaultValue={currentStatus}
        className="form-select"
        style={{ width: 140, fontSize: 12, padding: '4px 8px' }}
        onChange={(e) => {
          const form = e.target.closest('form') as HTMLFormElement;
          const fd = new FormData(form);
          fd.set('status', e.target.value);
          fetch(`/api/admin/leads/${leadId}/status`, { method: 'POST', body: fd });
        }}
      >
        <option value="new">Mới</option>
        <option value="contacted">Đã liên hệ</option>
        <option value="qualified">Tiềm năng cao</option>
        <option value="closed">Đóng</option>
      </select>
    </form>
  );
}

function LeadNotesButton({ lead }: { lead: Lead }) {
  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      title={lead.notes ?? 'Thêm ghi chú'}
      onClick={() => {
        const notes = prompt('Ghi chú cho lead này:', lead.notes ?? '');
        if (notes !== null) {
          fetch(`/api/admin/leads/${lead.id}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes }),
          }).then(() => window.location.reload());
        }
      }}
    >
      {lead.notes ? '📝' : '+ Ghi chú'}
    </button>
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

function formatDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
