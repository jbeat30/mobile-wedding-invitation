'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateRsvpAction } from '@/app/(admin)/admin/actions/rsvp';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';

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
  return (
    <div className="flex flex-col gap-6">
      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">RSVP 설정</h2>
        <form action={updateRsvpAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="rsvp_section_title">RSVP 섹션 타이틀</FieldLabel>
            <TextInput
              id="rsvp_section_title"
              name="rsvp_section_title"
              defaultValue={sectionTitles.rsvp}
            />
          </div>
          <label className="flex items-center gap-2 text-[14px] md:col-span-2">
            <input type="checkbox" name="rsvp_enabled" defaultChecked={rsvp.enabled} />
            RSVP 사용
          </label>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="rsvp_deadline">마감 일시</FieldLabel>
            <TextInput
              id="rsvp_deadline"
              name="rsvp_deadline"
              placeholder="예: 2024-12-25 14:00"
              defaultValue={rsvp.deadline || ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="rsvp_consent_title">개인정보 동의 제목</FieldLabel>
            <TextInput
              id="rsvp_consent_title"
              name="rsvp_consent_title"
              defaultValue={rsvp.consent_title || ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="rsvp_consent_retention">보관 기간</FieldLabel>
            <TextInput
              id="rsvp_consent_retention"
              name="rsvp_consent_retention"
              defaultValue={rsvp.consent_retention || ''}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="rsvp_consent_description">동의 설명</FieldLabel>
            <TextArea
              id="rsvp_consent_description"
              name="rsvp_consent_description"
              defaultValue={rsvp.consent_description || ''}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="rsvp_consent_notice">안내 문구</FieldLabel>
            <TextArea
              id="rsvp_consent_notice"
              name="rsvp_consent_notice"
              defaultValue={rsvp.consent_notice || ''}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" size="sm">
              저장하기
            </Button>
          </div>
        </form>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">RSVP 응답 목록</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/70">
            <div className="grid grid-cols-5 gap-2 border-b border-[var(--border-light)] px-4 py-2 text-[12px] font-semibold text-[var(--text-secondary)]">
              <span>이름</span>
              <span>참석</span>
              <span>인원</span>
              <span>식사</span>
              <span>작성일</span>
            </div>
            <div className="divide-y divide-[var(--border-light)]">
              {(() => {
                const pageSize = 8;
                const totalPages = Math.max(1, Math.ceil(rsvpResponses.length / pageSize));
                const currentPage = Math.min(rsvpPage, totalPages);
                const startIndex = (currentPage - 1) * pageSize;
                const pageItems = rsvpResponses.slice(startIndex, startIndex + pageSize);

                return pageItems.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-5 gap-2 px-4 py-3 text-[13px] text-[var(--text-primary)]"
                  >
                    <span className="font-medium">{entry.name}</span>
                    <span>{entry.attendance}</span>
                    <span>{entry.companions || '-'}</span>
                    <span>{entry.meal || '-'}</span>
                    <span className="text-[var(--text-muted)]">
                      {new Date(entry.submittedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
          <div className="flex items-center justify-between text-[12px] text-[var(--text-muted)]">
            <span>총 {rsvpResponses.length}건</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRsvpPage((prev) => Math.max(1, prev - 1))}
                className="rounded-[8px] border border-[var(--border-light)] px-2 py-1 text-[12px] text-[var(--text-secondary)]"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() =>
                  setRsvpPage((prev) =>
                    Math.min(Math.max(1, Math.ceil(rsvpResponses.length / 8)), prev + 1)
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
    </div>
  );
};
