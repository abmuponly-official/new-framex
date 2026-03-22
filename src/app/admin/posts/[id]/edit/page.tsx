import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import PostForm from '@/components/admin/PostForm';

export const metadata = { title: 'Chỉnh sửa bài viết' };

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const admin = createAdminClient();
  const { data: post } = await admin.from('posts').select('*').eq('id', params.id).single();
  if (!post) notFound();

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        Chỉnh sửa: {post.title_vi || post.title_en}
      </h1>
      <PostForm mode="edit" initialData={post} userId={user.id} />
    </div>
  );
}
