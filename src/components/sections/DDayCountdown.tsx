 "use client";

import { useEffect, useMemo, useState } from "react";

type CountdownParts = {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

/**
 * 두 자리 숫자 패딩 처리
 */
const pad2 = (value: number) => value.toString().padStart(2, "0");

/**
 * 해당 연도 월의 일수 계산
 */
const daysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

/**
 * 연도 이동 시 월 말 기준으로 날짜가 넘어가지 않게 조정
 */
const addYearsClamped = (base: Date, years: number) => {
  const year = base.getFullYear() + years;
  const month = base.getMonth();
  const day = Math.min(base.getDate(), daysInMonth(year, month));
  return new Date(
    year,
    month,
    day,
    base.getHours(),
    base.getMinutes(),
    base.getSeconds(),
    base.getMilliseconds(),
  );
};

/**
 * 월 말 기준으로 날짜가 넘어가지 않게 조정
 */
const addMonthsClamped = (base: Date, months: number) => {
  const totalMonths = base.getMonth() + months;
  const year = base.getFullYear() + Math.floor(totalMonths / 12);
  const month = ((totalMonths % 12) + 12) % 12;
  const day = Math.min(base.getDate(), daysInMonth(year, month));
  return new Date(
    year,
    month,
    day,
    base.getHours(),
    base.getMinutes(),
    base.getSeconds(),
    base.getMilliseconds(),
  );
};

/**
 * 목표 시각 기준 잔여 시간 분해 계산
 */
const getCountdownParts = (target: Date, now: Date): CountdownParts => {
  if (target.getTime() <= now.getTime()) {
    return {
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
    };
  }

  let current = new Date(now.getTime());
  let years = target.getFullYear() - current.getFullYear();
  let candidateYears = addYearsClamped(current, years);
  if (candidateYears.getTime() > target.getTime()) {
    years -= 1;
    candidateYears = addYearsClamped(current, years);
  }
  current = candidateYears;

  let months = target.getMonth() - current.getMonth();
  let candidateMonths = addMonthsClamped(current, months);
  if (candidateMonths.getTime() > target.getTime()) {
    months -= 1;
    candidateMonths = addMonthsClamped(current, months);
  }
  current = candidateMonths;

  let remainingMs = target.getTime() - current.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;
  const minuteMs = 60 * 1000;

  const days = Math.floor(remainingMs / dayMs);
  remainingMs -= days * dayMs;
  const hours = Math.floor(remainingMs / hourMs);
  remainingMs -= hours * hourMs;
  const minutes = Math.floor(remainingMs / minuteMs);
  remainingMs -= minutes * minuteMs;
  const seconds = Math.floor(remainingMs / 1000);

  return {
    months,
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
  };
};

type DDayCountdownProps = {
  weddingDateTime: string | Date;
};

/**
 * 디데이 카운팅 표시
 */
export const DDayCountdown = ({ weddingDateTime }: DDayCountdownProps) => {
  const targetDate = useMemo(() => {
    return weddingDateTime instanceof Date
      ? weddingDateTime
      : new Date(weddingDateTime);
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

  const timeBlocks = [
    parts ? pad2(parts.months) : "--",
    parts ? pad2(parts.days) : "--",
    parts ? pad2(parts.hours) : "--",
    parts ? pad2(parts.minutes) : "--",
    parts ? pad2(parts.seconds) : "--",
  ];

  return (
    <div
      className="rounded-[20px] border border-white/10 bg-white/5 px-5 py-5 text-center shadow-[var(--shadow-soft)]"
      suppressHydrationWarning
    >
      <div className="text-[11px] uppercase tracking-[0.4em] text-[var(--accent)]">
        {parts?.isPast ? "오늘" : "D-Day"}
      </div>
      <div className="mt-3 text-xl font-semibold tracking-[0.12em] text-[var(--text-light)]">
        {`${timeBlocks[0]}월 ${timeBlocks[1]}일 ${timeBlocks[2]}시 ${timeBlocks[3]}분 ${timeBlocks[4]}초`}
      </div>
    </div>
  );
};
