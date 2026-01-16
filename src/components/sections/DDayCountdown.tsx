'use client';

import { useEffect, useMemo, useState } from 'react';

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
};

/**
 * D-Day 카운트다운 컴포넌트
 */
export const DDayCountdown = ({ weddingDateTime }: DDayCountdownProps) => {
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

  return (
    <div className="flex flex-col items-center gap-4" suppressHydrationWarning data-animate="fade-up">
      {/* D-Day 뱃지 */}
      <div className="flex flex-col items-center gap-2">
        <span className="font-serif-en text-[42px] font-light tracking-wide text-[var(--accent-burgundy)]">
          {dDayText}
        </span>
        <p className="text-[14px] text-[var(--text-tertiary)]">
          {parts?.isPast ? '오늘, 우리 결혼합니다' : '결혼식까지'}
        </p>
      </div>

      {/* 시간 카운트다운 */}
      {!parts?.isPast && parts && (
        <div className="mt-2 flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="font-serif-en text-[20px] text-[var(--text-primary)]">
              {pad2(parts.hours)}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[var(--text-muted)]">HOURS</span>
          </div>
          <span className="text-[var(--text-muted)]">:</span>
          <div className="flex flex-col items-center">
            <span className="font-serif-en text-[20px] text-[var(--text-primary)]">
              {pad2(parts.minutes)}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[var(--text-muted)]">MIN</span>
          </div>
          <span className="text-[var(--text-muted)]">:</span>
          <div className="flex flex-col items-center">
            <span className="font-serif-en text-[20px] text-[var(--text-primary)]">
              {pad2(parts.seconds)}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[var(--text-muted)]">SEC</span>
          </div>
        </div>
      )}
    </div>
  );
};
