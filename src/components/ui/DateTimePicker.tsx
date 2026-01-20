'use client';

import { useState, useEffect } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { parseISO } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { FieldLabel } from '@/components/ui/FieldLabel';

registerLocale('ko', ko);

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isoValue, setIsoValue] = useState<string>(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      try {
        const parsed = parseISO(defaultValue);
        if (!Number.isNaN(parsed.getTime())) {
          setSelectedDate(parsed);
        }
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, [defaultValue]);

  /**
   * 날짜 변경 핸들러
   * @param date Date | null
   */
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      // ISO 8601 형식으로 변환 (타임존 포함)
      setIsoValue(date.toISOString());
    } else {
      setIsoValue('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <ReactDatePicker
          id={id}
          selected={selectedDate}
          onChange={handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat="yyyy-MM-dd aa h시 mm분"
          locale="ko"
          required={required}
          placeholderText="날짜와 시간을 선택하세요"
          className="w-full rounded-[10px] border border-[var(--border-light)] bg-white/70 px-3 py-2 text-[13px] text-[var(--text-primary)] focus:border-[var(--accent-rose)] focus:outline-none"
        />
      </div>
      <input type="hidden" name={name} value={isoValue} />
    </div>
  );
};
