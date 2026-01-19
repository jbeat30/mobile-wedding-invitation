import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdminAuth } from '@/lib/adminAuth';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';

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

  const { id: invitationId } = await getOrCreateInvitation();
  const { data: gallery } = await supabase
    .from('invitation_gallery')
    .select('id')
    .eq('invitation_id', invitationId)
    .maybeSingle();
  const { data: guestbook } = await supabase
    .from('invitation_guestbook')
    .select('id')
    .eq('invitation_id', invitationId)
    .maybeSingle();

  const galleryId = gallery?.id;
  const guestbookId = guestbook?.id;

  const { count: galleryCount } = galleryId
    ? await supabase
        .from('invitation_gallery_images')
        .select('*', { count: 'exact', head: true })
        .eq('gallery_id', galleryId)
    : { count: 0 };
  const { count: guestbookCount } = guestbookId
    ? await supabase
        .from('invitation_guestbook_entries')
        .select('*', { count: 'exact', head: true })
        .eq('guestbook_id', guestbookId)
    : { count: 0 };

  return NextResponse.json({
    galleryCount: galleryCount || 0,
    guestbookCount: guestbookCount || 0,
  });
};
