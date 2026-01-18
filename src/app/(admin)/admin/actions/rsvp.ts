'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { parseLines, requireAdminSession, revalidateAdmin, toNumber } from './shared';

/**
 * RSVP 설정 업데이트
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
  };

  await supabase.from('invitation_rsvp').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * RSVP 필드 추가
 * @param formData FormData
 * @returns Promise<void>
 */
export const addRsvpFieldAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const rsvpId = String(formData.get('rsvp_id') || '');

  const payload = {
    rsvp_id: rsvpId,
    field_key: String(formData.get('rsvp_field_key') || ''),
    label: String(formData.get('rsvp_field_label') || ''),
    required: formData.get('rsvp_field_required') === 'on',
    placeholder: String(formData.get('rsvp_field_placeholder') || ''),
    options: parseLines(String(formData.get('rsvp_field_options') || '')),
    sort_order: toNumber(formData.get('rsvp_field_sort_order')),
  };

  await supabase.from('invitation_rsvp_field').insert(payload);
  revalidateAdmin();
};

/**
 * RSVP 필드 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateRsvpFieldAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const fieldId = String(formData.get('rsvp_field_id') || '');

  const payload = {
    field_key: String(formData.get('rsvp_field_key') || ''),
    label: String(formData.get('rsvp_field_label') || ''),
    required: formData.get('rsvp_field_required') === 'on',
    placeholder: String(formData.get('rsvp_field_placeholder') || ''),
    options: parseLines(String(formData.get('rsvp_field_options') || '')),
    sort_order: toNumber(formData.get('rsvp_field_sort_order')),
  };

  await supabase.from('invitation_rsvp_field').update(payload).eq('id', fieldId);
  revalidateAdmin();
};

/**
 * RSVP 필드 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteRsvpFieldAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const fieldId = String(formData.get('rsvp_field_id') || '');
  await supabase.from('invitation_rsvp_field').delete().eq('id', fieldId);
  revalidateAdmin();
};
