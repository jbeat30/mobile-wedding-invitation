'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import {
  addAccountEntryAction,
  deleteAccountEntryAction,
  updateAccountEntryAction,
  updateAccountsAction,
} from '@/app/(admin)/admin/actions/accounts';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';

type AdminSectionAccountsProps = {
  accounts: AdminDashboardData['accounts'];
  groomEntries: AdminDashboardData['accountEntries'];
  brideEntries: AdminDashboardData['accountEntries'];
  accountFormOpen: { groom: boolean; bride: boolean };
  setAccountFormOpen: Dispatch<SetStateAction<{ groom: boolean; bride: boolean }>>;
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
    <SurfaceCard className="p-6">
      <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">어카운트</h2>
      <div className="mt-4 flex flex-col gap-6">
        <form action={updateAccountsAction} className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="accounts_title">타이틀</FieldLabel>
            <TextInput id="accounts_title" name="accounts_title" defaultValue={accounts.title} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="accounts_description">설명</FieldLabel>
            <TextArea
              id="accounts_description"
              name="accounts_description"
              defaultValue={accounts.description}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" size="sm">
              저장하기
            </Button>
          </div>
        </form>

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
                  <form action={addAccountEntryAction} className="grid gap-3">
                    <input type="hidden" name="accounts_id" value={accounts.id} />
                    <input type="hidden" name="group_type" value={groupKey} />
                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor={`${groupKey}_bank_name`}>은행명</FieldLabel>
                      <TextInput id={`${groupKey}_bank_name`} name="bank_name" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor={`${groupKey}_account_number`}>계좌번호</FieldLabel>
                      <TextInput id={`${groupKey}_account_number`} name="account_number" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor={`${groupKey}_holder`}>예금주</FieldLabel>
                      <TextInput id={`${groupKey}_holder`} name="holder" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor={`${groupKey}_label`}>라벨</FieldLabel>
                      <TextInput id={`${groupKey}_label`} name="label" />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" size="sm">
                        추가하기
                      </Button>
                    </div>
                  </form>
                ) : null}

                <div className="rounded-[12px] border border-[var(--border-light)] bg-white/70">
                  {group.entries.length ? (
                    <div className="divide-y divide-[var(--border-light)]">
                      {group.entries.map((entry) => (
                        <div key={entry.id} className="flex flex-col gap-4 px-4 py-4">
                          <form action={updateAccountEntryAction} className="grid gap-3">
                            <input type="hidden" name="entry_id" value={entry.id} />
                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="flex flex-col gap-2">
                                <FieldLabel htmlFor={`bank_name_${entry.id}`}>은행명</FieldLabel>
                                <TextInput
                                  id={`bank_name_${entry.id}`}
                                  name="bank_name"
                                  defaultValue={entry.bank_name}
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <FieldLabel htmlFor={`account_number_${entry.id}`}>
                                  계좌번호
                                </FieldLabel>
                                <TextInput
                                  id={`account_number_${entry.id}`}
                                  name="account_number"
                                  defaultValue={entry.account_number}
                                />
                              </div>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="flex flex-col gap-2">
                                <FieldLabel htmlFor={`holder_${entry.id}`}>예금주</FieldLabel>
                                <TextInput
                                  id={`holder_${entry.id}`}
                                  name="holder"
                                  defaultValue={entry.holder}
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <FieldLabel htmlFor={`label_${entry.id}`}>라벨</FieldLabel>
                                <TextInput
                                  id={`label_${entry.id}`}
                                  name="label"
                                  defaultValue={entry.label || ''}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button type="submit" size="sm">
                                저장
                              </Button>
                            </div>
                          </form>
                          <form action={deleteAccountEntryAction} className="flex justify-end">
                            <input type="hidden" name="entry_id" value={entry.id} />
                            <Button type="submit" variant="danger" size="sm">
                              삭제
                            </Button>
                          </form>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-[12px] text-[var(--text-muted)]">
                      등록된 계좌가 없습니다
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SurfaceCard>
  );
};
