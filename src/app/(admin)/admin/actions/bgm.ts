'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import {
  assertNoError,
  getActionErrorMessage,
  requireAdminSession,
  revalidateAdmin,
} from './shared';
import { checkboxToBool, optionalString } from './validation';

/**
 * BGM 설정 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateBgmAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  try {
    const payload = {
      enabled: checkboxToBool(formData.get('bgm_enabled'), false),
      audio_url: optionalString(formData.get('bgm_audio_url'), '', 500),
      auto_play: checkboxToBool(formData.get('bgm_auto_play'), true),
      loop: checkboxToBool(formData.get('bgm_loop'), true),
    };

    assertNoError(await supabase.from('invitation_bgm').update(payload).eq('invitation_id', id));
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getActionErrorMessage(error) };
  }
};
