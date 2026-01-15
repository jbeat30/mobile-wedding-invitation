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
      <div className="relative h-[65vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <Image
          src="/mock/main-image.png"
          alt="Wedding Main"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[var(--bg-primary)]" />

        {/* Hero 텍스트 */}
        <div className="absolute inset-0 flex items-end justify-center pb-20">
          <div className="text-center" data-animate="fade-up">
            <p className="text-[12px] tracking-[0.5em] text-white/90 drop-shadow-lg">
              WEDDING INVITATION
            </p>
            <h1 className="mt-3 text-[38px] font-bold tracking-tight text-white drop-shadow-xl">
              {couple.groom.displayName}
              <span className="mx-2 text-[22px] text-white/80">·</span>
              {couple.bride.displayName}
            </h1>
            <p className="mt-4 text-[15px] text-white/85 drop-shadow-md">
              {info.dateText.split(' ').slice(0, 3).join(' ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
