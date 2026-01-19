'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateGuestbookAction } from '@/app/(admin)/admin/actions/guestbook';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SelectField } from '@/components/ui/SelectField';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextInput } from '@/components/ui/TextInput';

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
  return (
    <SurfaceCard className="p-6">
      <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">게스트북</h2>
      <form action={updateGuestbookAction} className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:col-span-2">
          <FieldLabel htmlFor="guestbook_section_title">게스트북 섹션 타이틀</FieldLabel>
          <TextInput
            id="guestbook_section_title"
            name="guestbook_section_title"
            defaultValue={sectionTitles.guestbook}
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <FieldLabel htmlFor="guestbook_privacy_notice">개인정보 안내 문구</FieldLabel>
          <TextInput
            id="guestbook_privacy_notice"
            name="guestbook_privacy_notice"
            defaultValue={guestbook.privacy_notice}
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <FieldLabel htmlFor="guestbook_retention_text">보관 기간 안내</FieldLabel>
          <TextInput
            id="guestbook_retention_text"
            name="guestbook_retention_text"
            defaultValue={guestbook.retention_text}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="guestbook_display_mode">표시 방식</FieldLabel>
          <SelectField
            id="guestbook_display_mode"
            name="guestbook_display_mode"
            defaultValue={guestbook.display_mode}
          >
            <option value="recent">최근</option>
            <option value="paginated">페이지네이션</option>
          </SelectField>
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="guestbook_page_size">노출 개수</FieldLabel>
          <TextInput
            id="guestbook_page_size"
            name="guestbook_page_size"
            type="number"
            defaultValue={guestbook.page_size}
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <FieldLabel htmlFor="guestbook_recent_notice">최근 노출 안내</FieldLabel>
          <TextInput
            id="guestbook_recent_notice"
            name="guestbook_recent_notice"
            defaultValue={guestbook.recent_notice}
          />
        </div>
        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            name="guestbook_enable_password"
            defaultChecked={guestbook.enable_password}
          />
          비밀번호 사용
        </label>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" name="guestbook_enable_edit" defaultChecked={guestbook.enable_edit} />
          수정 허용
        </label>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" name="guestbook_enable_delete" defaultChecked={guestbook.enable_delete} />
          삭제 허용
        </label>
        <div className="flex justify-end md:col-span-2">
          <Button type="submit" size="sm">
            저장하기
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/70">
          <div className="grid grid-cols-3 gap-2 border-b border-[var(--border-light)] px-4 py-2 text-[12px] font-semibold text-[var(--text-secondary)]">
            <span>이름</span>
            <span>메시지</span>
            <span>작성일</span>
          </div>
          <div className="divide-y divide-[var(--border-light)]">
            {(() => {
              const pageSize = 6;
              const totalPages = Math.max(1, Math.ceil(guestbookEntries.length / pageSize));
              const currentPage = Math.min(guestbookPage, totalPages);
              const startIndex = (currentPage - 1) * pageSize;
              const pageItems = guestbookEntries.slice(startIndex, startIndex + pageSize);

              return pageItems.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-3 gap-2 px-4 py-3 text-[13px] text-[var(--text-primary)]"
                >
                  <span className="font-medium">{entry.name}</span>
                  <span className="line-clamp-2 text-[var(--text-secondary)]">{entry.message}</span>
                  <span className="text-[var(--text-muted)]">
                    {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[12px] text-[var(--text-muted)]">
          <span>총 {guestbookEntries.length}건</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGuestbookPage((prev) => Math.max(1, prev - 1))}
              className="rounded-[8px] border border-[var(--border-light)] px-2 py-1 text-[12px] text-[var(--text-secondary)]"
            >
              이전
            </button>
            <button
              type="button"
              onClick={() =>
                setGuestbookPage((prev) =>
                  Math.min(Math.max(1, Math.ceil(guestbookEntries.length / 6)), prev + 1)
                )
              }
              className="rounded-[8px] border border-[var(--border-light)] px-2 py-1 text-[12px] text-[var(--text-secondary)]"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
};
