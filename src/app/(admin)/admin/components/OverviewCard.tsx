'use client';

import { useEffect, useState } from 'react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';

type OverviewData = {
  galleryCount: number;
  guestbookCount: number;
};

/**
 * 관리자 요약 카드
 * @returns JSX.Element
 */
export const OverviewCard = () => {
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/admin/overview', { cache: 'no-store' });
      if (!response.ok) return;
      const payload = (await response.json()) as OverviewData;
      setData(payload);
    };

    void load();
  }, []);

  return (
    <SurfaceCard className="flex flex-col gap-3 p-5">
      <p className="text-[12px] text-[var(--text-muted)]">콘텐츠 요약</p>
      <div className="flex gap-6">
        <div>
          <p className="text-[20px] font-semibold text-[var(--text-primary)]">
            {data?.galleryCount ?? '--'}
          </p>
          <p className="text-[12px] text-[var(--text-tertiary)]">갤러리 이미지</p>
        </div>
        <div>
          <p className="text-[20px] font-semibold text-[var(--text-primary)]">
            {data?.guestbookCount ?? '--'}
          </p>
          <p className="text-[12px] text-[var(--text-tertiary)]">방명록 메시지</p>
        </div>
      </div>
    </SurfaceCard>
  );
};
