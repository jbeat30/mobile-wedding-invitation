'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { requireAdminSession, revalidateAdmin } from './shared';

/**
 * 계좌 정보 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateAccountsAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  const payload = {
    title: String(formData.get('accounts_title') || ''),
    description: String(formData.get('accounts_description') || ''),
  };

  await supabase.from('invitation_accounts').update(payload).eq('invitation_id', id);
  revalidateAdmin();
};

/**
 * 계좌 항목 추가
 * @param formData FormData
 * @returns Promise<void>
 */
export const addAccountEntryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const accountsId = String(formData.get('accounts_id') || '');

  const payload = {
    accounts_id: accountsId,
    group_type: String(formData.get('account_group_type') || ''),
    bank_name: String(formData.get('account_bank_name') || ''),
    account_number: String(formData.get('account_number') || ''),
    holder: String(formData.get('account_holder') || ''),
    label: String(formData.get('account_label') || ''),
  };

  await supabase.from('invitation_account_entry').insert(payload);
  revalidateAdmin();
};

/**
 * 계좌 항목 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateAccountEntryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const entryId = String(formData.get('account_entry_id') || '');

  const payload = {
    group_type: String(formData.get('account_group_type') || ''),
    bank_name: String(formData.get('account_bank_name') || ''),
    account_number: String(formData.get('account_number') || ''),
    holder: String(formData.get('account_holder') || ''),
    label: String(formData.get('account_label') || ''),
  };

  await supabase.from('invitation_account_entry').update(payload).eq('id', entryId);
  revalidateAdmin();
};

/**
 * 계좌 항목 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteAccountEntryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const entryId = String(formData.get('account_entry_id') || '');
  await supabase.from('invitation_account_entry').delete().eq('id', entryId);
  revalidateAdmin();
};
