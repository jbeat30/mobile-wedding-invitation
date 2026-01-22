'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { InvitationMock } from '@/mock/invitation.mock';
import { LoadingSection } from '@/components/sections/LoadingSection';
import { CherryBlossomCanvas } from '@/components/sections/CherryBlossomCanvas';
import { BgmPlayer } from '@/components/sections/BgmPlayer';
import { BgmToggle } from '@/components/sections/BgmToggle';
import { IntroSection } from '@/components/sections/IntroSection';
import { GreetingSection } from '@/components/sections/GreetingSection';
import { CoupleSection } from '@/components/sections/CoupleSection';
import { WeddingInfoSection } from '@/components/sections/WeddingInfoSection';
import { LocationSection } from '@/components/sections/LocationSection';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useBgmPreference } from '@/hooks/useBgmPreference';

// 무거운 섹션들을 동적 임포트로 분할 (Swiper 포함)
const GallerySection = dynamic(
  () => import('@/components/sections/GallerySection').then((mod) => ({ default: mod.GallerySection })),
  { ssr: true }
);

const AccountsSection = dynamic(
  () => import('@/components/sections/AccountsSection').then((mod) => ({ default: mod.AccountsSection })),
  { ssr: true }
);

const GuestbookSection = dynamic(
  () => import('@/components/sections/GuestbookSection').then((mod) => ({ default: mod.GuestbookSection })),
  { ssr: true }
);

const RSVPSection = dynamic(
  () => import('@/components/sections/RSVPSection').then((mod) => ({ default: mod.RSVPSection })),
  { ssr: true }
);

const ShareSection = dynamic(
  () => import('@/components/sections/ShareSection').then((mod) => ({ default: mod.ShareSection })),
  { ssr: true }
);

const ClosingSection = dynamic(
  () => import('@/components/sections/ClosingSection').then((mod) => ({ default: mod.ClosingSection })),
  { ssr: true }
);

type PublicPageClientProps = {
  invitation: InvitationMock;
};

/**
 * 애니메이션 옵션 숫자 파싱
 * @param value 데이터셋 값
 * @param fallback 기본값
 * @returns 파싱된 숫자
 */
const parseAnimationNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * 스태거 애니메이션 옵션 생성
 * @param element 대상 요소
 * @returns 스태거 옵션
 */
const getStaggerOptions = (element: HTMLElement) => ({
  y: parseAnimationNumber(element.dataset.animateY, 18),
  duration: parseAnimationNumber(element.dataset.animateDuration, 1.1),
  stagger: parseAnimationNumber(element.dataset.animateStagger, 0.16),
  delay: parseAnimationNumber(element.dataset.animateDelay, 0),
});

/**
 * 스크롤 트리거 시작 위치 계산
 * @param element 대상 요소
 * @param fallbackPercent 기본 시작 퍼센트
 * @returns ScrollTrigger start 문자열
 */
const getTriggerStart = (element: HTMLElement, fallbackPercent: number) => {
  const raw = element.dataset.animateStart?.trim();
  if (!raw) return `top ${fallbackPercent}%`;
  if (raw.includes(' ')) return raw;
  const parsed = Number.parseFloat(raw);
  if (Number.isFinite(parsed)) return `top ${parsed}%`;
  return raw;
};

/**
 * 스크롤 트리거 기준 요소 선택
 * @param element 애니메이션 대상 요소
 * @returns 트리거 기준 요소
 */
const resolveTriggerElement = (element: HTMLElement) => {
  const triggerType = element.dataset.animateTrigger?.trim();
  if (!triggerType || triggerType === 'self') return element;
  if (triggerType === 'section') return element.closest('section') ?? element;
  return element.closest(triggerType) ?? element;
};

/**
 * 입력 가능한 요소인지 여부 확인
 * @param target 이벤트 타겟
 * @returns 입력 가능 여부
 */
const isEditableElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
};

/**
 * 보안 관련 기본 차단 핸들러 생성
 * @returns attach/detach 함수
 */
const createSecurityGuards = () => {
  let longPressTimer: number | null = null;

  const preventDefault = (event: Event) => {
    event.preventDefault();
  };

  const preventImageDrag = (event: DragEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.tagName === 'IMG') {
      event.preventDefault();
    }
  };

  const preventSelection = (event: Event) => {
    if (isEditableElement(event.target)) return;
    event.preventDefault();
  };

  const preventClipboard = (event: ClipboardEvent) => {
    if (isEditableElement(event.target)) return;
    event.preventDefault();
  };

  const preventKeyShortcuts = (event: KeyboardEvent) => {
    if (isEditableElement(event.target)) return;

    const key = event.key.toLowerCase();
    const isCommand = event.metaKey || event.ctrlKey;
    const isDeveloperShortcut =
      event.key === 'F12' ||
      (isCommand && ['s', 'u', 'c', 'x', 'v', 'p', 'a', 'i', 'j'].includes(key)) ||
      (event.metaKey && event.altKey && ['i', 'j', 'c'].includes(key)) ||
      (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key));

    if (isDeveloperShortcut) {
      event.preventDefault();
    }
  };

  /**
   * 모바일 롱프레스 다운로드 차단 (iOS/Android)
   */
  const preventLongPress = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (target?.tagName === 'IMG' || target?.closest('img')) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.tagName === 'IMG' || target?.closest('img')) {
      longPressTimer = window.setTimeout(() => {
        event.preventDefault();
        event.stopPropagation();
      }, 100);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  const attach = () => {
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('dragstart', preventImageDrag);
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('copy', preventClipboard);
    document.addEventListener('cut', preventClipboard);
    document.addEventListener('paste', preventClipboard);
    document.addEventListener('keydown', preventKeyShortcuts);

    // 모바일 롱프레스 차단
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    document.addEventListener('gesturestart', preventLongPress, { passive: false });
  };

  const detach = () => {
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    document.removeEventListener('contextmenu', preventDefault);
    document.removeEventListener('dragstart', preventImageDrag);
    document.removeEventListener('selectstart', preventSelection);
    document.removeEventListener('copy', preventClipboard);
    document.removeEventListener('cut', preventClipboard);
    document.removeEventListener('paste', preventClipboard);
    document.removeEventListener('keydown', preventKeyShortcuts);

    // 모바일 롱프레스 차단 해제
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchcancel', handleTouchEnd);
    document.removeEventListener('gesturestart', preventLongPress);
  };

  return { attach, detach };
};

/**
 * 퍼블릭 싱글 페이지
 * @param props PublicPageClientProps
 * @returns JSX.Element
 */
export const PublicPageClient = ({ invitation }: PublicPageClientProps) => {
  const { content, assets, storage } = invitation;
  const { loading, sectionTitles } = content;
  const { isLoading, isHintVisible } = useLoadingState({
    minDuration: loading.minDuration,
    additionalDuration: loading.additionalDuration,
  });
  const showLoading = loading.enabled;
  const showContent = !loading.enabled || !isLoading;
  const contentRef = useRef<HTMLElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [loadingSectionHeight, setLoadingSectionHeight] = useState(0);
  const bgmAvailable = Boolean(content.bgm.enabled);
  const { enabled: bgmEnabled, setEnabled: setBgmEnabled } = useBgmPreference(
    content.bgm.autoPlay
  );
  const isBgmActive = bgmAvailable && bgmEnabled;
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);

  useEffect(() => {
    const isLocalhost =
      window.location.hostname === 'localhost' && window.location.port === '3000';
    if (isLocalhost) return;

    const guards = createSecurityGuards();
    guards.attach();

    return () => {
      guards.detach();
    };
  }, []);

  useEffect(() => {
    if (!showLoading || !loadingRef.current) return;
    const element = loadingRef.current;

    const updateHeight = () => {
      const nextHeight = Math.round(element.getBoundingClientRect().height);
      if (nextHeight > 0) {
        setLoadingSectionHeight(nextHeight);
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [showLoading]);

  useEffect(() => {
    // GSAP 로드 후 ScrollTrigger 설정
    const setupScrollTrigger = async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      // 모바일/웹뷰 리사이즈 리프레시 과다 방지용 설정임
      ScrollTrigger.config({
        ignoreMobileResize: true, // 작은 리사이즈 무시
        limitCallbacks: true,
      });

      // 모바일 주소창/네비게이션 바로 인한 viewport 변경 필터링
      let lastWidth = window.innerWidth;
      let lastHeight = window.innerHeight;
      let resizeTimer: number;
      let lastRefreshAt = 0;

      const scheduleRefresh = () => {
        const now = Date.now();
        if (now - lastRefreshAt < 400) return;
        lastRefreshAt = now;
        ScrollTrigger.refresh();
      };

      const handleSmartResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          const currentWidth = window.innerWidth;
          const currentHeight = window.innerHeight;

          // 너비 변경 = 실제 리사이즈 (가로↔세로, 창 크기 변경)
          const widthChanged = Math.abs(currentWidth - lastWidth) > 50;
          const heightChanged = Math.abs(currentHeight - lastHeight) > 50;

          if (widthChanged) {
            // 실제 리사이즈만 ScrollTrigger refresh
            scheduleRefresh();
            lastWidth = currentWidth;
            lastHeight = currentHeight;
          } else if (heightChanged) {
            // 높이만 변경 = 주소창/네비 바 변경 (지연 후 refresh)
            scheduleRefresh();
            lastHeight = currentHeight;
          }
        }, 150);
      };

      window.addEventListener('resize', handleSmartResize);
      window.visualViewport?.addEventListener('resize', handleSmartResize);
      window.addEventListener('orientationchange', handleSmartResize);

      const handleLoad = () => {
        scheduleRefresh();
      };

      window.addEventListener('load', handleLoad);
      document.fonts?.ready.then(() => {
        scheduleRefresh();
      });

      return () => {
        window.removeEventListener('resize', handleSmartResize);
        window.visualViewport?.removeEventListener('resize', handleSmartResize);
        window.removeEventListener('orientationchange', handleSmartResize);
        window.removeEventListener('load', handleLoad);
        clearTimeout(resizeTimer);
      };
    };

    let cleanupFn: (() => void) | undefined;

    setupScrollTrigger().then((cleanup) => {
      cleanupFn = cleanup;
    });

    return () => {
      cleanupFn?.();
    };
  }, []);

  useEffect(() => {
    if (!showContent) return;
    const container = contentRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let observer: MutationObserver | null = null;
    let cleanup: (() => void) | null = null;

    // GSAP를 동적으로 로드하여 초기 번들 크기 감소
    const loadGsapAndInitialize = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      gsap.registerPlugin(ScrollTrigger);

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
              const options = getStaggerOptions(element);
              const start = getTriggerStart(element, 80);
              const trigger = resolveTriggerElement(element);

              gsap.set(items, { opacity: 0, y: options.y });
              gsap.to(items, {
                opacity: 1,
                y: 0,
                duration: options.duration,
                ease: 'power3.out',
                stagger: options.stagger,
                delay: options.delay,
                scrollTrigger: {
                  // 그룹의 컨테이너 기준으로 스크롤 진입 감지
                  trigger,
                  start,
                  toggleActions: 'play none none none',
                  invalidateOnRefresh: true,
                },
              });
              return;
            }

            // 기본 애니메이션 초기 상태 정의
            const initial =
              type === 'scale'
                ? { opacity: 0, y: 14, scale: 0.985 }
                : type === 'fade'
                  ? { opacity: 0 }
                  : { opacity: 0, y: 18 };
            const start = getTriggerStart(element, 80);
            const trigger = resolveTriggerElement(element);

            gsap.set(element, initial);
            gsap.to(element, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                // 요소 상단이 뷰포트 진입 시점에 트리거
                trigger,
                start,
                toggleActions: 'play none none none',
                invalidateOnRefresh: true,
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
    };

    loadGsapAndInitialize();

    return () => {
      observer?.disconnect();
      cleanup?.();
    };
  }, [showContent]);

  return (
    <div className="public-page bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <main
        ref={contentRef}
        className="relative overflow-x-hidden bg-[var(--bg-primary)] shadow-[0_40px_120px_rgba(44,34,28,0.12)] min-[481px]:mx-auto min-[481px]:max-w-[480px] min-[481px]:rounded-[28px] min-[481px]:border min-[481px]:border-white/65 min-[481px]:shadow-[0_50px_120px_rgba(41,32,26,0.22)]"
      >
        <CherryBlossomCanvas
          density={35000}
          zIndex={40}
          opacity={0.7}
          minPetalCount={15}
          spawnOffset={loadingSectionHeight}
        />
        <CherryBlossomCanvas
          density={50000}
          zIndex={50}
          opacity={0.5}
          minPetalCount={8}
          spawnOffset={loadingSectionHeight}
        />
        <div className="pointer-events-none fixed top-[calc(env(safe-area-inset-top)+12px)] right-[12px] z-[90] min-[481px]:absolute min-[481px]:right-[12px]">
          <div className="pointer-events-auto">
            <BgmToggle
              enabled={isBgmActive}
              playing={isBgmPlaying}
              disabled={!bgmAvailable}
              onToggle={() => setBgmEnabled((prev) => !prev)}
            />
          </div>
        </div>
        <div className="relative">
          {showLoading && (
            <div ref={loadingRef}>
              <LoadingSection
                message={loading.message}
                imageSrc={assets.loadingImage}
                isVisible={isLoading}
                isHintVisible={isHintVisible}
              />
            </div>
          )}
          {showContent ? (
            <div>
              <GreetingSection
                greeting={content.greeting}
                couple={content.couple}
                title={sectionTitles.greeting}
              />
              <IntroSection
                couple={content.couple}
                event={content.event}
                heroImage={assets.heroImage}
              />
            </div>
          ) : null}
        </div>
        {showContent ? (
          <div>
            <CoupleSection couple={content.couple} title={sectionTitles.couple} />
            <WeddingInfoSection
              event={content.event}
              couple={content.couple}
              title={sectionTitles.wedding}
            />
            <LocationSection
              location={content.location}
              event={content.event}
              title={sectionTitles.location}
            />
            <GallerySection gallery={content.gallery} />
            <AccountsSection accounts={content.accounts} />
            <GuestbookSection
              guestbook={content.guestbook}
              storageKey={storage.guestbook.key}
              title={sectionTitles.guestbook}
            />
            <RSVPSection
              rsvp={content.rsvp}
              storageKey={storage.rsvp.key}
              title={sectionTitles.rsvp}
            />
            <ShareSection share={content.share} title={sectionTitles.share} />
            <ClosingSection closing={content.closing} couple={content.couple} />
          </div>
        ) : null}
        <BgmPlayer
          audioUrl={content.bgm.audioUrl || ''}
          enabled={isBgmActive}
          loop={content.bgm.loop}
          onPlaybackChange={setIsBgmPlaying}
        />
      </main>
    </div>
  );
};
