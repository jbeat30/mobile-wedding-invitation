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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[var(--bg-primary)]" />

        {/* Hero 텍스트 */}
        <div className="absolute inset-0 flex items-end justify-center pb-16">
          <div className="text-center" data-animate="fade-up">
            <p className="font-label text-[11px] text-white/85 drop-shadow-md">
              WEDDING INVITATION
            </p>
            <h1 className="mt-4 text-[32px] font-medium tracking-wide text-white drop-shadow-lg">
              {couple.groom.displayName}
              <span className="mx-3 text-[18px] text-white/70">♥</span>
              {couple.bride.displayName}
            </h1>
            <p className="mt-3 text-[14px] font-light tracking-wider text-white/80 drop-shadow-sm">
              {info.dateText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
