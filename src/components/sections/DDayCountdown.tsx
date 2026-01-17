'use client';

import { useEffect, useMemo, useState } from 'react';
import type { InvitationCouple } from '@/mock/invitation.mock';

type CountdownParts = {
  totalDays: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

const pad2 = (value: number) => value.toString().padStart(2, '0');

const getCountdownParts = (target: Date, now: Date): CountdownParts => {
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { totalDays: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;
  const minuteMs = 60 * 1000;

  const totalDays = Math.floor(diff / dayMs);
  const hours = Math.floor((diff % dayMs) / hourMs);
  const minutes = Math.floor((diff % hourMs) / minuteMs);
  const seconds = Math.floor((diff % minuteMs) / 1000);

  return { totalDays, hours, minutes, seconds, isPast: false };
};

type DDayCountdownProps = {
  weddingDateTime: string | Date;
  couple: InvitationCouple;
};

/**
 * D-Day 카운트다운 컴포넌트
 */
export const DDayCountdown = ({ weddingDateTime, couple }: DDayCountdownProps) => {
  const targetDate = useMemo(() => {
    return weddingDateTime instanceof Date ? weddingDateTime : new Date(weddingDateTime);
  }, [weddingDateTime]);

  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const tick = () => {
      setParts(getCountdownParts(targetDate, new Date()));
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [targetDate]);

  const dDayText = parts?.isPast || parts?.totalDays === 0 ? 'D-Day' : `D-${parts?.totalDays ?? '--'}`;
  const daysRemaining = parts?.totalDays ?? 0;

  return (
    <div className="flex flex-col items-center gap-4" suppressHydrationWarning data-animate="fade-up">
      {/* D-Day 뱃지 */}
      <div className="flex flex-col items-center gap-2">
        <span className="font-serif-en text-[42px] font-light tracking-wide text-[#f87171]">
          {dDayText}
        </span>
        <p className="text-[14px] text-[var(--text-tertiary)]">
          {parts?.isPast ? '오늘, 우리 결혼합니다' : '결혼식까지'}
        </p>
      </div>

      {/* 시간 카운트다운 */}
      {!parts?.isPast && parts && (
        <div className="mt-2 flex items-center gap-3">
          <div className="flex gap-2 items-center">
            <span className="font-serif-en text-[20px] text-[var(--text-primary)]">
              {pad2(parts.hours)}
            </span>
            <span className="font-label text-[12px] text-[var(--text-muted)]">시간</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-serif-en text-[20px] text-[var(--text-primary)]">
              {pad2(parts.minutes)}
            </span>
            <span className="font-label text-[12px] text-[var(--text-muted)]">분</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-serif-en text-[20px] text-[var(--text-primary)]">
              {pad2(parts.seconds)}
            </span>
            <span className="font-label text-[12px] text-[var(--text-muted)]">초</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center text-[0.875em] leading-snug">
        <span>{couple.groom.fullName}</span>
        <span className="mx-1">
          <svg
            width="12"
            height="11"
            viewBox="0 0 12 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.88721 5.6442L5.23558 9.85513C5.50241 10.1135 5.92616 10.1135 6.19299 9.85513L10.5414 5.6442C11.1084 5.09504 11.4286 4.33939 11.4286 3.54999C11.4286 1.93996 10.1234 0.634766 8.51334 0.634766H8.37789C7.58576 0.634766 6.82469 0.942878 6.25565 1.49393L5.74766 1.98587C5.72906 2.00388 5.69951 2.00388 5.68091 1.98587L5.17292 1.49393C4.60388 0.942878 3.84281 0.634766 3.05068 0.634766H2.91523C1.30519 0.634766 0 1.93996 0 3.54999C0 4.33939 0.320132 5.09504 0.88721 5.6442Z"
              fill="#f87171"
            ></path>
          </svg>
        </span>
        <span>{couple.bride.fullName}</span>
        {parts?.isPast ? (
          <span className="ml-1">오늘 결혼해요</span>
        ) : (
          <>
            <span className="ml-1">결혼식까지</span>
            <span className="mx-1 text-[#f87171]">{daysRemaining}일</span>
            <span>남았습니다</span>
          </>
        )}
      </div>
    </div>
  );
};
