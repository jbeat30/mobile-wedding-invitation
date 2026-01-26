'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';

export type LoadingSectionProps = {
  message: string;
  imageSrc: string;
  isVisible: boolean;
  isHintVisible: boolean;
  title: string;
};

/**
 * 로딩 텍스트 순차 애니메이션 실행
 * @param container 텍스트 컨테이너
 * @returns cleanup 함수
 */
const animateLoadingText = (
  container: HTMLDivElement | null
): (() => void) | undefined => {
  if (!container) return undefined;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = container.querySelectorAll<HTMLElement>('[data-loading-text]');
  if (!items.length) return undefined;

  if (prefersReducedMotion) {
    gsap.set(items, { opacity: 1, y: 0 });
    return undefined;
  }

  gsap.set(items, { opacity: 0, y: 14 });
  const tween = gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 1.4,
    ease: 'power2.out',
    stagger: 0.42,
    delay: 0.4,
  });

  return () => {
    tween.kill();
  };
};

// 로딩 섹션 - 초기 viewport 크기 고정, 주소창/네비바 사라진 공간은 다음 섹션 노출
export const LoadingSection = ({
  message,
  imageSrc,
  isVisible,
  isHintVisible,
  title,
}: LoadingSectionProps) => {
  const [showHint, setShowHint] = useState(false);
  const initialHeightRef = useRef<number>(0);
  const loadingTextRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);
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
    setShowHint(!isVisible && isHintVisible);
  }, [isHintVisible, isVisible]);

  useEffect(() => {
    if (!isVisible || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;
    const cleanup = animateLoadingText(loadingTextRef.current);
    return () => {
      cleanup?.();
    };
  }, [isVisible]);

  // 스크롤 제어
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const preventScroll = (event: Event) => {
      event.preventDefault();
    };

    const preventKeyScroll = (event: KeyboardEvent) => {
      const blockedKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
      }
    };

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

      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', preventKeyScroll);
    } else {
      // 로딩 완료 후 스크롤 허용
      body.style.overflow = '';
      html.style.overflow = '';
      body.style.touchAction = '';
      html.style.touchAction = '';
      body.style.height = '';
      html.style.height = '';

      // 저장된 값 초기화
      scrollLockStyles.current = null;

      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeyScroll);
    }

    return () => {
      // cleanup: 컴포넌트 unmount 시 스크롤 복원
      body.style.overflow = '';
      html.style.overflow = '';
      body.style.touchAction = '';
      html.style.touchAction = '';
      body.style.height = '';
      html.style.height = '';

      scrollLockStyles.current = null;

      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeyScroll);
    };
  }, [isVisible]);

  return (
    <section
      data-testid="loading-section"
      className="relative flex w-full touch-pan-y flex-col items-center justify-center"
      // 터치 스크롤 우선 처리되게 해서 웹뷰 드래그 확대 막는 용도임
      style={{
        height: initialHeightRef.current ? `${initialHeightRef.current}px` : '100vh',
        minHeight: initialHeightRef.current ? `${initialHeightRef.current}px` : '100vh',
        maxHeight: initialHeightRef.current ? `${initialHeightRef.current}px` : '100vh',
      }}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full animate-[loading-reveal_1.1s_ease-out_both] object-cover object-bottom opacity-85 saturate-[0.95] will-change-[transform,opacity] select-none [-webkit-user-drag:none]"
            sizes="(max-width: 480px) 100vw, 480px"
            priority
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
          />
          <div className="absolute inset-0 z-[3] bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(12,8,6,0.7)_70%)]" />
        </div>

        <div
          className="pointer-events-none absolute top-[26%] left-1/2 z-[6] flex h-[22%] w-[90%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 600 180" width="100%" height="100%" className="block h-full w-full">
            <path
              className="animate-[loading-write_3.4s_ease-out_0.2s_1_forwards] fill-none stroke-white/95 stroke-[3.6] drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]"
              d="M40 110 C90 60, 160 60, 210 105 C245 138, 290 140, 330 110 C370 80, 420 70, 470 92 C515 112, 545 132, 560 150"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={1000}
              strokeDashoffset={1000}
            />
          </svg>
        </div>
        {/* 로딩 텍스트 */}
        <div
          ref={loadingTextRef}
          className="relative z-[5] max-w-[min(360px,85vw)] px-6 text-center text-white"
        >
          <p
            data-loading-text
            className="translate-y-3 text-[11px] font-bold tracking-[0.6em] text-[var(--accent-soft)] uppercase opacity-0 will-change-[transform,opacity]"
          >
            {title}
          </p>
          <p
            data-loading-text
            className="mt-3.5 translate-y-3 text-[26px] leading-[36px] font-semibold tracking-[0.12em] opacity-0 will-change-[transform,opacity]"
          >
            {message}
          </p>
          {/*<div className="loading-divider" />*/}
        </div>

        <div
          className="pointer-events-none absolute top-[76%] left-1/2 z-[6] flex h-[22%] w-[90%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 600 180" width="100%" height="100%" className="block h-full w-full">
            <path
              className="animate-[loading-write-bottom_2.8s_ease-out_0.8s_1_forwards] fill-none stroke-white/95 stroke-[3.6] opacity-90 drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]"
              d="M132 24 C158 14, 188 28, 216 52 C234 72, 248 86, 266 98 C278 110, 296 114, 314 108 C332 98, 352 84, 374 68 C398 54, 422 44, 446 38 C462 32, 474 28, 484 14"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={550}
              strokeDashoffset={550}
            />
          </svg>
        </div>

        {/* 스크롤 인디케이터 */}
        <div
          className={`absolute right-0 bottom-12 left-0 z-[70] flex justify-center transition duration-500 ease-out ${
            showHint
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-2.5 opacity-0'
          }`}
        >
          <div className="[&_div>div]:!bg-white [&_div>div]:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] [&_p]:!text-white [&_p]:!opacity-100">
            <ScrollIndicator />
          </div>
        </div>
      </div>
    </section>
  );
};
