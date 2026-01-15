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

// 로딩 섹션 - 초기 viewport 크기 고정, 주소창/네비바 사라진 공간은 다음 섹션 노출
export const LoadingSection = ({ message, isVisible, isHintVisible }: LoadingSectionProps) => {
  const [showHint, setShowHint] = useState(false);
  const initialHeightRef = useRef<number>(0);
  const scrollLockStyles = useRef<{
    bodyOverflow: string;
    htmlOverflow: string;
    bodyTouchAction: string;
    htmlTouchAction: string;
    bodyHeight: string;
    htmlHeight: string;
  } | null>(null);

  // 초기 viewport 높이 저장 (한 번만)
  useEffect(() => {
    if (!initialHeightRef.current) {
      initialHeightRef.current = window.innerHeight;
    }
  }, []);

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
      className="relative flex w-full flex-col items-center justify-center touch-pan-y"
      // 터치 스크롤 우선 처리되게 해서 웹뷰 드래그 확대 막는 용도임
      style={{
        height: initialHeightRef.current ? `${initialHeightRef.current}px` : '100vh',
        minHeight: initialHeightRef.current ? `${initialHeightRef.current}px` : '100vh',
        maxHeight: initialHeightRef.current ? `${initialHeightRef.current}px` : '100vh',
        background: 'linear-gradient(135deg, #f7f2ec 0%, #efe3d7 100%)',
      }}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/mock/main-image.png"
            alt=""
            fill
            priority
            className="absolute inset-0 h-full w-full object-cover object-bottom opacity-85 saturate-[0.95] will-change-[transform,opacity] animate-[loading-reveal_1.1s_ease-out_both] pointer-events-none select-none [-webkit-user-drag:none] z-[1]"
            sizes="100vw"
            // 모바일/웹뷰 이미지 드래그 방지용임
            draggable={false}
          />
          <div className="absolute inset-0 z-[3] bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(20,14,10,0.55)_70%)]" />
          <div className="absolute inset-0 z-[4] bg-[radial-gradient(60%_40%_at_50%_30%,rgba(255,255,255,0.4),transparent_70%)] opacity-70 mix-blend-screen" />
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-[22%] z-[6] flex h-[22%] w-[90%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 600 180" width="100%" height="100%" className="block h-full w-full">
            <path
              className="fill-none stroke-white/95 stroke-[3.6] drop-shadow-[0_0_6px_rgba(255,255,255,0.35)] animate-[loading-write_2.8s_ease-out_0s_1_forwards]"
              d="M40 110 C90 60, 160 60, 210 105 C245 138, 290 140, 330 110 C370 80, 420 70, 470 92 C515 112, 545 132, 560 150"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={1000}
              strokeDashoffset={1000}
            />
          </svg>
        </div>
        {/* 로딩 텍스트 */}
        <div className="relative z-[5] max-w-[min(360px,72vw)] px-6 text-center text-white animate-[loading-fade_1s_ease-out_both]">
          <p className="text-[11px] font-bold uppercase tracking-[0.6em] opacity-90">
            WEDDING INVITATION
          </p>
          <p className="mt-3.5 text-[26px] font-semibold tracking-[0.12em]">
            {message}
          </p>
          {/*<div className="loading-divider" />*/}
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-[76%] z-[6] flex h-[22%] w-[90%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 600 180" width="100%" height="100%" className="block h-full w-full">
            <path
              className="fill-none stroke-white/95 stroke-[3.6] drop-shadow-[0_0_6px_rgba(255,255,255,0.35)] animate-[loading-write-bottom_2.2s_ease-out_0.6s_1_forwards] opacity-90"
              d="M132 24 C158 14, 188 28, 216 52 C234 72, 248 86, 266 98 C278 110, 296 114, 314 108 C332 98, 352 84, 374 68 C398 54, 422 44, 446 38 C462 32, 474 28, 484 14"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={550}
              strokeDashoffset={550}
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
