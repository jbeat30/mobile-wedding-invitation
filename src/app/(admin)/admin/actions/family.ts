'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { requireAdminSession, revalidateAdmin } from './shared';

/**
 * 가족 라인 추가
 * @param formData FormData
 * @returns Promise<void>
 */
export const addFamilyLineAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    invitation_id: id,
    subject: String(formData.get('family_subject') || ''),
    relationship_label: String(formData.get('family_relationship_label') || ''),
  };

  await supabase.from('invitation_family_line').insert(payload);
  revalidateAdmin();
};

/**
 * 가족 라인 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateFamilyLineAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const lineId = String(formData.get('family_line_id') || '');

  const payload = {
    subject: String(formData.get('family_subject') || ''),
    relationship_label: String(formData.get('family_relationship_label') || ''),
  };

  await supabase.from('invitation_family_line').update(payload).eq('id', lineId);
  revalidateAdmin();
};

/**
 * 가족 라인 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteFamilyLineAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const lineId = String(formData.get('family_line_id') || '');
  await supabase.from('invitation_family_member').delete().eq('family_line_id', lineId);
  await supabase.from('invitation_family_line').delete().eq('id', lineId);
  revalidateAdmin();
};

/**
 * 가족 구성원 추가
 * @param formData FormData
 * @returns Promise<void>
 */
export const addFamilyMemberAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();

  const payload = {
    family_line_id: String(formData.get('family_line_id') || ''),
    role: String(formData.get('family_member_role') || ''),
    name: String(formData.get('family_member_name') || ''),
    prefix: String(formData.get('family_member_prefix') || ''),
    suffix: String(formData.get('family_member_suffix') || ''),
  };

  await supabase.from('invitation_family_member').insert(payload);
  revalidateAdmin();
};

/**
 * 가족 구성원 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateFamilyMemberAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const memberId = String(formData.get('family_member_id') || '');

  const payload = {
    family_line_id: String(formData.get('family_line_id') || ''),
    role: String(formData.get('family_member_role') || ''),
    name: String(formData.get('family_member_name') || ''),
    prefix: String(formData.get('family_member_prefix') || ''),
    suffix: String(formData.get('family_member_suffix') || ''),
  };

  await supabase.from('invitation_family_member').update(payload).eq('id', memberId);
  revalidateAdmin();
};

/**
 * 가족 구성원 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteFamilyMemberAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const memberId = String(formData.get('family_member_id') || '');
  await supabase.from('invitation_family_member').delete().eq('id', memberId);
  revalidateAdmin();
};
