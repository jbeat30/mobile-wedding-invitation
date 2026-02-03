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
  optionalDateTime,
  optionalString,
  safeRequiredString,
} from './validation';

/**
 * RSVP 기본 설정/동의 문구 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateRsvpAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  try {
    const fieldErrors: Record<string, string> = {};
    const sectionTitle = safeRequiredString(
      formData.get('rsvp_section_title'),
      'rsvp_section_title',
      'RSVP 섹션 타이틀',
      100,
      fieldErrors,
      'RSVP 섹션 타이틀을 입력해주세요.'
    );
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }
    const deadlineValue = optionalDateTime(formData.get('rsvp_deadline'));

    const payload = {
      enabled: checkboxToBool(formData.get('rsvp_enabled'), true),
      deadline: deadlineValue,
      consent_title: optionalString(formData.get('rsvp_consent_title'), '', 200),
      consent_description: optionalString(formData.get('rsvp_consent_description'), '', 2000),
      consent_retention: optionalString(formData.get('rsvp_consent_retention'), '', 200),
      consent_notice: optionalString(formData.get('rsvp_consent_notice'), '', 200),
      section_title: sectionTitle || '참석 여부',
    };

    assertNoError(
      await supabase.from('invitation_rsvp').update(payload).eq('invitation_id', id)
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
