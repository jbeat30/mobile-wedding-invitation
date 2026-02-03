'use client';

import { useMemo, useState, useEffect, type KeyboardEvent } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { StandardInput } from '@/components/admin/StandardComponents';
import { CalendarIcon, ClockIcon } from 'lucide-react';

type DateTimePickerProps = {
  id: string;
  name: string;
  label: string;
  /** ISO 8601 형식 (예: 2026-05-16T06:00:00+00:00) */
  defaultValue?: string;
  required?: boolean;
};

/**
 * 날짜/시간 선택기 컴포넌트
 * ISO 8601 형식으로 데이터를 저장하고, 관리자 페이지에서는 "YYYY-MM-DD 오후 H시" 형식으로 표시
 * @param props DateTimePickerProps
 * @returns JSX.Element
 */
export const DateTimePicker = ({
  id,
  name,
  label,
  defaultValue = '',
  required = false,
}: DateTimePickerProps) => {
  const now = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isoValue, setIsoValue] = useState<string>(defaultValue);
  const [hour, setHour] = useState(() => String(((now.getHours() + 11) % 12) + 1).padStart(2, '0'));
  const [minute, setMinute] = useState(() => String(now.getMinutes()).padStart(2, '0'));
  const [period, setPeriod] = useState<'AM' | 'PM'>(() => (now.getHours() >= 12 ? 'PM' : 'AM'));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      try {
        const parsed = parseISO(defaultValue);
        if (Number.isNaN(parsed.getTime())) return;
        setSelectedDate(parsed);
        const hours = parsed.getHours();
        const nextPeriod = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 === 0 ? 12 : hours % 12;
        setHour(String(hour12).padStart(2, '0'));
        setMinute(String(parsed.getMinutes()).padStart(2, '0'));
        setPeriod(nextPeriod);
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, [defaultValue]);

  /**
   * 날짜/시간을 ISO로 동기화
   * @param baseDate Date
   * @param nextHour string
   * @param nextMinute string
   * @param nextPeriod 'AM' | 'PM'
   */
  const syncIsoValue = (
    baseDate: Date | undefined,
    nextHour: string,
    nextMinute: string,
    nextPeriod: 'AM' | 'PM'
  ) => {
    if (!baseDate) {
      setIsoValue('');
      return;
    }
    const hourNumber = Number(nextHour);
    const minuteNumber = Number(nextMinute);
    const hour24 =
      nextPeriod === 'PM'
        ? hourNumber % 12 === 0
          ? 12
          : hourNumber + 12
        : hourNumber % 12 === 12
          ? 0
          : hourNumber;
    const nextDate = new Date(baseDate);
    nextDate.setHours(hour24, minuteNumber, 0, 0);
    setIsoValue(nextDate.toISOString());
  };

  /**
   * 날짜 변경 핸들러
   * @param date Date | undefined
   */
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    syncIsoValue(date, hour, minute, period);
  };

  /**
   * 시간 변경 핸들러
   * @param nextHour string
   * @param nextMinute string
   * @param nextPeriod 'AM' | 'PM'
   */
  const handleTimeChange = (
    nextHour: string,
    nextMinute: string,
    nextPeriod: 'AM' | 'PM'
  ) => {
    setHour(nextHour);
    setMinute(nextMinute);
    setPeriod(nextPeriod);
    syncIsoValue(selectedDate, nextHour, nextMinute, nextPeriod);
  };

  const selectedDateTime = useMemo(() => {
    if (!selectedDate) return undefined;
    const hourNumber = Number(hour);
    const minuteNumber = Number(minute);
    const hour24 =
      period === 'PM'
        ? hourNumber % 12 === 0
          ? 12
          : hourNumber + 12
        : hourNumber % 12 === 12
          ? 0
          : hourNumber;
    const nextDate = new Date(selectedDate);
    nextDate.setHours(hour24, minuteNumber, 0, 0);
    return nextDate;
  }, [selectedDate, hour, minute, period]);

  const hourOptions = useMemo(
    () => Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')),
    []
  );
  const minuteOptions = useMemo(
    () => Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0')),
    []
  );
  const selectClassName =
    'h-9 w-full rounded-md border border-[var(--border-light)] bg-white/70 px-2 text-[14px] font-sans text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)] focus:ring-offset-2';

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <StandardInput
              id={id}
              label={label}
              value={
                selectedDateTime
                  ? format(selectedDateTime, 'yyyy-MM-dd a hh:mm', { locale: ko })
                  : ''
              }
              placeholder="날짜와 시간을 선택하세요"
              required={required}
              readOnly
              icon={<CalendarIcon className="h-4 w-4" />}
              onClick={() => setOpen(true)}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setOpen(true);
                }
              }}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <CalendarIcon className="h-4 w-4 text-[var(--text-muted)]" />
              마감 날짜 선택
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate ?? now}
              onSelect={handleDateChange}
            />
            <div className="mt-4 rounded-[12px] border border-[var(--border-light)] bg-[var(--bg-secondary)]/70 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <ClockIcon className="h-4 w-4 text-[var(--text-muted)]" />
                마감 시간 선택
              </div>
              <div className="grid grid-cols-3 gap-2">
                <select
                  className={selectClassName}
                  value={period}
                  onChange={(event) =>
                    handleTimeChange(hour, minute, event.target.value as 'AM' | 'PM')
                  }
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
                <select
                  className={selectClassName}
                  value={hour}
                  onChange={(event) => handleTimeChange(event.target.value, minute, period)}
                >
                  {hourOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}시
                    </option>
                  ))}
                </select>
                <select
                  className={selectClassName}
                  value={minute}
                  onChange={(event) => handleTimeChange(hour, event.target.value, period)}
                >
                  {minuteOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}분
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 rounded-md border border-[var(--border-light)] bg-white/80 px-3 py-2 text-xs text-[var(--text-muted)]">
              선택됨:{' '}
              {selectedDateTime
                ? format(selectedDateTime, 'yyyy-MM-dd a hh:mm', { locale: ko })
                : '없음'}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <input type="hidden" name={name} value={isoValue} data-admin-track="true" />
    </div>
  );
};
