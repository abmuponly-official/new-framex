import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import ProjectForm from '@/components/admin/ProjectForm';

export const metadata = { title: 'Chỉnh sửa dự án' };

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const admin = createAdminClient();
  const { data: project } = await admin
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!project) notFound();

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        Chỉnh sửa: {project.title_vi || project.title_en}
      </h1>
      <ProjectForm mode="edit" initialData={project} userId={user.id} />
    </div>
  );
}
