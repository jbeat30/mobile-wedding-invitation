import Image from 'next/image';
import { invitationMock } from '@/mock/invitation.mock';

/**
 * 인트로 섹션 - Hero 영역
 */
export const IntroSection = () => {
  const { couple, info } = invitationMock;

  return (
    <section id="intro" className="relative bg-[var(--bg-primary)]">
      {/* Hero 영역 */}
      <div className="relative h-[60vh] min-h-[480px] max-h-[640px] overflow-hidden">
        <Image
          src="/mock/main-image.png"
          alt="Wedding Main"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* 배경 딤드 오버레이 - 하단부 텍스트 가독성을 위해 아래쪽이 더 어둡게 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />

        {/* Hero 텍스트 */}
        <div className="absolute inset-0 flex items-end justify-center pb-16">
          <div className="text-center" data-animate="fade-up">
            <p className="font-label text-[11px] text-[var(--accent-rose-light)] drop-shadow-md font-bold">
              WEDDING INVITATION
            </p>
            <h1 className="mt-4 font-serif text-[32px] font-medium tracking-wide text-white drop-shadow-lg">
              {couple.groom.displayName}
              <span className="mx-3 text-[18px] text-[var(--accent-rose-light)]">♥</span>
              {couple.bride.displayName}
            </h1>
            <p className="mt-3 text-[14px] font-bold tracking-wider text-white/90 drop-shadow-sm">
              {info.dateText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
