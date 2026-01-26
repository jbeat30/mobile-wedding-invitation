'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { assertNoError, requireAdminSession, revalidateAdmin } from './shared';

/**
 * RSVP 기본 설정/동의 문구 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateRsvpAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();
  const deadlineValue = String(formData.get('rsvp_deadline') || '').trim();

  const payload = {
    enabled: formData.get('rsvp_enabled') === 'on',
    deadline: deadlineValue ? deadlineValue : null,
    consent_title: String(formData.get('rsvp_consent_title') || ''),
    consent_description: String(formData.get('rsvp_consent_description') || ''),
    consent_retention: String(formData.get('rsvp_consent_retention') || ''),
    consent_notice: String(formData.get('rsvp_consent_notice') || ''),
    section_title: String(formData.get('rsvp_section_title') || ''),
  };

  assertNoError(
    await supabase.from('invitation_rsvp').update(payload).eq('invitation_id', id)
  );
  revalidateAdmin();
};
