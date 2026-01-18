'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { requireAdminSession, revalidateAdmin, toNumber } from './shared';

/**
 * 방명록 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateGuestbookAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    section_title: String(formData.get('guestbook_section_title') || ''),
    privacy_notice: String(formData.get('guestbook_privacy_notice') || ''),
    retention_text: String(formData.get('guestbook_retention_text') || ''),
    display_mode: String(formData.get('guestbook_display_mode') || 'recent'),
    page_size: toNumber(formData.get('guestbook_page_size'), 5),
    recent_notice: String(formData.get('guestbook_recent_notice') || ''),
    enable_password: formData.get('guestbook_enable_password') === 'on',
    enable_edit: formData.get('guestbook_enable_edit') === 'on',
    enable_delete: formData.get('guestbook_enable_delete') === 'on',
  };

  await supabase.from('invitation_guestbook').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};
