'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { BgmToggle } from '@/components/sections/BgmToggle';

type LoadingSectionProps = {
  message: string;
  isVisible: boolean;
  isHintVisible: boolean;
};

// 로딩 섹션 - 전체 화면 크기 유지, 로딩 완료 후 스크롤 인디케이터 표시
export const LoadingSection = ({ message, isVisible, isHintVisible }: LoadingSectionProps) => {
  const [showHint, setShowHint] = useState(false);
  const scrollLockStyles = useRef<{
    bodyOverflow: string;
    htmlOverflow: string;
    bodyTouchAction: string;
    htmlTouchAction: string;
    bodyHeight: string;
    htmlHeight: string;
  } | null>(null);

  useEffect(() => {
    if (isHintVisible || !isVisible) {
      setShowHint(true);
    }
  }, [isHintVisible, isVisible]);

  // 스크롤 제어
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isVisible) {
      // 로딩 중에는 스크롤 막기
      if (!scrollLockStyles.current) {
        scrollLockStyles.current = {
          bodyOverflow: body.style.overflow,
          htmlOverflow: html.style.overflow,
          bodyTouchAction: body.style.touchAction,
          htmlTouchAction: html.style.touchAction,
          bodyHeight: body.style.height,
          htmlHeight: html.style.height,
        };
      }

      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      body.style.touchAction = 'none';
      html.style.touchAction = 'none';
      body.style.height = '100%';
      html.style.height = '100%';
      window.scrollTo(0, 0);
    } else {
      // 로딩 완료 후 스크롤 허용
      const previous = scrollLockStyles.current;
      if (previous) {
        body.style.overflow = previous.bodyOverflow;
        html.style.overflow = previous.htmlOverflow;
        body.style.touchAction = previous.bodyTouchAction;
        html.style.touchAction = previous.htmlTouchAction;
        body.style.height = previous.bodyHeight;
        html.style.height = previous.htmlHeight;
        scrollLockStyles.current = null;
      } else {
        body.style.overflow = '';
        html.style.overflow = '';
        body.style.touchAction = '';
        html.style.touchAction = '';
        body.style.height = '';
        html.style.height = '';
      }
    }

    return () => {
      const previous = scrollLockStyles.current;
      if (previous) {
        body.style.overflow = previous.bodyOverflow;
        html.style.overflow = previous.htmlOverflow;
        body.style.touchAction = previous.bodyTouchAction;
        html.style.touchAction = previous.htmlTouchAction;
        body.style.height = previous.bodyHeight;
        html.style.height = previous.htmlHeight;
        scrollLockStyles.current = null;
      } else {
        body.style.overflow = '';
        html.style.overflow = '';
        body.style.touchAction = '';
        html.style.touchAction = '';
        body.style.height = '';
        html.style.height = '';
      }
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
        {/* 로딩 텍스트 */}
        <div className="loading-copy">
          <p className="loading-eyebrow">WEDDING INVITATION</p>
          <p className="loading-title font-display">{message}</p>
          {/*<div className="loading-divider" />*/}
        </div>

        <div className="loading-handwrite loading-handwrite--bottom" aria-hidden="true">
          <svg viewBox="0 0 600 180" width="100%" height="100%">
            <path
              className="loading-handwrite-path--bottom"
              d="M132 24 C158 14, 188 28, 216 52 C234 72, 248 86, 266 98 C278 110, 296 114, 314 108 C332 98, 352 84, 374 68 C398 54, 422 44, 446 38 C462 32, 474 28, 484 14"
            />
          </svg>
        </div>

        {/* BGM 토글 */}
        <div
          className={`absolute right-8 top-8 z-[70] transition duration-500 ease-out ${
            showHint
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-2.5 opacity-0 pointer-events-none'
          }`}
        >
          <BgmToggle />
        </div>

        {/* 스크롤 인디케이터 */}
        <div
          className={`absolute bottom-12 left-0 right-0 z-[70] flex justify-center transition duration-500 ease-out ${
            showHint
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-2.5 opacity-0 pointer-events-none'
          }`}
        >
          <div className="[&_p]:!text-white [&_p]:!opacity-100 [&_div>div]:!bg-white [&_div>div]:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            <ScrollIndicator />
          </div>
        </div>
      </div>
    </section>
  );
};
