import { invitationMock } from '@/mock/invitation.mock';
import { DDayCountdown } from '@/components/sections/DDayCountdown';
import { CherryBlossomCanvas } from '@/components/sections/CherryBlossomCanvas';
import { BgmToggle } from '@/components/sections/BgmToggle';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';

/**
 * 인트로 섹션 구성 확인
 */
export const IntroSection = () => {
  const { weddingDateTime, intro, couple, info } = invitationMock;

  return (
    <section id="intro" className="relative pb-10">
      {/* 벚꽃 배경 레이어 (z-10, 희소) - 문 뒤 */}
      <CherryBlossomCanvas density={35000} zIndex={10} opacity={0.7} minPetalCount={15} />
      {/* 벚꽃 전경 레이어 (z-25, 매우 희소) - 문 앞 */}
      <CherryBlossomCanvas density={50000} zIndex={25} opacity={0.5} minPetalCount={8} />

      {/* 초기 인트로 화면 구성 확인 */}
      <div className="relative pt-[calc(var(--safe-top)+28px)] pb-10">
        <div className="mx-auto flex w-full max-w-[460px] flex-col gap-8 px-5">
          <div className="flex items-center justify-end">
            <BgmToggle />
          </div>

          <div className="text-center">
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

          <div className="rounded-[var(--radius-lg)] border border-white/60 bg-white/80 p-4 shadow-[var(--shadow-soft)] backdrop-blur">
            {/* 디데이 구성 확인 */}
            <DDayCountdown weddingDateTime={weddingDateTime} />
          </div>
        </div>
      </div>
    </section>
  );
};
