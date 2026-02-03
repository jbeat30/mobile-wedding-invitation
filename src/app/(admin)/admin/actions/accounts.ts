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
  isValidationError,
  optionalString,
  safeRequiredPatternString,
  safeRequiredString,
} from './validation';

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
    const fieldErrors: Record<string, string> = {};
    const sectionTitle = safeRequiredString(
      formData.get('accounts_section_title'),
      'accounts_section_title',
      '섹션 타이틀',
      100,
      fieldErrors,
      '섹션 타이틀을 입력해주세요.'
    );

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    const payload = {
      section_title: sectionTitle || '마음 전하실 곳',
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
    const fieldErrors: Record<string, string> = {};
    const accountsId = safeRequiredString(
      formData.get('accounts_id'),
      'accounts_id',
      'accounts_id',
      100,
      fieldErrors
    );
    const groupType = safeRequiredString(
      formData.get('group_type'),
      'group_type',
      'group_type',
      10,
      fieldErrors
    );
    if (groupType !== 'groom' && groupType !== 'bride') {
      fieldErrors.group_type = '그룹 타입이 올바르지 않습니다.';
    }

    const payload = {
      accounts_id: accountsId,
      group_type: groupType,
      bank_name: safeRequiredString(
        formData.get('bank_name'),
        'bank_name',
        '은행명',
        50,
        fieldErrors,
        '은행명을 입력해주세요.'
      ),
      account_number: safeRequiredPatternString(
        formData.get('account_number'),
        'account_number',
        '계좌번호',
        50,
        fieldErrors,
        /^[0-9-]{6,50}$/,
        '계좌번호를 정확히 입력해주세요.'
      ),
      holder: safeRequiredString(
        formData.get('holder'),
        'holder',
        '예금주',
        50,
        fieldErrors,
        '예금주를 입력해주세요.'
      ),
      label: safeRequiredString(
        formData.get('label'),
        'label',
        '라벨',
        50,
        fieldErrors,
        '라벨을 입력해주세요.'
      ),
    };

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    assertNoError(await supabase.from('invitation_account_entries').insert(payload));
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
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
    const fieldErrors: Record<string, string> = {};
    const entryId = safeRequiredString(
      formData.get('entry_id'),
      'entry_id',
      'entry_id',
      100,
      fieldErrors
    );

    const payload = {
      bank_name: safeRequiredString(
        formData.get('bank_name'),
        'bank_name',
        '은행명',
        50,
        fieldErrors,
        '은행명을 입력해주세요.'
      ),
      account_number: safeRequiredPatternString(
        formData.get('account_number'),
        'account_number',
        '계좌번호',
        50,
        fieldErrors,
        /^[0-9-]{6,50}$/,
        '계좌번호를 정확히 입력해주세요.'
      ),
      holder: safeRequiredString(
        formData.get('holder'),
        'holder',
        '예금주',
        50,
        fieldErrors,
        '예금주를 입력해주세요.'
      ),
      label: safeRequiredString(
        formData.get('label'),
        'label',
        '라벨',
        50,
        fieldErrors,
        '라벨을 입력해주세요.'
      ),
    };

    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, fieldErrors };
    }

    assertNoError(
      await supabase.from('invitation_account_entries').update(payload).eq('id', entryId)
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

/**
 * 계좌 항목 삭제
 * @param formData FormData
 * @returns Promise<void>
 */
export const deleteAccountEntryAction = async (formData: FormData) => {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();

  try {
    const entryId = safeRequiredString(
      formData.get('entry_id'),
      'entry_id',
      'entry_id',
      100,
      {}
    );
    assertNoError(await supabase.from('invitation_account_entries').delete().eq('id', entryId));
    revalidateAdmin();
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) {
      return { ok: false, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: getActionErrorMessage(error) };
  }
};
