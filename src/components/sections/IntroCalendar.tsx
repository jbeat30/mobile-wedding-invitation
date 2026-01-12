type IntroCalendarProps = {
  weddingDateTime: string;
  highlightDates?: number[];
  venue: string;
};

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const WEEKDAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'] as const;

export const IntroCalendar = ({
  weddingDateTime,
  highlightDates = [],
  venue,
}: IntroCalendarProps) => {
  const weddingDate = new Date(weddingDateTime);
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const weddingDay = weddingDate.getDate();
  const weekdayName = WEEKDAY_NAMES[weddingDate.getDay()];
  const hours = weddingDate.getHours();
  const minutes = weddingDate.getMinutes();
  const meridiem = hours >= 12 ? '오후' : '오전';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const timeLabel = minutes
    ? `${meridiem} ${hour12}시 ${String(minutes).padStart(2, '0')}분`
    : `${meridiem} ${hour12}시`;
  const firstWeekday = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const highlighted = new Set(highlightDates);

  const dayCells: Array<number | null> = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    dayCells.push(null);
  }
  for (let day = 1; day <= lastDate; day += 1) {
    dayCells.push(day);
  }
  while (dayCells.length % 7 !== 0) {
    dayCells.push(null);
  }

  const weeks: Array<Array<number | null>> = [];
  for (let i = 0; i < dayCells.length; i += 7) {
    weeks.push(dayCells.slice(i, i + 7));
  }

  return (
    <div
      className="rounded-[24px] border border-white/70 bg-[#fbf6f1]/90 px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur"
      data-animate="fade-up"
    >
      <p className="mt-3 text-center text-[14px] tracking-[0.2em] text-[var(--text-muted)]">
        {venue} · {weekdayName} · {month + 1}월 {weddingDay}일 · {timeLabel}
      </p>
      <div className="my-4 flex items-center justify-center">
        <p className="font-[var(--font-crimson),var(--font-nanum),var(--font-gowun),serif] text-[24px] tracking-[0.12em]">
          {year}.{String(month + 1).padStart(2, '0')}
        </p>
      </div>
      <div className="grid grid-cols-7 gap-x-2 gap-y-2.5">
        {WEEKDAY_LABELS.map((label, index) => (
          <div
            key={label}
            className={`text-center text-[10px] tracking-[0.28em] text-[var(--text-muted)]${
              index === 0 ? ' text-[#c05b5b]' : index === 6 ? ' text-[#4e75b8]' : ''
            }`}
          >
            {label}
          </div>
        ))}
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const key = `day-${weekIndex}-${dayIndex}`;
            if (!day) {
              return <div key={key} className="h-8 rounded-[10px]" />;
            }
            const isWeddingDay = day === weddingDay;
            const isSunday = dayIndex === 0;
            const isSaturday = dayIndex === 6;
            const isHoliday = highlighted.has(day);
            const textColor = isWeddingDay
              ? ' text-[#5a2831]'
              : isHoliday || isSunday
                ? ' text-[#c05b5b]'
                : isSaturday
                  ? ' text-[#4e75b8]'
                  : ' text-[var(--text-secondary)]';
            const background = isWeddingDay ? ' bg-[#f2b7c5]' : ' bg-white/70';
            const emphasis = isWeddingDay
              ? ' font-semibold shadow-[0_8px_20px_rgba(242,183,197,0.45)]'
              : '';

            return (
              <div
                key={key}
                className={`flex h-8 items-center justify-center rounded-[10px] text-[12px]${background}${textColor}${emphasis}`}
              >
                {day}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
