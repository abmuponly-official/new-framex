import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * DELETE /api/admin/users/remove
 * Body: { userId: string }
 * Removes user from Supabase Auth + user_roles table
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    // Cannot remove yourself
    if (userId === user.id) {
      return NextResponse.json({ error: 'Không thể tự xoá chính mình' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Remove from user_roles
    await admin.from('user_roles').delete().eq('user_id', userId);

    // Remove from Supabase Auth
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Audit log
    await admin.from('audit_log').insert({
      user_id: user.id,
      action: 'DELETE',
      table_name: 'user_roles',
      record_id: userId,
      new_values: { removed_by: user.email },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
