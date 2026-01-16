import { AnimatedHeart } from '@/components/ui/AnimatedHeart';

type IntroCalendarProps = {
  weddingDateTime: string;
  highlightDates?: number[];
};

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const MONTH_NAMES_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;

export const IntroCalendar = ({
  weddingDateTime,
  highlightDates = [],
}: IntroCalendarProps) => {
  const weddingDate = new Date(weddingDateTime);
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const weddingDay = weddingDate.getDate();
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
      className="rounded-[20px] border border-[var(--card-border)] bg-white/70 px-6 py-7 shadow-[var(--shadow-soft)] backdrop-blur-sm"
      data-animate="fade-up"
    >
      {/* 연월 표시 */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <p className="font-label text-[14px] text-[var(--text-muted)]">
          {MONTH_NAMES_EN[month]}
        </p>
        <p className="text-[26px] font-medium tracking-wide text-[var(--text-primary)]">
          {year}년 {month + 1}월
        </p>
      </div>

      {/* 요일 헤더 */}
      <div className="mb-3 grid grid-cols-7 gap-x-1">
        {WEEKDAY_LABELS.map((label, index) => (
          <div
            key={label}
            className={`py-2 text-center text-[15px] tracking-[0.15em] font-medium
            ${
              index === 0
                ? 'text-[var(--accent-burgundy)]'
                : index === 6
                  ? 'text-[var(--accent-rose-dark)]'
                  : 'text-[var(--text-muted)]'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-x-1 gap-y-2">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const key = `day-${weekIndex}-${dayIndex}`;
            if (!day) {
              return <div key={key} className="aspect-square" />;
            }

            const isWeddingDay = day === weddingDay;
            const isSunday = dayIndex === 0;
            const isSaturday = dayIndex === 6;
            const isHoliday = highlighted.has(day);

            if (isWeddingDay) {
              return (
                <div key={key} className="flex aspect-square items-center justify-center">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--wedding-highlight)] shadow-[0_4px_16px_rgba(232,164,179,0.4)]">
                    <span className="text-[15px] font-semibold text-white">{day}</span>
                    <div className="absolute -bottom-1 -right-1">
                      <AnimatedHeart
                        size={14}
                        strokeColor="var(--accent-burgundy)"
                        fillColor="var(--accent-burgundy)"
                        strokeWidth={0}
                        animate={false}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            const textColor = isHoliday || isSunday
              ? 'text-[var(--accent-burgundy)]'
              : isSaturday
                ? 'text-[var(--accent-rose-dark)]'
                : 'text-[var(--text-secondary)]';

            return (
              <div
                key={key}
                className={`flex aspect-square items-center justify-center text-[15px] ${textColor}`}
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
