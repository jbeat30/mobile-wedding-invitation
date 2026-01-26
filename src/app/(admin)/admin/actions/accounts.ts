'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import { assertNoError, requireAdminSession, revalidateAdmin } from './shared';

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
    section_title: String(formData.get('accounts_section_title') || ''),
    description: String(formData.get('accounts_description') || ''),
  };

  assertNoError(
    await supabase.from('invitation_accounts').update(payload).eq('invitation_id', id)
  );
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
    group_type: String(formData.get('group_type') || ''),
    bank_name: String(formData.get('bank_name') || ''),
    account_number: String(formData.get('account_number') || ''),
    holder: String(formData.get('holder') || ''),
    label: String(formData.get('label') || ''),
  };

  assertNoError(await supabase.from('invitation_account_entries').insert(payload));
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
  const entryId = String(formData.get('entry_id') || '');

  const payload = {
    bank_name: String(formData.get('bank_name') || ''),
    account_number: String(formData.get('account_number') || ''),
    holder: String(formData.get('holder') || ''),
    label: String(formData.get('label') || ''),
  };

  assertNoError(await supabase.from('invitation_account_entries').update(payload).eq('id', entryId));
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
  const entryId = String(formData.get('entry_id') || '');
  assertNoError(await supabase.from('invitation_account_entries').delete().eq('id', entryId));
  revalidateAdmin();
};
