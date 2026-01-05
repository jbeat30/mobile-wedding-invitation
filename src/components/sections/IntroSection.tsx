import { invitationMock } from "@/mock/invitation.mock";
import { DDayCountdown } from "@/components/sections/DDayCountdown";

/**
 * 인트로 섹션 구성
 */
export const IntroSection = () => {
  const { weddingDateTime, intro, couple } = invitationMock;

  return (
    <section id="intro" className="min-h-svh">
      <div className="min-h-svh px-6 pb-12 pt-[calc(var(--safe-top)+32px)]">
        <div className="mx-auto flex w-full max-w-[420px] flex-col gap-12">
          {/* 디데이 */}
          <DDayCountdown weddingDateTime={weddingDateTime} />
          {/* 인트로 문구 */}
          <div className="flex flex-col gap-4 text-center">
            <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">
              {couple.displayLine}
            </p>
            <h1 className="text-[26px] font-semibold leading-[1.5] text-[var(--text-light)]">
              {intro.quote}
            </h1>
            {intro.subQuote ? (
              <p className="text-[15px] leading-relaxed text-white/70">
                {intro.subQuote}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
