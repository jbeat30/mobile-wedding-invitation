import Image from 'next/image';
import { invitationMock } from '@/mock/invitation.mock';
import { IntroCalendar } from '@/components/sections/IntroCalendar';

/**
 * 인트로 섹션 - 레퍼런스 기반 재디자인
 */
export const IntroSection = () => {
  const { weddingDateTime, intro, couple, info } = invitationMock;

  return (
    <section id="intro" className="relative bg-[var(--bg-primary)]">
      {/* Hero 영역 */}
      <div className="relative h-[60vh] min-h-[480px] max-h-[680px] overflow-hidden">
        <Image
          src="/mock/main-image.png"
          alt="Wedding Main"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[var(--bg-primary)]" />

        {/* Hero 텍스트 */}
        <div className="absolute inset-0 flex items-end justify-center pb-16">
          <div className="text-center" data-animate="fade-up">
            <p className="text-[11px] tracking-[0.5em] text-white/90 drop-shadow-lg">
              WEDDING INVITATION
            </p>
            <h1 className="mt-3 text-[36px] font-bold tracking-tight text-white drop-shadow-xl">
              {couple.groom.displayName}
              <span className="mx-2 text-[20px] text-white/80">·</span>
              {couple.bride.displayName}
            </h1>
          </div>
        </div>
      </div>

      {/* 인사말 영역 */}
      <div className="relative -mt-8 pt-12 pb-16">
        <div className="mx-auto flex w-full max-w-[460px] flex-col gap-8 px-6">
          <div className="text-center" data-animate="fade-up">
            <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
              <p className="text-[16px] font-medium text-[var(--text-primary)]">{intro.quote}</p>
              {intro.subQuote && (
                <p className="text-[14px] text-[var(--text-tertiary)]">{intro.subQuote}</p>
              )}
            </div>
          </div>

          {/* 달력 */}
          <div data-animate="scale">
            <IntroCalendar
              weddingDateTime={weddingDateTime}
              highlightDates={[16]}
              venue={info.venue}
            />
          </div>

          {/* 날짜 정보 카드 */}
          <div
            className="rounded-[var(--radius-lg)] border border-white/70 bg-white/90 p-6 text-center shadow-[var(--shadow-soft)] backdrop-blur"
            data-animate="fade-up"
          >
            <p className="text-[13px] tracking-[0.3em] text-[var(--text-muted)]">
              {info.dateText}
            </p>
            <p className="mt-2 text-[15px] text-[var(--text-secondary)]">{info.venue}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
