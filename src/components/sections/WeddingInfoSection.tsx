import { invitationMock } from '@/mock/invitation.mock';
import { IntroCalendar } from '@/components/sections/IntroCalendar';

/**
 * 예식 정보 섹션 - 날짜/시간/장소 상세
 */
export const WeddingInfoSection = () => {
  const { weddingDateTime, info, couple } = invitationMock;

  return (
    <section id="wedding-info" className="bg-[var(--bg-primary)] py-20">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="text-[10px] tracking-[0.4em] text-[var(--text-muted)]">WEDDING DAY</span>
          <h2 className="mt-3 text-[28px] font-semibold text-[var(--text-primary)]">
            {info.title}
          </h2>
          <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
            {couple.groom.displayName} · {couple.bride.displayName}
          </p>
        </div>

        {/* 달력 */}
        <div data-animate="scale">
          <IntroCalendar
            weddingDateTime={weddingDateTime}
            highlightDates={[16]}
            venue={info.venue}
          />
        </div>

        {/* 정보 카드 */}
        <div
          className="rounded-[var(--radius-lg)] border border-white/70 bg-white/90 px-8 py-10 shadow-[var(--shadow-soft)] backdrop-blur"
          data-animate="fade-up"
        >
          <div className="grid gap-8">
            {/* 날짜/시간 */}
            <div className="flex flex-col gap-3 text-center">
              <span className="text-[11px] tracking-[0.35em] text-[var(--text-muted)]">WHEN</span>
              <p className="text-[20px] font-semibold text-[var(--text-primary)]">
                {info.dateText}
              </p>
            </div>

            <div className="h-px w-full bg-[var(--border-light)]" />

            {/* 장소 */}
            <div className="flex flex-col gap-3 text-center">
              <span className="text-[11px] tracking-[0.35em] text-[var(--text-muted)]">WHERE</span>
              <p className="text-[20px] font-semibold text-[var(--text-primary)]">{info.venue}</p>
              <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {info.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
