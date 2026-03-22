import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';
import MediaLibraryClient from '@/components/admin/MediaLibraryClient';

export const metadata = { title: 'Thư viện Media' };

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <AdminShell user={user}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Thư viện Media</h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: '4px 0 0' }}>
          Quản lý tất cả ảnh đã upload lên Supabase Storage
        </p>
      </div>
      <MediaLibraryClient />
    </AdminShell>
  );
}
