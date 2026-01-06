import { invitationMock } from '@/mock/invitation.mock';
import { DDayCountdown } from '@/components/sections/DDayCountdown';
import { DoorScene } from '@/components/sections/DoorScene';
import { CherryBlossomCanvas } from '@/components/sections/CherryBlossomCanvas';

/**
 * 인트로 섹션 구성
 */
export const IntroSection = () => {
  const { weddingDateTime, intro, couple } = invitationMock;

  return (
    <section id="intro" className="relative pb-6">
      <CherryBlossomCanvas />
      {/* 초기 인트로 화면 */}
      <div className="relative pt-[calc(var(--safe-top)+32px)] pb-4">
        <div className="mx-auto flex w-full max-w-[445px] flex-col gap-8">
          <div className="relative z-30 flex flex-col gap-8">
            {/* 디데이 */}
            <DDayCountdown weddingDateTime={weddingDateTime} />
            {/* 인트로 문구 */}
            <div className="flex flex-col gap-4 text-center px-4">
              <h1 className="text-[26px] leading-[1.5] font-semibold text-[#5f5f5f]">
                {intro.quote}
              </h1>
              {intro.subQuote ? (
                <p className="text-[15px] leading-relaxed text-[#5f5f5f]">{intro.subQuote}</p>
              ) : null}
            </div>
          </div>
          <div className="relative z-10" data-testid="door-scene-wrapper">
            <DoorScene
              darkBackground={intro.theme.darkBackground}
              lightBackground={intro.theme.lightBackground}
              accentColor={intro.theme.accentColor}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
