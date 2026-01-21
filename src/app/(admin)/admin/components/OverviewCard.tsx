'use client';

import { Card } from '@/components/ui/card';

type OverviewData = {
  galleryCount: number;
  guestbookCount: number;
};

/**
 * 관리자 요약 카드
 * @returns JSX.Element
 */
export const OverviewCard = ({ data }: { data: OverviewData }) => {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <p className="text-[14px] text-[var(--text-muted)]">콘텐츠 요약</p>
      <div className="flex gap-6">
        <div>
          <p className="text-[20px] font-semibold text-[var(--text-primary)]">
            {data.galleryCount}
          </p>
          <p className="text-[14px] text-[var(--text-tertiary)]">갤러리 이미지</p>
        </div>
        <div>
          <p className="text-[20px] font-semibold text-[var(--text-primary)]">
            {data.guestbookCount}
          </p>
          <p className="text-[14px] text-[var(--text-tertiary)]">방명록 메시지</p>
        </div>
      </div>
    </Card>
  );
};
