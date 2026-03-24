import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/admin/leads — List leads with optional filters & pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = request.nextUrl;
    const page    = Math.max(1, parseInt(searchParams.get('page')  ?? '1',  10));
    const perPage = Math.min(100, parseInt(searchParams.get('limit') ?? '15', 10));
    const status  = searchParams.get('status');
    const role    = searchParams.get('role');
    const q       = searchParams.get('q');
    const from    = (page - 1) * perPage;

    const admin = createAdminClient();
    let query = admin.from('leads').select('*', { count: 'exact' });

    if (status && status !== 'all') query = query.eq('status', status);
    if (role   && role   !== 'all') query = query.eq('role', role);
    if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);

    query = query.order('created_at', { ascending: false }).range(from, from + perPage - 1);

    const { data: leads, count, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      data:       leads ?? [],
      total:      count ?? 0,
      page,
      perPage,
      totalPages: Math.ceil((count ?? 0) / perPage),
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/leads — Create a lead manually (admin-side)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, phone, email, role, message, locale, source_page, status, notes } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin.from('leads').insert({
      name:        name.trim(),
      phone:       phone?.trim()  || null,
      email:       email?.trim()  || null,
      role:        role            || null,
      message:     message?.trim() || null,
      locale:      locale          || 'vi',
      source_page: source_page     || null,
      status:      status          || 'new',
      notes:       notes?.trim()   || null,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
