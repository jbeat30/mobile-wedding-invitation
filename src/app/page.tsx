'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingSection } from '@/components/sections/LoadingSection';
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
  const { isLoading } = useLoadingState({
    minDuration: loading.minDuration,
    additionalDuration: loading.additionalDuration,
  });
  const showLoading = loading.enabled;
  const showContent = !loading.enabled || !isLoading;
  const contentRef = useRef<HTMLDivElement>(null);

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
      const elements = gsap.utils.toArray<HTMLElement>(container.querySelectorAll('[data-animate]'));
      if (!elements.length) return false;

      const ctx = gsap.context(() => {
        if (prefersReducedMotion) {
          gsap.set(elements, { opacity: 1, clearProps: 'transform' });
          return;
        }

        elements.forEach((element) => {
          const type = element.dataset.animate ?? 'fade-up';

          if (type === 'stagger') {
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
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            });
            return;
          }

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
              trigger: element,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          });
        });

        ScrollTrigger.refresh();
      }, container);

      cleanup = () => {
        ctx.revert();
      };
      return true;
    };

    const initialized = initScrollAnimations();

    if (!initialized) {
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
    <div className="min-h-svh bg-[var(--bg-primary)] text-[var(--base-text)]">
      <main ref={contentRef} className="mobile-container min-h-svh">
        {showLoading && <LoadingSection message={loading.message} isVisible={isLoading} />}
        {showContent && (
          <>
            <IntroSection />
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
