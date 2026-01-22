'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
import { GallerySection } from '@/components/sections/GallerySection';
import { AccountsSection } from '@/components/sections/AccountsSection';
import { GuestbookSection } from '@/components/sections/GuestbookSection';
import { RSVPSection } from '@/components/sections/RSVPSection';
import { ShareSection } from '@/components/sections/ShareSection';
import { ClosingSection } from '@/components/sections/ClosingSection';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useBgmPreference } from '@/hooks/useBgmPreference';

gsap.registerPlugin(ScrollTrigger);

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

  const attach = () => {
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('dragstart', preventImageDrag);
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('copy', preventClipboard);
    document.addEventListener('cut', preventClipboard);
    document.addEventListener('paste', preventClipboard);
    document.addEventListener('keydown', preventKeyShortcuts);
  };

  const detach = () => {
    document.removeEventListener('contextmenu', preventDefault);
    document.removeEventListener('dragstart', preventImageDrag);
    document.removeEventListener('selectstart', preventSelection);
    document.removeEventListener('copy', preventClipboard);
    document.removeEventListener('cut', preventClipboard);
    document.removeEventListener('paste', preventClipboard);
    document.removeEventListener('keydown', preventKeyShortcuts);
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
  const bgmAvailable = Boolean(content.bgm.enabled);
  const { enabled: bgmEnabled, setEnabled: setBgmEnabled } = useBgmPreference(
    content.bgm.autoPlay
  );
  const isBgmActive = bgmAvailable && bgmEnabled;

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
  }, []);

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
            const options = getStaggerOptions(element);
            const start = getTriggerStart(element, 95);

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
                trigger: element,
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
          const start = getTriggerStart(element, 95);

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

    return () => {
      observer?.disconnect();
      cleanup?.();
    };
  }, [showContent]);

  return (
    <div className="public-page bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="pointer-events-none fixed top-[calc(env(safe-area-inset-top)+12px)] right-0 z-[90] -translate-x-1/2">
        <div className="pointer-events-auto">
          <BgmToggle
            enabled={isBgmActive}
            disabled={!bgmAvailable}
            onToggle={() => setBgmEnabled((prev) => !prev)}
          />
        </div>
      </div>
      <main
        ref={contentRef}
        className="relative overflow-x-hidden bg-[var(--bg-primary)] shadow-[0_40px_120px_rgba(44,34,28,0.12)] min-[481px]:mx-auto min-[481px]:max-w-[480px] min-[481px]:rounded-[28px] min-[481px]:border min-[481px]:border-white/65 min-[481px]:shadow-[0_50px_120px_rgba(41,32,26,0.22)]"
      >
        <div className="relative">
          <CherryBlossomCanvas density={35000} zIndex={40} opacity={0.7} minPetalCount={15} />
          <CherryBlossomCanvas density={50000} zIndex={50} opacity={0.5} minPetalCount={8} />
          {showLoading && (
            <LoadingSection
              message={loading.message}
              imageSrc={assets.loadingImage}
              isVisible={isLoading}
              isHintVisible={isHintVisible}
            />
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
        />
      </main>
    </div>
  );
};
