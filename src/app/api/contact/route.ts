import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, role, message, locale, source_page } = body;

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from('leads').insert({
      name:        name.trim(),
      phone:       phone?.trim() || null,
      email:       email?.trim() || null,
      role:        role || null,
      message:     message?.trim() || null,
      locale:      locale || 'vi',
      source_page: source_page || request.headers.get('referer') || null,
      status:      'new',
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
