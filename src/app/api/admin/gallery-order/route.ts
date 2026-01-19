import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdminAuth } from '@/lib/adminAuth';

/**
 * 갤러리 순서 저장 요청 타입
 */
type GalleryOrderPayload = {
  galleryId?: string;
  orderedIds?: string[];
};

/**
 * 갤러리 순서 저장 API
 * @param req Request
 * @returns Promise<Response>
 */
export const POST = async (req: Request) => {
  const supabase = createSupabaseAdmin();
  try {
    await requireAdminAuth(supabase);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: GalleryOrderPayload = {};
  try {
    payload = (await req.json()) as GalleryOrderPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const galleryId = typeof payload.galleryId === 'string' ? payload.galleryId.trim() : '';
  const orderedIds = Array.isArray(payload.orderedIds)
    ? payload.orderedIds.filter((id) => typeof id === 'string' && id.trim().length > 0)
    : [];

  if (!galleryId) {
    return NextResponse.json({ error: 'galleryId is required' }, { status: 400 });
  }

  if (!orderedIds.length) {
    return NextResponse.json({ success: true });
  }

  const updates = orderedIds.map((id, index) =>
    supabase
      .from('invitation_gallery_images')
      .update({ sort_order: index + 1 })
      .eq('id', id)
      .eq('gallery_id', galleryId)
  );

  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    return NextResponse.json({ error: 'update failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
};
