'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { assertNoError, requireAdminSession, revalidateAdmin } from './shared';

/**
 * 공유 설정/섹션 타이틀 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateShareAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  const payload: Record<string, string> = {
    section_title: String(formData.get('share_section_title') || ''),
    image_url: String(formData.get('share_image_url') || ''),
  };

  if (formData.has('share_title')) {
    payload.subtitle = String(formData.get('share_title') || '');
  }
  if (formData.has('share_description')) {
    payload.description = String(formData.get('share_description') || '');
  }
  if (formData.has('kakao_title')) {
    payload.kakao_title = String(formData.get('kakao_title') || '');
  }
  if (formData.has('kakao_description')) {
    payload.kakao_description = String(formData.get('kakao_description') || '');
  }
  if (formData.has('kakao_image_url')) {
    payload.kakao_image_url = String(formData.get('kakao_image_url') || '');
  }
  if (formData.has('kakao_button_label')) {
    payload.kakao_button_label = String(formData.get('kakao_button_label') || '');
  }

  assertNoError(
    await supabase.from('invitation_share').update(payload).eq('invitation_id', id)
  );
  revalidateAdmin();
};
