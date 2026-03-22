/**
 * POST /api/admin/upload/pdf
 *
 * Dedicated PDF upload endpoint — separate from the image upload route
 * so MIME validation and size limits are handled explicitly.
 *
 * Accepts: multipart/form-data
 *   - file   : File  (application/pdf only)
 *   - folder : string (default: "brochures")
 *
 * Returns: { url, path, name, size }
 *
 * Supabase Storage requirement (run migration 0005):
 *   UPDATE storage.buckets
 *   SET allowed_mime_types = array_append(allowed_mime_types, 'application/pdf'),
 *       file_size_limit = 20971520
 *   WHERE id = 'framex-media';
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const BUCKET       = 'framex-media';
const PDF_MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(request: Request) {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse form ──────────────────────────────────────────────────────────
    const formData = await request.formData();
    const file     = formData.get('file') as File | null;
    const folder   = (formData.get('folder') as string | null) ?? 'brochures';

    if (!file) {
      return NextResponse.json({ error: 'Không có file được gửi lên.' }, { status: 400 });
    }

    // ── MIME validation (strict PDF only) ───────────────────────────────────
    // file.type may be empty on some browsers/OS — also check extension
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      return NextResponse.json(
        { error: `Chỉ chấp nhận file PDF. File bạn chọn có MIME type: "${file.type || 'unknown'}".` },
        { status: 400 }
      );
    }

    // ── Size validation ─────────────────────────────────────────────────────
    if (file.size > PDF_MAX_SIZE) {
      return NextResponse.json(
        { error: `File quá lớn (${(file.size / 1024 / 1024).toFixed(1)} MB). Tối đa 20 MB.` },
        { status: 400 }
      );
    }

    // ── Generate safe filename ──────────────────────────────────────────────
    const timestamp = Date.now();
    const random    = Math.random().toString(36).substring(2, 8);
    const safeName  = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-(?=\.)|-$/g, '');
    const fileName    = `${timestamp}-${random}-${safeName}`;
    const storagePath = `${folder}/${fileName}`;

    // ── Upload to Supabase Storage ──────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const admin       = createAdminClient();

    const { data, error } = await admin.storage
      .from(BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType:  'application/pdf', // explicit — never rely on file.type
        upsert:       false,
        cacheControl: '31536000',        // 1 year
      });

    if (error) {
      console.error('[PDF upload] Supabase Storage error:', error);
      return NextResponse.json(
        { error: `Lỗi Supabase Storage: ${error.message}` },
        { status: 400 }
      );
    }

    // ── Build public URL ────────────────────────────────────────────────────
    const { data: { publicUrl } } = admin.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return NextResponse.json(
      {
        url:  publicUrl,
        path: data.path,
        name: file.name,
        size: file.size,
      },
      { status: 201 }
    );

  } catch (err) {
    console.error('[PDF upload] Unexpected error:', err);
    return NextResponse.json({ error: 'Lỗi server khi upload PDF.' }, { status: 500 });
  }
}
