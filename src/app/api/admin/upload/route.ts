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
 * All known subfolders in the framex-media bucket.
 * Add new folders here when new upload routes are created.
 */
const ALL_FOLDERS = ['projects', 'posts', 'settings', 'general', 'brochures'];

/**
 * List files in one folder and attach public URLs.
 * Filters out directory stub entries (id === null).
 */
async function listFolder(
  admin: ReturnType<typeof createAdminClient>,
  folderName: string,
  limit: number,
  offset: number,
) {
  const { data, error } = await admin.storage
    .from(BUCKET)
    .list(folderName, {
      limit,
      offset,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error || !data) return [];

  // id === null means it is a directory stub, not a real file — skip it
  return data
    .filter((f) => f.id !== null)
    .map((f) => {
      const filePath = `${folderName}/${f.name}`;
      const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(filePath);
      return { ...f, url: publicUrl, path: filePath, folder: folderName };
    });
}

/**
 * GET /api/admin/upload?folder=projects   → list specific folder
 * GET /api/admin/upload?folder=           → list ALL folders merged
 * GET /api/admin/upload                   → list ALL folders merged
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const folderParam = searchParams.get('folder') ?? '';
    const limit  = parseInt(searchParams.get('limit')  ?? '200', 10);
    const offset = parseInt(searchParams.get('offset') ?? '0',   10);

    const admin = createAdminClient();

    let files: object[];

    if (folderParam === '' || folderParam === 'all') {
      // ── ALL: list every known subfolder in parallel and merge ───────────
      // Supabase Storage does NOT support recursive listing from root ('').
      // Calling list('') returns folder-name stubs, not actual files.
      const results = await Promise.all(
        ALL_FOLDERS.map((f) => listFolder(admin, f, limit, offset))
      );
      files = results.flat().sort(
        // sort merged result by created_at desc
        (a, b) =>
          new Date((b as { created_at?: string }).created_at ?? 0).getTime() -
          new Date((a as { created_at?: string }).created_at ?? 0).getTime()
      );
    } else {
      // ── Specific folder ─────────────────────────────────────────────────
      files = await listFolder(admin, folderParam, limit, offset);
    }

    return NextResponse.json({ files, folder: folderParam });
  } catch (err) {
    console.error('[media GET]', err);
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
