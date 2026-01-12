'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { BgmToggle } from '@/components/sections/BgmToggle';

type LoadingSectionProps = {
  message: string;
  isVisible: boolean;
};

// 로딩 섹션 - 전체 화면 크기 유지, 로딩 완료 후 스크롤 인디케이터 표시
export const LoadingSection = ({ message, isVisible }: LoadingSectionProps) => {
  const [showScrollHint, setShowScrollHint] = useState(false);

  // 로딩 완료 시 스크롤 인디케이터 표시
  useEffect(() => {
    if (!isVisible) {
      const timer = window.setTimeout(() => {
        setShowScrollHint(true);
      }, 300);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [isVisible]);

  // 스크롤 제어
  useEffect(() => {
    if (isVisible) {
      // 로딩 중에는 스크롤 막기
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      // 로딩 완료 후 스크롤 허용
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return (
    <section
      data-testid="loading-section"
      className="relative h-svh w-full flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #f7f2ec 0%, #efe3d7 100%)',
      }}
    >
      <div className="loading-splash">
        <div className="loading-bg">
          <Image
            src="/mock/main-image.png"
            alt=""
            fill
            priority
            className="loading-bg-image loading-bg-image--back"
            sizes="100vw"
          />
          <div className="loading-overlay" />
          <div className="loading-overlay-soft" />
        </div>

        <div className="loading-handwrite loading-handwrite--top" aria-hidden="true">
          <svg viewBox="0 0 600 180" width="100%" height="100%">
            <path
              className="loading-handwrite-path"
              d="M40 110 C90 60, 160 60, 210 105 C245 138, 290 140, 330 110 C370 80, 420 70, 470 92 C515 112, 545 132, 560 150"
            />
          </svg>
        </div>

        <div className="loading-copy">
          <p className="loading-eyebrow">WEDDING INVITATION</p>
          <p className="loading-title font-display">{message}</p>
          <div className="loading-divider" />
        </div>

        <div className="loading-handwrite loading-handwrite--bottom" aria-hidden="true">
          <svg viewBox="0 0 600 180" width="100%" height="100%">
            <path
              className="loading-handwrite-path--bottom"
              d="M60 30 C120 60, 180 80, 240 95 C280 105, 320 105, 360 95 C420 80, 480 60, 540 30"
            />
          </svg>
        </div>

        {/* BGM 토글 */}
        {showScrollHint && (
          <div className="absolute top-8 right-8 z-10">
            <BgmToggle />
          </div>
        )}

        {/* 스크롤 인디케이터 */}
        {showScrollHint && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center z-10">
            <div className="[&_p]:!text-white [&_p]:!opacity-100 [&_div>div]:!bg-white [&_div>div]:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              <ScrollIndicator />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
