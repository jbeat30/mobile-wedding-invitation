import { invitationMock } from '@/mock/invitation.mock';
import { DDayCountdown } from '@/components/sections/DDayCountdown';
import { IntroCalendar } from '@/components/sections/IntroCalendar';

/**
 * 인트로 섹션 구성 확인
 */
export const IntroSection = () => {
  const { weddingDateTime, intro, couple, info } = invitationMock;

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

          <IntroCalendar weddingDateTime={weddingDateTime} highlightDates={[5, 25]} />
        </div>
      </div>
    </section>
  );
};
