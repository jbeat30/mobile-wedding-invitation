import { invitationMock } from '@/mock/invitation.mock';
import { DDayCountdown } from '@/components/sections/DDayCountdown';
import { DoorScene } from '@/components/sections/DoorScene';
import { CherryBlossomCanvas } from '@/components/sections/CherryBlossomCanvas';
import { BgmToggle } from '@/components/sections/BgmToggle';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';

/**
 * 인트로 섹션 구성 확인
 */
export const IntroSection = () => {
  const { weddingDateTime, intro } = invitationMock;

  return (
    <section id="intro" className="relative pb-6">
      {/* 벚꽃 배경 레이어 (z-10, 희소) - 문 뒤 */}
      <CherryBlossomCanvas density={35000} zIndex={10} opacity={0.7} minPetalCount={15} />
      {/* 벚꽃 전경 레이어 (z-25, 매우 희소) - 문 앞 */}
      <CherryBlossomCanvas density={50000} zIndex={25} opacity={0.5} minPetalCount={8} />
      {/* 초기 인트로 화면 구성 확인 */}
      <div className="relative pt-[calc(var(--safe-top)+24px)] pb-8">
        <div className="absolute right-4 top-[calc(var(--safe-top)+16px)] z-40">
          <BgmToggle />
        </div>
        <div className="mx-auto flex w-full max-w-[445px] flex-col gap-6">
          <div className="relative z-20 flex flex-col gap-6">
            {/* 디데이 구성 확인 */}
            <DDayCountdown weddingDateTime={weddingDateTime} />
            {/* 인트로 문구 구성 확인 - 개선된 디자인 */}
            <div className="flex flex-col gap-3 text-center px-4">
              <div className="inline-flex items-center justify-center">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--accent)]" />
                <span className="mx-3 text-[10px] tracking-[0.4em] text-[var(--accent)]">INVITATION</span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--accent)]" />
              </div>
              {/*<h1 className="font-gowun text-[28px] leading-[1.4] font-semibold text-[var(--text-primary)] tracking-tight">*/}
              {/*  {intro.quote}*/}
              {/*</h1>*/}
              {/*{intro.subQuote ? (*/}
              {/*  <p className="font-nanum text-[14px] leading-relaxed text-[var(--text-secondary)] mt-1">*/}
              {/*    {intro.subQuote}*/}
              {/*  </p>*/}
              {/*) : null}*/}
            </div>
          </div>
          {/* 문 위치 - 위로 올림 */}
          <div className="relative z-15 border-0 outline-none mt-2" data-testid="door-scene-wrapper" style={{ zIndex: 15 }}>
            <DoorScene
              darkBackground={intro.theme.darkBackground}
              lightBackground={intro.theme.lightBackground}
              accentColor={intro.theme.accentColor}
            />
          </div>
          {/* 스크롤 인디케이터 */}
          <div className="relative z-30 flex justify-center pb-4">
            <ScrollIndicator />
          </div>
        </div>
      </div>
    </section>
  );
};
