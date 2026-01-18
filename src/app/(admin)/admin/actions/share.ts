'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { requireAdminSession, revalidateAdmin } from './shared';

/**
 * 공유 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateShareAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    section_title: String(formData.get('share_section_title') || ''),
    title: String(formData.get('share_title') || ''),
    description: String(formData.get('share_description') || ''),
    image_url: String(formData.get('share_image_url') || ''),
    kakao_title: String(formData.get('kakao_title') || ''),
    kakao_description: String(formData.get('kakao_description') || ''),
    kakao_image_url: String(formData.get('kakao_image_url') || ''),
    kakao_button_label: String(formData.get('kakao_button_label') || ''),
  };

  await supabase.from('invitation_share').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};
