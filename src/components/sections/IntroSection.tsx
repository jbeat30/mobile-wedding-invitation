import { invitationMock } from '@/mock/invitation.mock';
import { DDayCountdown } from '@/components/sections/DDayCountdown';
import { DoorScene } from '@/components/sections/DoorScene';

/**
 * 인트로 섹션 구성
 */
export const IntroSection = () => {
  const { weddingDateTime, intro, couple } = invitationMock;

  return (
    <>
      {/* 초기 인트로 화면 */}
      <section id="intro">
        <div className="px-6 pt-[calc(var(--safe-top)+32px)] pb-8">
          <div className="mx-auto flex w-full max-w-[420px] flex-col gap-8">
            {/* 디데이 */}
            <DDayCountdown weddingDateTime={weddingDateTime} />
            {/* 인트로 문구 */}
            <div className="flex flex-col gap-4 text-center">
              <p className="text-[11px] tracking-[0.5em] text-white/60 uppercase">
                {couple.displayLine}
              </p>
              <h1 className="text-[26px] leading-[1.5] font-semibold text-[var(--text-light)]">
                {intro.quote}
              </h1>
              {intro.subQuote ? (
                <p className="text-[15px] leading-relaxed text-white/70">{intro.subQuote}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Door Scene */}
      <DoorScene
        darkBackground={intro.theme.darkBackground}
        lightBackground={intro.theme.lightBackground}
        accentColor={intro.theme.accentColor}
      />
    </>
  );
};
