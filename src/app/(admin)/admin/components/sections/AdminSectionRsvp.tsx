'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateRsvpAction } from '@/app/(admin)/admin/actions/rsvp';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { AdminSwitchField } from '@/app/(admin)/admin/components/AdminSwitchField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ColumnDef } from '@tanstack/react-table';

type AdminSectionRsvpProps = {
  rsvp: AdminDashboardData['rsvp'];
  rsvpResponses: AdminDashboardData['rsvpResponses'];
  sectionTitles: AdminDashboardData['sectionTitles'];
  rsvpPage: number;
  setRsvpPage: Dispatch<SetStateAction<number>>;
};

/**
 * RSVP 섹션
 * @param props AdminSectionRsvpProps
 * @returns JSX.Element
 */
export const AdminSectionRsvp = ({
  rsvp,
  rsvpResponses,
  sectionTitles,
  rsvpPage,
  setRsvpPage,
}: AdminSectionRsvpProps) => {
  useEffect(() => {
    const pageSize = 8;
    const totalPages = Math.max(1, Math.ceil(rsvpResponses.length / pageSize));
    if (rsvpPage > totalPages) {
      setRsvpPage(totalPages);
    }
  }, [rsvpResponses.length, rsvpPage, setRsvpPage]);

  const columns: ColumnDef<(typeof rsvpResponses)[number]>[] = [
    {
      accessorKey: 'name',
      header: '이름',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'attendance',
      header: '참석',
      cell: ({ row }) => <span>{row.original.attendance}</span>,
    },
    {
      accessorKey: 'companions',
      header: '인원',
      cell: ({ row }) => <span>{row.original.companions || '-'}</span>,
    },
    {
      accessorKey: 'meal',
      header: '식사',
      cell: ({ row }) => <span>{row.original.meal || '-'}</span>,
    },
    {
      accessorKey: 'submittedAt',
      header: '작성일',
      cell: ({ row }) => (
        <span className="text-[var(--text-muted)]">
          {new Date(row.original.submittedAt).toLocaleDateString('ko-KR')}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>RSVP 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminForm
            action={updateRsvpAction}
            successMessage="RSVP 설정이 저장되었습니다"
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="rsvp_section_title">RSVP 섹션 타이틀</Label>
              <Input
                id="rsvp_section_title"
                name="rsvp_section_title"
                defaultValue={sectionTitles.rsvp}
              />
            </div>
            <AdminSwitchField
              id="rsvp_enabled"
              name="rsvp_enabled"
              label="RSVP 사용"
              defaultChecked={rsvp.enabled}
              className="md:col-span-2"
            />
            <div className="flex flex-col gap-2 md:col-span-2">
              <DateTimePicker
                id="rsvp_deadline"
                name="rsvp_deadline"
                label="마감 일시"
                defaultValue={rsvp.deadline || ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="rsvp_consent_title">개인정보 동의 제목</Label>
              <Input
                id="rsvp_consent_title"
                name="rsvp_consent_title"
                defaultValue={rsvp.consent_title || ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="rsvp_consent_retention">보관 기간</Label>
              <Input
                id="rsvp_consent_retention"
                name="rsvp_consent_retention"
                defaultValue={rsvp.consent_retention || ''}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="rsvp_consent_description">동의 설명</Label>
              <Textarea
                id="rsvp_consent_description"
                name="rsvp_consent_description"
                defaultValue={rsvp.consent_description || ''}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="rsvp_consent_notice">안내 문구</Label>
              <Textarea
                id="rsvp_consent_notice"
                name="rsvp_consent_notice"
                defaultValue={rsvp.consent_notice || ''}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <AdminSubmitButton size="sm" pendingText="저장 중...">
                저장하기
              </AdminSubmitButton>
            </div>
          </AdminForm>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RSVP 응답 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={rsvpResponses}
            pageIndex={rsvpPage}
            pageSize={8}
            onPageChange={setRsvpPage}
            emptyMessage="등록된 RSVP가 없습니다"
          />
        </CardContent>
      </Card>
    </div>
  );
};
