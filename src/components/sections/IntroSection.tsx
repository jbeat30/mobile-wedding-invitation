import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { InvitationCouple, InvitationEvent } from '@/mock/invitation.mock';
import { HeartIcon } from '@/components/ui/HeartIcon';

type IntroSectionProps = {
  couple: InvitationCouple;
  event: InvitationEvent;
  heroImage: string;
};

// UI 임계치 및 비율 상수화
const HERO_MIN_HEIGHT = 480;
const HERO_MAX_HEIGHT = 640;
const HERO_HEIGHT_RATIO = 0.6; // 60vh

/**
 * 인트로 섹션 - Hero 영역
 */
export const IntroSection = ({ couple, event, heroImage }: IntroSectionProps) => {
  const [heroHeight, setHeroHeight] = useState<string>(`clamp(${HERO_MIN_HEIGHT}px, ${HERO_HEIGHT_RATIO * 100}vh, ${HERO_MAX_HEIGHT}px)`);

  useEffect(() => {
    // 모바일 웹뷰에서 주소창/하단바가 나타나고 사라질 때 높이가 변하는 현상을 방지하기 위해 
    // 마운트 시점에 실제 픽셀 높이를 계산하여 고정
    const updateHeight = () => {
      // 비율에 해당하는 픽셀 값을 계산하되, 범위를 유지
      const vhEquivalent = window.innerHeight * HERO_HEIGHT_RATIO;
      const calculatedHeight = Math.min(Math.max(HERO_MIN_HEIGHT, vhEquivalent), HERO_MAX_HEIGHT);
      setHeroHeight(`${calculatedHeight}px`);
    };

    updateHeight();

    // 브라우저 리사이즈 대응 (가로 너비가 변할 때만 — 기기 회전 등 대응)
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (window.innerWidth !== lastWidth) {
        updateHeight();
        lastWidth = window.innerWidth;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 날짜 포맷팅 로직
  const formattedDateTime = (() => {
    const date = new Date(event.dateTime);
    if (Number.isNaN(date.getTime())) return event.dateTime;

    const mainFormatter = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
    
    const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return `${mainFormatter.format(date)} ${timeFormatter.format(date)}`;
  })();

  return (
    <section id="intro" className="relative bg-[var(--bg-primary)]">
      {/* Hero 영역 - JS로 계산된 heroHeight 적용 */}
      <div 
        className="relative overflow-hidden transition-[height] duration-500 ease-out"
        style={{ height: heroHeight }}
      >
        <Image
          src={heroImage}
          alt="Wedding Main"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center pointer-events-none select-none"
          sizes="(max-width: 480px) 100vw, 480px"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onTouchStart={(e) => e.preventDefault()}
        />
        {/* 배경 딤드 오버레이 - 하단부 텍스트 가독성을 위해 아래쪽이 더 어둡게 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />

        {/* Hero 텍스트 */}
        <div className="absolute inset-0 flex items-end justify-center pb-16">
          <div className="text-center" data-animate="fade-up" data-animate-start="80" data-animate-trigger="section">
            <p className="font-label text-[12px] text-[var(--accent-rose-light)] drop-shadow-md font-bold">
              WEDDING INVITATION
            </p>
            <h1 className="flex mt-4 font-serif text-[32px] font-medium tracking-wide text-white drop-shadow-lg">
              {`${couple.groom.lastName}${couple.groom.firstName}`}
              <HeartIcon className="mx-3 text-[18px] text-[var(--accent-rose-light)]" />
              {`${couple.bride.lastName}${couple.bride.firstName}`}
            </h1>
            <p className="mt-3 text-[15px] font-bold tracking-wider text-white/90 drop-shadow-sm">
              {formattedDateTime}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
