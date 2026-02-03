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
  numberWithDefault,
  optionalString,
  safeRequiredString,
} from './validation';

/**
 * 게스트북 설정/섹션 타이틀 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateGuestbookAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  try {
    const fieldErrors: Record<string, string> = {};
    const sectionTitle = safeRequiredString(
      formData.get('guestbook_section_title'),
      'guestbook_section_title',
      '방명록 섹션 타이틀',
      100,
      fieldErrors,
      '방명록 섹션 타이틀을 입력해주세요.'
    );
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }
    const displayModeRaw = optionalString(formData.get('guestbook_display_mode'), 'recent', 20);
    const displayMode = displayModeRaw === 'paginated' ? 'paginated' : 'recent';
    const payload = {
      privacy_notice: optionalString(formData.get('guestbook_privacy_notice'), '', 200),
      retention_text: optionalString(formData.get('guestbook_retention_text'), '', 200),
      display_mode: displayMode,
      page_size: numberWithDefault(formData.get('guestbook_page_size'), 5, {
        min: 1,
        max: 50,
        integer: true,
      }),
      recent_notice: optionalString(formData.get('guestbook_recent_notice'), '', 200),
      enable_password: checkboxToBool(formData.get('guestbook_enable_password'), true),
      enable_edit: checkboxToBool(formData.get('guestbook_enable_edit'), true),
      enable_delete: checkboxToBool(formData.get('guestbook_enable_delete'), true),
      section_title: sectionTitle || '축하 메시지',
    };

    assertNoError(
      await supabase.from('invitation_guestbook').update(payload).eq('invitation_id', id)
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
