import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * POST /api/admin/users/invite
 * Body: { email: string, role: 'editor' | 'viewer' }
 *
 * Uses Supabase Auth Admin API to invite a user by email.
 * The user will receive a "You have been invited" email with a link to set their password.
 */
export async function POST(request: Request) {
  try {
    // Auth check — only authenticated users can invite
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, role } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email là bắt buộc' }, { status: 400 });
    if (!['editor', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Role không hợp lệ' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Invite user via Supabase Auth
    const { data: invitedUser, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/login`,
        data: { role }, // Store role in user metadata
      }
    );

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 400 });
    }

    // Upsert role in user_roles table
    if (invitedUser?.user) {
      await admin.from('user_roles').upsert(
        { user_id: invitedUser.user.id, role },
        { onConflict: 'user_id' }
      );

      // Log to audit
      await admin.from('audit_log').insert({
        user_id: user.id,
        action: 'INSERT',
        table_name: 'user_roles',
        record_id: invitedUser.user.id,
        new_values: { email, role, invited_by: user.email },
      });
    }

    return NextResponse.json({ success: true, user: invitedUser?.user }, { status: 201 });
  } catch (err) {
    console.error('Invite error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
