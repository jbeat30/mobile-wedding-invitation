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
 * 인사말 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateGreetingAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  try {
    const fieldErrors: Record<string, string> = {};
    const sectionTitle = safeRequiredString(
      formData.get('greeting_section_title'),
      'greeting_section_title',
      '인트로 섹션 타이틀',
      100,
      fieldErrors,
      '인트로 섹션 타이틀을 입력해주세요.'
    );

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    const lines = optionalString(formData.get('message_lines'), '', 2000)
      .split('\n')
      .map((line) => line.trimEnd());

    assertNoError(
      await supabase
        .from('invitation_greeting')
        .update({
          poetic_note: optionalString(formData.get('poetic_note'), '', 200),
          message_lines: lines,
          section_title: sectionTitle || '초대합니다',
        })
        .eq('invitation_id', id)
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
