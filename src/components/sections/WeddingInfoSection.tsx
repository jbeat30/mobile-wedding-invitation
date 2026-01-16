import { invitationMock } from '@/mock/invitation.mock';
import { IntroCalendar } from '@/components/sections/IntroCalendar';
import { DDayCountdown } from '@/components/sections/DDayCountdown';

/**
 * 예식 일시 섹션
 */
export const WeddingInfoSection = () => {
  const { weddingDateTime, info } = invitationMock;

  return (
    <section id="wedding-info" className="bg-[var(--bg-primary)] py-16">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="font-label text-[11px] text-[var(--text-muted)]">WEDDING DAY</span>
          <h2 className="mt-2 text-[24px] font-medium text-[var(--text-primary)]">
            {info.title}
          </h2>
        </div>

        {/* 날짜/시간 */}
        <div className="text-center" data-animate="fade-up">
          <p className="text-[18px] leading-relaxed text-[var(--text-secondary)]">
            {info.dateText}
          </p>
        </div>

        {/* 달력 */}
        <div data-animate="scale">
          <IntroCalendar
            weddingDateTime={weddingDateTime}
            highlightDates={[16]}
          />
        </div>

        {/* D-Day 카운트다운 */}
        <DDayCountdown weddingDateTime={weddingDateTime} />
      </div>
    </section>
  );
};
