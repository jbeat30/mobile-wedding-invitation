'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { assertNoError, getActionErrorMessage, requireAdminSession, revalidateAdmin } from './shared';
import { optionalString } from './validation';

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
    const lines = optionalString(formData.get('message_lines'), '', 2000)
      .split('\n')
      .map((line) => line.trimEnd());

    assertNoError(
      await supabase
        .from('invitation_greeting')
        .update({
          poetic_note: optionalString(formData.get('poetic_note'), '', 200),
          message_lines: lines,
          section_title: optionalString(formData.get('greeting_section_title'), '초대합니다', 100),
        })
        .eq('invitation_id', id)
    );

    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getActionErrorMessage(error) };
  }
};
