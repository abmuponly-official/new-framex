import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs'; // Required for file handling

const BUCKET = 'framex-media';
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;   // 5 MB for images
const PDF_MAX_SIZE   = 20 * 1024 * 1024;  // 20 MB for PDF
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
];

/**
 * POST /api/admin/upload
 * Accepts multipart/form-data with:
 *   - file: File
 *   - folder: string (e.g. "projects", "posts", "settings")
 *
 * Returns: { url: string, path: string, name: string }
 */
export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse multipart form
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Loại file không được phép. Cho phép: ảnh (JPEG/PNG/WebP/GIF/SVG) và PDF.` },
        { status: 400 }
      );
    }

    // Validate file size (PDF up to 20 MB, images up to 5 MB)
    const maxSize = file.type === 'application/pdf' ? PDF_MAX_SIZE : IMAGE_MAX_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File quá lớn. Tối đa: ${maxSize / 1024 / 1024}MB cho loại ${file.type === 'application/pdf' ? 'PDF' : 'ảnh'}.` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() ?? 'jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const fileName = `${timestamp}-${random}-${safeName}`;
    const storagePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const admin = createAdminClient();

    const { data, error } = await admin.storage
      .from(BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '31536000', // 1 year cache
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get public URL
    const { data: { publicUrl } } = admin.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return NextResponse.json({
      url: publicUrl,
      path: data.path,
      name: file.name,
      size: file.size,
      type: file.type,
    }, { status: 201 });

  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Server error during upload' }, { status: 500 });
  }
}

/**
 * GET /api/admin/upload?folder=projects
 * Returns list of files in a folder
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';
    const limit = parseInt(searchParams.get('limit') ?? '50', 10);
    const offset = parseInt(searchParams.get('offset') ?? '0', 10);

    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from(BUCKET)
      .list(folder, {
        limit,
        offset,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Attach public URLs
    const files = (data ?? []).map((f) => {
      const path = folder ? `${folder}/${f.name}` : f.name;
      const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path);
      return { ...f, url: publicUrl, path };
    });

    return NextResponse.json({ files, folder });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/upload
 * Body: { path: string }
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { path } = await request.json();
    if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 });

    const admin = createAdminClient();
    const { error } = await admin.storage.from(BUCKET).remove([path]);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
