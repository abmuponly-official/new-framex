import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PostForm from '@/components/admin/PostForm';

export const metadata = { title: 'Thêm bài viết mới' };

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Thêm bài viết mới</h1>
      <PostForm mode="create" userId={user.id} />
    </div>
  );
}
