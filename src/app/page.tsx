'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingSection } from '@/components/sections/LoadingSection';
import { CherryBlossomCanvas } from '@/components/sections/CherryBlossomCanvas';
import { useLoadingState } from '@/hooks/useLoadingState';
import { invitationMock } from '@/mock/invitation.mock';

gsap.registerPlugin(ScrollTrigger);

const IntroSection = dynamic(
  () => import('@/components/sections/IntroSection').then((mod) => mod.IntroSection),
  { ssr: false }
);
const CoupleSection = dynamic(
  () => import('@/components/sections/CoupleSection').then((mod) => mod.CoupleSection),
  { ssr: false }
);
const GallerySection = dynamic(
  () => import('@/components/sections/GallerySection').then((mod) => mod.GallerySection),
  { ssr: false }
);
const InfoSection = dynamic(
  () => import('@/components/sections/InfoSection').then((mod) => mod.InfoSection),
  { ssr: false }
);
const RSVPSection = dynamic(
  () => import('@/components/sections/RSVPSection').then((mod) => mod.RSVPSection),
  { ssr: false }
);
const GuestbookSection = dynamic(
  () => import('@/components/sections/GuestbookSection').then((mod) => mod.GuestbookSection),
  { ssr: false }
);
const ShareSection = dynamic(
  () => import('@/components/sections/ShareSection').then((mod) => mod.ShareSection),
  { ssr: false }
);
const AccountsSection = dynamic(
  () => import('@/components/sections/AccountsSection').then((mod) => mod.AccountsSection),
  { ssr: false }
);

/**
 * 퍼블릭 싱글 페이지 레이아웃 스켈레톤 확인
 */
export default function Page() {
  const { loading } = invitationMock;
  const { isLoading, isHintVisible } = useLoadingState({
    minDuration: loading.minDuration,
    additionalDuration: loading.additionalDuration,
  });
  const showLoading = loading.enabled;
  const showContent = !loading.enabled || !isLoading;
  const contentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 모바일/웹뷰 리사이즈 리프레시 과다 방지용 설정임
    ScrollTrigger.config({
      ignoreMobileResize: true,
      limitCallbacks: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load', // resize 이벤트 제외
    });

    // 모바일 주소창/네비게이션 바로 인한 viewport 변경 완전 차단
    let resizeTimer: number;
    const preventViewportResize = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // 실제 화면 회전 등 필요한 경우만 허용
        const isOrientationChange = Math.abs(window.innerWidth - window.innerHeight) > 100;
        if (isOrientationChange) {
          ScrollTrigger.refresh();
        }
      }, 300);
    };

    window.addEventListener('resize', preventViewportResize, { capture: true, passive: false });
    window.visualViewport?.addEventListener('resize', preventViewportResize, {
      capture: true,
      passive: false,
    });

    return () => {
      window.removeEventListener('resize', preventViewportResize, true);
      window.visualViewport?.removeEventListener('resize', preventViewportResize, true);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    if (!loading.enabled || !isLoading) {
      return;
    }

    void Promise.all([
      import('@/components/sections/IntroSection'),
      import('@/components/sections/CoupleSection'),
      import('@/components/sections/GallerySection'),
      import('@/components/sections/InfoSection'),
      import('@/components/sections/RSVPSection'),
      import('@/components/sections/GuestbookSection'),
      import('@/components/sections/ShareSection'),
      import('@/components/sections/AccountsSection'),
    ]);
  }, [loading.enabled, isLoading]);

  useEffect(() => {
    if (!showContent) return;
    const container = contentRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let observer: MutationObserver | null = null;
    let cleanup: (() => void) | null = null;

    const initScrollAnimations = () => {
      // data-animate 속성이 붙은 요소만 GSAP 대상에 포함
      // 요소가 아직 렌더되지 않았으면 false를 반환해 대기
      const elements = gsap.utils.toArray<HTMLElement>(container.querySelectorAll('[data-animate]'));
      if (!elements.length) return false;

      const ctx = gsap.context(() => {
        // 모션 감소 설정일 때는 애니메이션 없이 바로 표시
        if (prefersReducedMotion) {
          gsap.set(elements, { opacity: 1, clearProps: 'transform' });
          return;
        }

        elements.forEach((element) => {
          // data-animate 값으로 타입을 지정: fade-up(기본), fade, scale, stagger
          const type = element.dataset.animate ?? 'fade-up';

          if (type === 'stagger') {
            // 그룹 내부 아이템은 data-animate-item으로 관리
            const items = gsap.utils
              .toArray<HTMLElement>(element.querySelectorAll('[data-animate-item]'))
              .slice(0);
            if (!items.length) return;

            gsap.set(items, { opacity: 0, y: 24 });
            gsap.to(items, {
              opacity: 1,
              y: 0,
              duration: 1.05,
              ease: 'power3.out',
              stagger: 0.12,
              scrollTrigger: {
                // 그룹의 컨테이너 기준으로 스크롤 진입 감지
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            });
            return;
          }

          // 기본 애니메이션 초기 상태 정의
          const initial =
            type === 'scale'
              ? { opacity: 0, y: 18, scale: 0.98 }
              : type === 'fade'
                ? { opacity: 0 }
                : { opacity: 0, y: 24 };

          gsap.set(element, initial);
          gsap.to(element, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              // 요소 상단이 뷰포트 진입 시점에 트리거
              trigger: element,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          });
        });

        // 모든 트리거 계산을 한 번 갱신
        ScrollTrigger.refresh();
      }, container);

      // cleanup으로 애니메이션/트리거를 정리
      cleanup = () => {
        ctx.revert();
      };
      return true;
    };

    const initialized = initScrollAnimations();

    if (!initialized) {
      // 동적 섹션이 마운트된 뒤에 GSAP을 초기화
      observer = new MutationObserver(() => {
        const nextInitialized = initScrollAnimations();
        if (nextInitialized) {
          observer?.disconnect();
          observer = null;
        }
      });

      observer.observe(container, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      cleanup?.();
    };
  }, [showContent]);

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--base-text)]">
      <main
        ref={contentRef}
        className="relative overflow-hidden bg-[var(--base-surface)] shadow-[0_40px_120px_rgba(44,34,28,0.12)] min-[481px]:mx-auto min-[481px]:max-w-[480px] min-[481px]:rounded-[28px] min-[481px]:border min-[481px]:border-white/65 min-[481px]:shadow-[0_50px_120px_rgba(41,32,26,0.22)]"
      >
        <div className="relative">
          <CherryBlossomCanvas density={35000} zIndex={40} opacity={0.7} minPetalCount={15} />
          <CherryBlossomCanvas density={50000} zIndex={50} opacity={0.5} minPetalCount={8} />
          {showLoading && (
            <LoadingSection
              message={loading.message}
              isVisible={isLoading}
              isHintVisible={isHintVisible}
            />
          )}
          {showContent && <IntroSection />}
        </div>
        {showContent && (
          <>
            <CoupleSection />
            <GallerySection />
            <InfoSection />
            <RSVPSection />
            <GuestbookSection />
            <ShareSection />
            <AccountsSection />
          </>
        )}
      </main>
    </div>
  );
}
