import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProjectForm from '@/components/admin/ProjectForm';

export const metadata = { title: 'Thêm dự án mới' };

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Thêm dự án mới</h1>
      <ProjectForm mode="create" userId={user.id} />
    </div>
  );
}
