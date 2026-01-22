type IntroCalendarProps = {
  weddingDateTime: string;
  highlightDates?: number[];
};

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

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
    <div className="w-full px-5" data-animate="fade-up">
      <div className="w-full">
        {/* 상단 구분선 */}
        <div className="my-6 h-[1px] w-full shrink-0 bg-black opacity-10"></div>

        {/* 달력 그리드 */}
        <div className="grid grid-cols-7 gap-y-4 text-center font-bold font-serif">
          {/* 요일 헤더 */}
          {WEEKDAY_LABELS.map((label, index) => (
            <div
              key={label}
              className={
                index === 0
                  ? 'text-[#f87171]'
                  : index === 6
                  ? 'text-blue-500'
                  : ''
              }
            >
              {label}
            </div>
          ))}

          {/* 날짜 */}
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const key = `day-${weekIndex}-${dayIndex}`;
              if (!day) {
                return <div key={key} />;
              }

              const isWeddingDay = day === weddingDay;
              const isSunday = dayIndex === 0;
              const isSaturday = dayIndex === 6;
              const isHoliday = highlighted.has(day);

              if (isWeddingDay) {
                return (
                  <div key={key} className="flex justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eb7272] font-extralight text-white">
                      {day}
                    </div>
                  </div>
                );
              }

              const textColor = (isHoliday || isSunday)
                ? 'text-[#f87171]'
                : isSaturday
                ? 'text-blue-500'
                : '';

              return (
                <div
                  key={key}
                  className={`px-1 py-1 font-extralight ${textColor}`}
                >
                  {day}
                </div>
              );
            })
          )}
        </div>

        {/* 하단 구분선 */}
        <div className="my-6 h-[1px] w-full shrink-0 bg-black opacity-10"></div>
      </div>
    </div>
  );
};
