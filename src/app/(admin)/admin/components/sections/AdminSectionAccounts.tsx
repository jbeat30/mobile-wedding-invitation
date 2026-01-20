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
import { Textarea } from '@/components/ui/textarea';

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
              <Label htmlFor="accounts_title">타이틀</Label>
              <Input id="accounts_title" name="accounts_title" defaultValue={accounts.title} />
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
                    <AdminForm
                      action={addAccountEntryAction}
                      successMessage="계좌가 추가되었습니다"
                      className="grid gap-3"
                    >
                      <input type="hidden" name="accounts_id" value={accounts.id} />
                      <input type="hidden" name="group_type" value={groupKey} />
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`${groupKey}_bank_name`}>은행명</Label>
                        <Input id={`${groupKey}_bank_name`} name="bank_name" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`${groupKey}_account_number`}>계좌번호</Label>
                        <Input id={`${groupKey}_account_number`} name="account_number" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`${groupKey}_holder`}>예금주</Label>
                        <Input id={`${groupKey}_holder`} name="holder" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`${groupKey}_label`}>라벨</Label>
                        <Input id={`${groupKey}_label`} name="label" />
                      </div>
                      <div className="flex justify-end">
                        <AdminSubmitButton size="sm" pendingText="추가 중...">
                          추가하기
                        </AdminSubmitButton>
                      </div>
                    </AdminForm>
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
                            >
                              <input type="hidden" name="entry_id" value={entry.id} />
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                  <Label htmlFor={`bank_name_${entry.id}`}>은행명</Label>
                                  <Input
                                    id={`bank_name_${entry.id}`}
                                    name="bank_name"
                                    defaultValue={entry.bank_name}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Label htmlFor={`account_number_${entry.id}`}>
                                    계좌번호
                                  </Label>
                                  <Input
                                    id={`account_number_${entry.id}`}
                                    name="account_number"
                                    defaultValue={entry.account_number}
                                  />
                                </div>
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                  <Label htmlFor={`holder_${entry.id}`}>예금주</Label>
                                  <Input
                                    id={`holder_${entry.id}`}
                                    name="holder"
                                    defaultValue={entry.holder}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Label htmlFor={`label_${entry.id}`}>라벨</Label>
                                  <Input
                                    id={`label_${entry.id}`}
                                    name="label"
                                    defaultValue={entry.label || ''}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <AdminSubmitButton size="sm" pendingText="저장 중...">
                                  저장
                                </AdminSubmitButton>
                              </div>
                            </AdminForm>
                            <div className="flex items-center justify-end gap-2">
                              <AdminForm
                                action={deleteAccountEntryAction}
                                successMessage="계좌가 삭제되었습니다"
                                confirmTitle="계좌를 삭제할까요?"
                                confirmDescription="삭제 후에는 복구할 수 없습니다."
                              >
                                <input type="hidden" name="entry_id" value={entry.id} />
                                <Button type="submit" variant="destructive" size="sm">
                                  삭제
                                </Button>
                              </AdminForm>
                            </div>
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
      </CardContent>
    </Card>
  );
};
