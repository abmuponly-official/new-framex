import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { settings } = await request.json() as { settings: Array<{ key: string; value_vi: string; value_en: string }> };
    const admin = createAdminClient();

    const upserts = settings.map((s) => ({
      key: s.key,
      value_vi: s.value_vi,
      value_en: s.value_en,
    }));

    const { error } = await admin
      .from('site_settings')
      .upsert(upserts, { onConflict: 'key' });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Bust the ISR cache so the public site sees new values immediately
    revalidateTag('site_settings');

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
