'use server';

import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getOrCreateInvitation } from '@/app/(admin)/admin/data';
import {
  assertNoError,
  getActionErrorMessage,
  requireAdminSession,
  revalidateAdmin,
} from './shared';
import { optionalString, requiredString } from './validation';

/**
 * 계좌 정보 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateAccountsAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  const { id } = await getOrCreateInvitation();

  try {
    const payload = {
      section_title: optionalString(formData.get('accounts_section_title'), '마음 전하실 곳', 100),
      description: optionalString(formData.get('accounts_description'), '', 500),
    };

    assertNoError(
      await supabase.from('invitation_accounts').update(payload).eq('invitation_id', id)
    );
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getActionErrorMessage(error) };
  }
};

/**
 * 계좌 항목 추가
 * @param formData FormData
 * @returns Promise<void>
 */
export const addAccountEntryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();

  try {
    const accountsId = requiredString(formData.get('accounts_id'), 'accounts_id', 100);
    const groupType = requiredString(formData.get('group_type'), 'group_type', 10);
    if (groupType !== 'groom' && groupType !== 'bride') {
      throw new Error('그룹 타입이 올바르지 않습니다.');
    }

    const payload = {
      accounts_id: accountsId,
      group_type: groupType,
      bank_name: requiredString(formData.get('bank_name'), '은행명', 50),
      account_number: requiredString(formData.get('account_number'), '계좌번호', 50),
      holder: requiredString(formData.get('holder'), '예금주', 50),
      label: optionalString(formData.get('label'), '', 50),
    };

    assertNoError(await supabase.from('invitation_account_entries').insert(payload));
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getActionErrorMessage(error) };
  }
};

/**
 * 계좌 항목 업데이트
 * @param formData FormData
 * @returns Promise<void>
 */
export const updateAccountEntryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();

  try {
    const entryId = requiredString(formData.get('entry_id'), 'entry_id', 100);

    const payload = {
      bank_name: requiredString(formData.get('bank_name'), '은행명', 50),
      account_number: requiredString(formData.get('account_number'), '계좌번호', 50),
      holder: requiredString(formData.get('holder'), '예금주', 50),
      label: optionalString(formData.get('label'), '', 50),
    };

    assertNoError(
      await supabase.from('invitation_account_entries').update(payload).eq('id', entryId)
    );
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getActionErrorMessage(error) };
  }
};

/**
 * 계좌 항목 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteAccountEntryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();

  try {
    const entryId = requiredString(formData.get('entry_id'), 'entry_id', 100);
    assertNoError(await supabase.from('invitation_account_entries').delete().eq('id', entryId));
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getActionErrorMessage(error) };
  }
};
