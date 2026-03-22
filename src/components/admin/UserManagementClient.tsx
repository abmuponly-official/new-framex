'use client';
import { useState } from 'react';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
}

const ROLE_LABELS: Record<string, { label: string; desc: string; color: string }> = {
  super_admin: { label: 'Super Admin', desc: 'Toàn quyền — CRUD, xoá, quản lý users', color: '#dc2626' },
  editor:      { label: 'Editor',      desc: 'Tạo/sửa nội dung, xem leads',          color: '#7c3aed' },
  viewer:      { label: 'Viewer',      desc: 'Chỉ đọc — không thể chỉnh sửa',        color: '#6b7280' },
};

export default function UserManagementClient({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUser[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    setInviteError('');
    setInviteSuccess('');

    const res = await fetch('/api/admin/users/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    });
    const data = await res.json();
    setInviting(false);

    if (!res.ok) {
      setInviteError(data.error ?? 'Không thể gửi lời mời');
      return;
    }

    setInviteSuccess(`✅ Đã gửi lời mời đến ${inviteEmail}! Họ sẽ nhận email để tạo mật khẩu.`);
    setInviteEmail('');
    // Add to local list
    setUsers((prev) => [
      ...prev,
      { id: data.user?.id ?? Date.now().toString(), email: inviteEmail, created_at: new Date().toISOString(), last_sign_in_at: null, role: inviteRole },
    ]);
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdatingId(userId);
    const res = await fetch('/api/admin/users/role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    });
    setUpdatingId(null);
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    }
  }

  async function handleRemove(userId: string, email: string) {
    if (!confirm(`Xoá người dùng "${email}"? Họ sẽ không thể đăng nhập nữa.`)) return;
    const res = await fetch('/api/admin/users/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  }

  return (
    <div>
      {/* Role reference cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {Object.entries(ROLE_LABELS).map(([key, val]) => (
          <div key={key} className="admin-card" style={{ borderLeft: `4px solid ${val.color}` }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: val.color, marginBottom: 4 }}>{val.label}</div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>{val.desc}</div>
          </div>
        ))}
      </div>

      {/* User table */}
      <div className="admin-card" style={{ padding: 0, marginBottom: 24 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
            Danh sách thành viên ({users.length})
          </h2>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowInvite(true)}
          >
            + Mời thành viên mới
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th>Đăng nhập gần nhất</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: u.id === currentUserId ? '#111827' : '#e5e7eb',
                        color: u.id === currentUserId ? '#fff' : '#6b7280',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}>
                        {u.email[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{u.email}</div>
                        {u.id === currentUserId && (
                          <div style={{ fontSize: 11, color: '#6b7280' }}>← bạn</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {u.id === currentUserId ? (
                      <RoleBadge role={u.role} />
                    ) : (
                      <select
                        className="form-select"
                        style={{ width: 140, fontSize: 12, padding: '4px 8px' }}
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}
                  </td>
                  <td style={{ fontSize: 13, color: '#6b7280' }}>{formatDate(u.created_at)}</td>
                  <td style={{ fontSize: 13, color: '#9ca3af' }}>
                    {u.last_sign_in_at ? formatDate(u.last_sign_in_at) : 'Chưa đăng nhập'}
                  </td>
                  <td>
                    {u.id !== currentUserId && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemove(u.id, u.email)}
                      >
                        Xoá
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowInvite(false)}>
          <div className="modal-box">
            <div className="modal-title">✉️ Mời thành viên mới</div>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
              Người được mời sẽ nhận email với link để tạo mật khẩu và truy cập Admin Panel.
            </p>

            {inviteError && <div className="alert alert-error">{inviteError}</div>}
            {inviteSuccess && <div className="alert alert-success">{inviteSuccess}</div>}

            {!inviteSuccess && (
              <form onSubmit={handleInvite}>
                <div className="form-group">
                  <label className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="editor@framex.vn"
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Vai trò</label>
                  <select
                    className="form-select"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                  >
                    <option value="editor">Editor — có thể tạo/sửa nội dung</option>
                    <option value="viewer">Viewer — chỉ đọc</option>
                  </select>
                  <p className="form-hint">
                    Super Admin chỉ được cấp thủ công qua database.
                  </p>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowInvite(false)}>
                    Huỷ
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={inviting}>
                    {inviting ? 'Đang gửi…' : '📨 Gửi lời mời'}
                  </button>
                </div>
              </form>
            )}

            {inviteSuccess && (
              <div className="modal-actions">
                <button type="button" className="btn btn-primary" onClick={() => { setShowInvite(false); setInviteSuccess(''); }}>
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    super_admin: 'badge-new',
    editor: 'badge-contacted',
    viewer: 'badge-archived',
  };
  const labels: Record<string, string> = {
    super_admin: 'Super Admin', editor: 'Editor', viewer: 'Viewer',
  };
  return <span className={`badge ${colors[role] ?? 'badge-draft'}`}>{labels[role] ?? role}</span>;
}

function formatDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
