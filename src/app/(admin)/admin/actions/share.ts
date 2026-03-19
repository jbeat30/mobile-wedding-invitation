'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import {
  assertNoError,
  getActionErrorMessage,
  requireAdminSession,
  revalidateAdmin,
} from './shared';
import { isValidationError, optionalString, safeRequiredString } from './validation';

/**
 * 공유 설정/섹션 타이틀 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateShareAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  try {
    const payload: Record<string, string> = { developer: 'jbeat' };
    if (formData.has('section_title')) {
      const fieldErrors: Record<string, string> = {};
      const sectionTitle = safeRequiredString(
        formData.get('section_title'),
        'section_title',
        '공유 섹션 타이틀',
        100,
        fieldErrors,
        '공유 섹션 타이틀을 입력해주세요.'
      );
      if (Object.keys(fieldErrors).length > 0) {
        return { ok: false, fieldErrors };
      }
      payload.section_title = sectionTitle || '청첩장 공유하기';
    }
    if (formData.has('description')) {
      payload.description = optionalString(formData.get('description'), '', 200);
    }
    if (formData.has('og_title')) {
      payload.og_title = optionalString(formData.get('og_title'), '', 200);
    }
    if (formData.has('og_description')) {
      payload.og_description = optionalString(formData.get('og_description'), '', 500);
    }
    if (formData.has('og_image_url')) {
      payload.og_image_url = optionalString(formData.get('og_image_url'), '', 500);
    }
    if (formData.has('kakao_button_label')) {
      payload.kakao_button_label = optionalString(formData.get('kakao_button_label'), '', 50);
    }

    assertNoError(
      await supabase.from('invitation_share').update(payload).eq('invitation_id', id)
    );
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
};
