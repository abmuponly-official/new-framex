import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminShell from '@/components/admin/AdminShell';
import UserManagementClient from '@/components/admin/UserManagementClient';

export const metadata = { title: 'Quản lý người dùng' };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const admin = createAdminClient();

  // Fetch all auth users + their roles
  const { data: authUsers } = await admin.auth.admin.listUsers();
  const { data: roles } = await admin.from('user_roles').select('*');

  // Merge: attach role to each user
  const usersWithRoles = (authUsers?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? '',
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    role: roles?.find((r) => r.user_id === u.id)?.role ?? 'viewer',
  }));

  return (
    <AdminShell user={user}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Quản lý người dùng</h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: '4px 0 0' }}>
          Invite thành viên mới và phân quyền truy cập Admin Panel
        </p>
      </div>
      <UserManagementClient
        initialUsers={usersWithRoles}
        currentUserId={user.id}
      />
    </AdminShell>
  );
}
