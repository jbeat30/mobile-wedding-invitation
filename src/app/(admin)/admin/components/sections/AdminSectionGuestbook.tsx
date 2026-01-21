'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateGuestbookAction } from '@/app/(admin)/admin/actions/guestbook';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminSelectField } from '@/app/(admin)/admin/components/AdminSelectField';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { AdminSwitchField } from '@/app/(admin)/admin/components/AdminSwitchField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ColumnDef } from '@tanstack/react-table';

type AdminSectionGuestbookProps = {
  guestbook: AdminDashboardData['guestbook'];
  guestbookEntries: AdminDashboardData['guestbookEntries'];
  sectionTitles: AdminDashboardData['sectionTitles'];
  guestbookPage: number;
  setGuestbookPage: Dispatch<SetStateAction<number>>;
};

/**
 * 게스트북 섹션
 * @param props AdminSectionGuestbookProps
 * @returns JSX.Element
 */
export const AdminSectionGuestbook = ({
  guestbook,
  guestbookEntries,
  sectionTitles,
  guestbookPage,
  setGuestbookPage,
}: AdminSectionGuestbookProps) => {
  useEffect(() => {
    const pageSize = 6;
    const totalPages = Math.max(1, Math.ceil(guestbookEntries.length / pageSize));
    if (guestbookPage > totalPages) {
      setGuestbookPage(totalPages);
    }
  }, [guestbookEntries.length, guestbookPage, setGuestbookPage]);

  const columns: ColumnDef<(typeof guestbookEntries)[number]>[] = [
    {
      accessorKey: 'name',
      header: '이름',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'message',
      header: '메시지',
      cell: ({ row }) => (
        <span className="line-clamp-2 text-[var(--text-secondary)]">{row.original.message}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: '작성일',
      cell: ({ row }) => (
        <span className="text-[var(--text-muted)]">
          {new Date(row.original.createdAt).toLocaleDateString('ko-KR')}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>게스트북</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminForm
          action={updateGuestbookAction}
          successMessage="게스트북 설정이 저장되었습니다"
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="guestbook_section_title">게스트북 섹션 타이틀</Label>
            <Input
              id="guestbook_section_title"
              name="guestbook_section_title"
              defaultValue={sectionTitles.guestbook}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="guestbook_privacy_notice">개인정보 안내 문구</Label>
            <Input
              id="guestbook_privacy_notice"
              name="guestbook_privacy_notice"
              defaultValue={guestbook.privacy_notice}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="guestbook_display_mode">표시 방식</Label>
            <AdminSelectField
              id="guestbook_display_mode"
              name="guestbook_display_mode"
              defaultValue={guestbook.display_mode === 'paginated' ? 'paginated' : 'recent'}
              disabled
              options={[
                { value: 'recent', label: '최근' },
                { value: 'paginated', label: '페이지네이션' },
              ]}
            />
            <p className="text-[14px] text-[var(--text-muted)]">
              현재 퍼블릭 페이지에서 사용 중인 방식입니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="guestbook_page_size">노출 개수</Label>
            <Input
              id="guestbook_page_size"
              name="guestbook_page_size"
              type="number"
              defaultValue={guestbook.page_size}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="guestbook_recent_notice">최근 노출 안내</Label>
            <Input
              id="guestbook_recent_notice"
              name="guestbook_recent_notice"
              defaultValue={guestbook.recent_notice || ''}
            />
          </div>
          <div className="grid gap-2 md:col-span-2 md:grid-cols-3">
            <AdminSwitchField
              id="guestbook_enable_password"
              name="guestbook_enable_password"
              label="비밀번호 사용"
              defaultChecked={guestbook.enable_password}
            />
            <AdminSwitchField
              id="guestbook_enable_edit"
              name="guestbook_enable_edit"
              label="수정 허용"
              defaultChecked={guestbook.enable_edit}
            />
            <AdminSwitchField
              id="guestbook_enable_delete"
              name="guestbook_enable_delete"
              label="삭제 허용"
              defaultChecked={guestbook.enable_delete}
            />
          </div>
          <div className="flex justify-end md:col-span-2">
            <AdminSubmitButton size="sm" pendingText="저장 중...">
              저장하기
            </AdminSubmitButton>
          </div>
        </AdminForm>

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={guestbookEntries}
            pageIndex={guestbookPage}
            pageSize={6}
            onPageChange={setGuestbookPage}
            emptyMessage="등록된 방명록이 없습니다"
          />
        </div>
      </CardContent>
    </Card>
  );
};
