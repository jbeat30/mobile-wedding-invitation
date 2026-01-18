'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { requireAdminSession, revalidateAdmin } from './shared';

/**
 * 인사말 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateGreetingAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const lines = String(formData.get('message_lines') || '')
    .split('\n')
    .map((line) => line.trimEnd());

  await supabase
    .from('invitation_greeting')
    .update({
      section_title: String(formData.get('greeting_section_title') || ''),
      poetic_note: String(formData.get('poetic_note') || ''),
      message_lines: lines,
    })
    .eq('invitation_id', id);

  revalidateAdmin();
};
