'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { requireAdminSession, revalidateAdmin } from './shared';

/**
 * BGM 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateBgmAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    enabled: formData.get('bgm_enabled') === 'on',
    title: String(formData.get('bgm_title') || ''),
    audio_url: String(formData.get('bgm_audio_url') || ''),
    auto_play: formData.get('bgm_auto_play') === 'on',
    loop: formData.get('bgm_loop') === 'on',
  };

  await supabase.from('invitation_bgm').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};
