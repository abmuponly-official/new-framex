import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminShell from '@/components/admin/AdminShell';
import SettingsForm from '@/components/admin/SettingsForm';

export const metadata = { title: 'Cài đặt website' };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const admin = createAdminClient();
  const { data: settings } = await admin.from('site_settings').select('*').order('key');

  return (
    <AdminShell user={user}>
      <div style={{ maxWidth: 900 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Cài đặt website</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
          Thông tin liên lạc, mạng xã hội, và thông số chung của website.
        </p>
        <SettingsForm settings={settings ?? []} />
      </div>
    </AdminShell>
  );
}
