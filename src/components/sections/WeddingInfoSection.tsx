import { invitationMock } from '@/mock/invitation.mock';
import { IntroCalendar } from '@/components/sections/IntroCalendar';
import { DDayCountdown } from '@/components/sections/DDayCountdown';

/**
 * 예식 정보 섹션 - 날짜/시간/장소 상세
 */
export const WeddingInfoSection = () => {
  const { weddingDateTime, info, couple } = invitationMock;

  return (
    <section id="wedding-info" className="bg-[var(--bg-primary)] py-24">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-14 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="text-[11px] tracking-[0.4em] text-[var(--text-muted)]">WEDDING DAY</span>
          <h2 className="mt-3 text-[28px] font-semibold text-[var(--text-primary)]">
            {info.title}
          </h2>
        </div>

        {/* D-Day 카운트다운 */}
        <DDayCountdown weddingDateTime={weddingDateTime} />

        {/* 정보 */}
        <div className="grid gap-10" data-animate="fade-up">
          {/* 날짜/시간 */}
          <div className="flex flex-col gap-3 text-center">
            <span className="text-[12px] tracking-[0.35em] text-[var(--text-muted)]">WHEN</span>
            <p className="text-[22px] font-semibold text-[var(--text-primary)]">
              {info.dateText}
            </p>
          </div>

          <div className="mx-auto h-px w-16 bg-[var(--accent)]" />

          {/* 장소 */}
          <div className="flex flex-col gap-3 text-center">
            <span className="text-[12px] tracking-[0.35em] text-[var(--text-muted)]">WHERE</span>
            <p className="text-[22px] font-semibold text-[var(--text-primary)]">{info.venue}</p>
            <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {info.address}
            </p>
          </div>
        </div>

        {/* 달력 */}
        <div data-animate="scale">
          <IntroCalendar
            weddingDateTime={weddingDateTime}
            highlightDates={[16]}
          />
        </div>
      </div>
    </section>
  );
};
