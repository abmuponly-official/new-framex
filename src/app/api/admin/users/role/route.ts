import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * PUT /api/admin/users/role
 * Body: { userId: string, role: string }
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId, role } = await request.json();
    if (!userId || !role) return NextResponse.json({ error: 'userId and role required' }, { status: 400 });

    const validRoles = ['super_admin', 'editor', 'viewer'];
    if (!validRoles.includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 });

    const admin = createAdminClient();

    // Update user_roles table
    const { error } = await admin
      .from('user_roles')
      .upsert({ user_id: userId, role }, { onConflict: 'user_id' });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Also update user metadata
    await admin.auth.admin.updateUserById(userId, { user_metadata: { role } });

    // Audit log
    await admin.from('audit_log').insert({
      user_id: user.id,
      action: 'UPDATE',
      table_name: 'user_roles',
      record_id: userId,
      new_values: { role, updated_by: user.email },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
