import { invitationMock } from '@/mock/invitation.mock';
import { DDayCountdown } from '@/components/sections/DDayCountdown';

/**
 * 인트로 섹션 구성 확인
 */
export const IntroSection = () => {
  const { weddingDateTime, intro, couple, info } = invitationMock;
  const weddingDate = new Date(weddingDateTime);
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const weddingDay = weddingDate.getDate();
  const isMay = month === 4;
  const mayHolidayDates = new Set([5, 25]);
  const firstWeekday = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
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
  const weeks = [];
  for (let i = 0; i < dayCells.length; i += 7) {
    weeks.push(dayCells.slice(i, i + 7));
  }

  return (
    <section id="intro" className="relative min-h-svh">
      {/* 초기 인트로 화면 구성 확인 */}
      <div className="relative min-h-svh pt-[calc(var(--safe-top)+28px)] pb-12">
        <div className="mx-auto flex min-h-[calc(100svh-88px)] w-full max-w-[460px] flex-col justify-center gap-8 px-5">
          <div className="text-center" data-animate="fade-up">
            <p className="text-[11px] tracking-[0.5em] text-[var(--text-muted)]">
              WEDDING INVITATION
            </p>
            <h1 className="font-display mt-4 text-[32px] font-semibold tracking-tight text-[var(--text-primary)]">
              {couple.groom.fullName}
              <span className="mx-2 text-[18px] text-[var(--accent)]">·</span>
              {couple.bride.fullName}
            </h1>
            <p className="mt-3 text-[13px] text-[var(--text-secondary)]">{info.dateText}</p>
            <p className="mt-1 text-[12px] text-[var(--text-muted)]">{info.venue}</p>
            <div className="mt-5 flex flex-col gap-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              <p>{intro.quote}</p>
              {intro.subQuote ? <p className="text-[13px]">{intro.subQuote}</p> : null}
            </div>
          </div>

          <div
            className="rounded-[var(--radius-lg)] border border-white/60 bg-white/80 p-4 shadow-[var(--shadow-soft)] backdrop-blur"
            data-animate="scale"
          >
            {/* 디데이 구성 확인 */}
            <DDayCountdown weddingDateTime={weddingDateTime} />
          </div>

          <div className="intro-calendar" data-animate="fade-up">
            <div className="intro-calendar-header">
              <p className="intro-calendar-eyebrow">Wedding Date</p>
              <p className="intro-calendar-title">
                {year}.{String(month + 1).padStart(2, '0')}
              </p>
            </div>
            <div className="intro-calendar-grid">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((label, index) => (
                <div
                  key={label}
                  className={`intro-calendar-weekday${
                    index === 0 ? ' is-sunday' : index === 6 ? ' is-saturday' : ''
                  }`}
                >
                  {label}
                </div>
              ))}
              {weeks.map((week, weekIndex) =>
                week.map((day, dayIndex) => {
                  const key = `day-${weekIndex}-${dayIndex}`;
                  if (!day) {
                    return <div key={key} className="intro-calendar-day empty" />;
                  }
                  const isWeddingDay = day === weddingDay;
                  const isSunday = dayIndex === 0;
                  const isSaturday = dayIndex === 6;
                  const isHoliday = isMay && mayHolidayDates.has(day);
                  return (
                    <div
                      key={key}
                      className={`intro-calendar-day${isWeddingDay ? ' is-wedding' : ''}${
                        isSunday ? ' is-sunday' : ''
                      }${isSaturday ? ' is-saturday' : ''}${isHoliday ? ' is-holiday' : ''}`}
                    >
                      {day}
                    </div>
                  );
                })
              )}
            </div>
            <p className="intro-calendar-caption">SATURDAY · {month + 1}월 {weddingDay}일</p>
          </div>
        </div>
      </div>
    </section>
  );
};
