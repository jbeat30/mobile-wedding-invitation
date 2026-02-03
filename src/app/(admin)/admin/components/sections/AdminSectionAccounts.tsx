'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import {
  addAccountEntryAction,
  deleteAccountEntryAction,
  updateAccountEntryAction,
  updateAccountsAction,
} from '@/app/(admin)/admin/actions/accounts';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminSelectField } from '@/app/(admin)/admin/components/AdminSelectField';
import { Textarea } from '@/components/ui/textarea';
import { BANK_OPTIONS } from '@/constants/banks';
import { CreditCardIcon } from 'lucide-react';

type AdminSectionAccountsProps = {
  accounts: AdminDashboardData['accounts'];
  groomEntries: AdminDashboardData['accountEntries'];
  brideEntries: AdminDashboardData['accountEntries'];
  accountFormOpen: { groom: boolean; bride: boolean };
  setAccountFormOpen: Dispatch<SetStateAction<{ groom: boolean; bride: boolean }>>;
};

const BANK_SELECT_OPTIONS = BANK_OPTIONS.map((option) => ({
  value: option.name,
  label: option.name,
}));

const getBankSelectOptions = (bankName: string) => {
  const normalized = bankName.trim();
  if (!normalized) return BANK_SELECT_OPTIONS;
  const hasMatch = BANK_SELECT_OPTIONS.some((option) => option.value === normalized);
  if (hasMatch) return BANK_SELECT_OPTIONS;
  return [{ value: normalized, label: normalized }, ...BANK_SELECT_OPTIONS];
};

const AccountEntryFormFields = ({ groupKey, label }: { groupKey: 'groom' | 'bride'; label: string }) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${groupKey}_bank_name`}>은행명</Label>
        <AdminSelectField
          id={`${groupKey}_bank_name`}
          name="bank_name"
          defaultValue=""
          options={BANK_SELECT_OPTIONS}
          placeholder="은행을 선택하세요"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${groupKey}_account_number`}>계좌번호</Label>
        <Input
          id={`${groupKey}_account_number`}
          name="account_number"
          pattern="[\d-]+"
          title="숫자와 하이픈만 입력 가능합니다"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${groupKey}_holder`}>예금주</Label>
        <Input
          id={`${groupKey}_holder`}
          name="holder"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${groupKey}_label`}>라벨</Label>
        <Input id={`${groupKey}_label`} name="label" placeholder={label} />
      </div>
    </>
  );
};

const AccountEntryEditor = ({
  entryId,
  bankName,
  accountNumber,
  holder,
  label,
  groupLabel,
}: {
  entryId: string;
  bankName: string;
  accountNumber: string;
  holder: string;
  label: string | null;
  groupLabel: string;
}) => {
  return (
    <>
      <input type="hidden" name="entry_id" value={entryId} />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`bank_name_${entryId}`}>은행명</Label>
          <AdminSelectField
            id={`bank_name_${entryId}`}
            name="bank_name"
            defaultValue={bankName}
            options={getBankSelectOptions(bankName)}
            placeholder="은행을 선택하세요"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`account_number_${entryId}`}>계좌번호</Label>
          <Input
            id={`account_number_${entryId}`}
            name="account_number"
            defaultValue={accountNumber}
            pattern="[\d-]+"
            title="숫자와 하이픈만 입력 가능합니다"
          />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`holder_${entryId}`}>예금주</Label>
          <Input
            id={`holder_${entryId}`}
            name="holder"
            defaultValue={holder}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`label_${entryId}`}>라벨</Label>
          <Input
            id={`label_${entryId}`}
            name="label"
            defaultValue={label || ''}
            placeholder={groupLabel}
          />
        </div>
      </div>
    </>
  );
};


/**
 * 어카운트 섹션
 * @param props AdminSectionAccountsProps
 * @returns JSX.Element
 */
export const AdminSectionAccounts = ({
  accounts,
  groomEntries,
  brideEntries,
  accountFormOpen,
  setAccountFormOpen,
}: AdminSectionAccountsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <CreditCardIcon className="w-7 h-7 text-blue-600 mt-1" />
        <h1 className="text-2xl font-bold text-gray-900">계좌 정보</h1>
        <p className="text-gray-600 mt-1">신랑신부 은행 계좌를 관리하세요</p>
      </div>

    <Card>
      <CardHeader>
        <CardTitle>어카운트</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <AdminForm
            action={updateAccountsAction}
            successMessage="계좌 정보가 저장되었습니다"
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="accounts_section_title">섹션 타이틀</Label>
              <Input
                id="accounts_section_title"
                name="accounts_section_title"
                defaultValue={accounts.section_title}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="accounts_description">설명</Label>
              <Textarea
                id="accounts_description"
                name="accounts_description"
                defaultValue={accounts.description}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <AdminSubmitButton size="sm" pendingText="저장 중...">
                저장하기
              </AdminSubmitButton>
            </div>
          </AdminForm>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { key: 'groom', label: '신랑', entries: groomEntries },
              { key: 'bride', label: '신부', entries: brideEntries },
            ].map((group) => {
              const groupKey = group.key as 'groom' | 'bride';
              return (
                <div key={group.key} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                      {group.label}
                    </h3>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setAccountFormOpen((prev) => ({
                          ...prev,
                          [groupKey]: !prev[groupKey],
                        }))
                      }
                    >
                      {accountFormOpen[groupKey] ? '닫기' : '+ 추가'}
                    </Button>
                  </div>

                  {accountFormOpen[groupKey] ? (
                    <div className="rounded-[14px] border border-[var(--border-light)] bg-[var(--bg-secondary)]/70 p-4">
                      <div className="mb-3 text-[13px] font-semibold text-[var(--text-muted)]">
                        {group.label}측 계좌 추가
                      </div>
                      <AdminForm
                        action={addAccountEntryAction}
                        successMessage="계좌가 추가되었습니다"
                        className="grid gap-3"
                      >
                        <input type="hidden" name="accounts_id" value={accounts.id} />
                        <input type="hidden" name="group_type" value={groupKey} />
                      <AccountEntryFormFields groupKey={groupKey} label={group.label} />
                        <div className="flex justify-end">
                          <AdminSubmitButton size="sm" pendingText="추가 중...">
                            추가하기
                          </AdminSubmitButton>
                        </div>
                      </AdminForm>
                    </div>
                  ) : null}

                  <div className="rounded-[12px] border border-[var(--border-light)] bg-white/70">
                    {group.entries.length ? (
                      <div className="divide-y divide-[var(--border-light)]">
                        {group.entries.map((entry) => (
                          <div key={entry.id} className="flex flex-col gap-4 px-4 py-4">
                            <AdminForm
                              action={updateAccountEntryAction}
                              successMessage="계좌가 저장되었습니다"
                              className="grid gap-3"
                              formId={`account-entry-${entry.id}`}
                            >
                              <AccountEntryEditor
                                entryId={entry.id}
                                bankName={entry.bank_name || ''}
                                accountNumber={entry.account_number}
                                holder={entry.holder}
                                label={entry.label}
                                groupLabel={group.label}
                              />
                            </AdminForm>
                            <div className="flex items-center justify-end gap-2">
                              <button type="submit" form={`account-entry-${entry.id}`}>
                                저장
                              </button>
                              <AdminForm
                                action={deleteAccountEntryAction}
                                successMessage="계좌가 삭제되었습니다"
                                confirmTitle="계좌를 삭제할까요?"
                                confirmDescription="삭제 후에는 복구할 수 없습니다."
                              >
                                <input type="hidden" name="entry_id" value={entry.id} />
                                <button type="submit" data-admin-variant="cancel">
                                  삭제
                                </button>
                              </AdminForm>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center text-[14px] text-[var(--text-muted)]">
                        등록된 계좌가 없습니다
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};
