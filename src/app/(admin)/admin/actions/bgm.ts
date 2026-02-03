'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import {
  assertNoError,
  getActionErrorMessage,
  requireAdminSession,
  revalidateAdmin,
} from './shared';
import {
  checkboxToBool,
  isValidationError,
  optionalString,
  safeRequiredString,
} from './validation';

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
    const fieldErrors: Record<string, string> = {};
    const enabled = checkboxToBool(formData.get('bgm_enabled'), false);
    const audioUrl = enabled
      ? safeRequiredString(
          formData.get('bgm_audio_url'),
          'bgm_audio_url',
          'BGM 오디오 URL',
          500,
          fieldErrors,
          'BGM 오디오 URL을 입력해주세요.'
        )
      : optionalString(formData.get('bgm_audio_url'), '', 500);

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    const payload = {
      enabled,
      audio_url: audioUrl,
      auto_play: checkboxToBool(formData.get('bgm_auto_play'), true),
      loop: checkboxToBool(formData.get('bgm_loop'), true),
    };

    assertNoError(await supabase.from('invitation_bgm').update(payload).eq('invitation_id', id));
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
};
