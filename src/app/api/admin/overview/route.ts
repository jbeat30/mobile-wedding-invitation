import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdminAuth } from '@/lib/adminAuth';

/**
 * 관리자 요약 API
 * @returns Promise<Response>
 */
export const GET = async () => {
  const supabase = createSupabaseAdmin();
  try {
    await requireAdminAuth(supabase);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { count: galleryCount } = await supabase
    .from('invitation_gallery_image')
    .select('*', { count: 'exact', head: true });
  const { count: guestbookCount } = await supabase
    .from('invitation_guestbook_entry')
    .select('*', { count: 'exact', head: true });

  return NextResponse.json({
    galleryCount: galleryCount || 0,
    guestbookCount: guestbookCount || 0,
  });
};
