'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface DoorSceneProps {
  darkBackground: string;
  lightBackground: string;
  accentColor: string;
}

/**
 * Door Scene with GSAP ScrollTrigger
 * 스크롤 진행도에 따라 좌/우 문이 열리는 애니메이션
 */
export const DoorScene = ({
  darkBackground: _darkBackground,
  lightBackground: _lightBackground,
  accentColor: _accentColor,
}: DoorSceneProps) => {
  const MAX_DOOR_HEIGHT = 640;
  const BASE_SURFACE = 'var(--base-surface)';
  const BASE_TEXT = 'var(--base-text)';
  const HANDLE_COLOR = 'var(--door-handle)';
  const HANDLE_COLOR_RGB = 'var(--door-handle-rgb)';
  const GOLD_LINE = '#cbb899';
  const containerRef = useRef<HTMLDivElement>(null);
  const doorFrameRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const visibilityTriggerRef = useRef<ScrollTrigger | null>(null);
  const startScrollRef = useRef(0);

  useEffect(() => {
    const doorFrame = doorFrameRef.current;
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;
    const content = contentRef.current;
    const background = backgroundRef.current;

    if (!doorFrame || !leftDoor || !rightDoor || !content || !background) return;

    const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

    // 애니메이션 진행 거리 계산
    const getScrollDistance = () => {
      const viewportHeight = getViewportHeight();
      return viewportHeight * 1.5;
    };

    // 도어가 화면에 전체가 보이는 시점의 스크롤 위치 계산
    const getFullVisibilityScroll = () => {
      const rect = doorFrame.getBoundingClientRect(); // 도어 프레임의 뷰포트 내 위치
      const viewportHeight = getViewportHeight(); // 뷰포트 높이
      const scrollY = window.scrollY || window.pageYOffset;
      return Math.max(0, scrollY + rect.bottom - viewportHeight);
    };

    const hasReachedFullVisibility = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      return scrollY >= getFullVisibilityScroll();
    };

    // IntroSection 전체를 pin (인트로 콘텐츠가 사라지지 않도록)
    const introSection = document.querySelector('#intro');
    if (!introSection) return;

    const createDoorTimeline = () => {
      if (timelineRef.current) return;

      startScrollRef.current = getFullVisibilityScroll();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: doorFrame,
          start: () => startScrollRef.current,
          end: () => startScrollRef.current + getScrollDistance(),
          scrub: 1,
          pin: introSection, // IntroSection 전체를 고정 (trigger ≠ pin)
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        leftDoor,
        {
          rotateY: -90,
          transformOrigin: 'left center',
          ease: 'power2.inOut',
        },
        0
      )
        .to(
          rightDoor,
          {
            rotateY: 90,
            transformOrigin: 'right center',
            ease: 'power2.inOut',
          },
          0
        )
        .to(
          content,
          {
            opacity: 1,
            filter: 'blur(0px) brightness(1) contrast(1)',
            ease: 'power2.inOut',
          },
          0
        )
        .set(background, { backgroundColor: BASE_SURFACE }, 0);

      timelineRef.current = tl;
    };

    const ensureDoorTimeline = () => {
      if (timelineRef.current) return;
      if (!hasReachedFullVisibility()) return;
      createDoorTimeline();
      visibilityTriggerRef.current?.kill();
      visibilityTriggerRef.current = null;
      ScrollTrigger.refresh();
    };

    if (hasReachedFullVisibility()) {
      createDoorTimeline();
    } else {
      visibilityTriggerRef.current = ScrollTrigger.create({
        trigger: doorFrame,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: ensureDoorTimeline,
        onRefresh: ensureDoorTimeline,
      });
    }

    const handleResize = () => {
      if (timelineRef.current) {
        startScrollRef.current = getFullVisibilityScroll();
      }
      ensureDoorTimeline();
      ScrollTrigger.refresh();
    };

    ScrollTrigger.refresh();

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      visibilityTriggerRef.current?.kill();
      visibilityTriggerRef.current = null;
      timelineRef.current?.scrollTrigger?.kill();
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        ref={doorFrameRef}
        className="relative w-full overflow-hidden mx-auto"
        style={{ height: `min(100vh, ${MAX_DOOR_HEIGHT}px)`}}
      >
          {/* 배경 */}
          <div
            ref={backgroundRef}
            className="absolute inset-0 transition-colors"
            style={{ backgroundColor: BASE_SURFACE }}
          />

          {/* 문 뒤 콘텐츠 */}
          <div
            ref={contentRef}
            className="absolute inset-0 flex items-center justify-center opacity-0"
            style={{ filter: 'blur(10px) brightness(0.5) contrast(0.8)' }}
          >
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src="/mock/main-image.png"
                alt="Wedding Main Image"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* 좌측 문 */}
          <div
            ref={leftDoorRef}
          className="absolute top-0 left-0 h-full w-1/2"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            backgroundColor: BASE_SURFACE,
          }}
          >
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                backgroundColor: BASE_SURFACE,
                backgroundImage: `linear-gradient(115deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 45%), linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0) 30%, rgba(0,0,0,0.16)), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 2px, rgba(0,0,0,0.02) 2px 4px)`,
                boxShadow: 'inset -12px 0 20px rgba(0,0,0,0.18), inset 0 20px 30px rgba(255,255,255,0.08)',
                borderTopLeftRadius: '100% 12%',
              }}
            >
              {/* 표면 하이라이트 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(80% 120% at 10% 10%, rgba(255,255,255,0.2), rgba(255,255,255,0) 60%)',
                }}
              />
              {/* 가장자리 깊이감 */}
              <div
                className="absolute top-0 right-0 h-full w-4"
                style={{
                  background: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0))',
                }}
              />
              {/* 오른쪽 테두리 - 상단 3%부터 시작 */}
              <div
                className="absolute right-0 h-[97%] w-[2px]"
                style={{
                  top: '3%',
                  backgroundColor: GOLD_LINE,
                }}
              />
              {/* 문 장식 프레임 */}
              <div
                className="absolute inset-4 border-2 opacity-30"
                style={{
                  borderColor: BASE_TEXT,
                  borderTopLeftRadius: '100% 12%',
                }}
              />
              <div
                className="absolute inset-8 border-2 opacity-20"
                style={{
                  borderColor: BASE_TEXT,
                  borderTopLeftRadius: '100% 12%',
                }}
              />

              {/* 문손잡이 - 좌측 문은 오른쪽에 (세로형) */}
              <div className="absolute top-1/2 right-6 -translate-y-1/2">
                <div className="flex flex-col items-center gap-1">
                  {/* 상단 장식 */}
                  <div
                    className="h-4 w-3 rounded-t-full"
                    style={{
                      background: `linear-gradient(to right, rgb(${HANDLE_COLOR_RGB} / 0.7), ${HANDLE_COLOR})`,
                      boxShadow: `2px 0 4px rgba(0,0,0,0.3)`,
                    }}
                  />
                  {/* 손잡이 본체 */}
                  <div
                    className="w-2.5 rounded-sm"
                    style={{
                      height: '80px',
                      background: `linear-gradient(to right, rgb(${HANDLE_COLOR_RGB} / 0.75), ${HANDLE_COLOR}, rgb(${HANDLE_COLOR_RGB} / 0.75))`,
                      boxShadow: `2px 0 6px rgba(0,0,0,0.4), inset -1px 0 2px rgba(0,0,0,0.3)`,
                    }}
                  />
                  {/* 하단 장식 */}
                  <div
                    className="h-4 w-3 rounded-b-full"
                    style={{
                      background: `linear-gradient(to right, rgb(${HANDLE_COLOR_RGB} / 0.7), ${HANDLE_COLOR})`,
                      boxShadow: `2px 0 4px rgba(0,0,0,0.3)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 우측 문 */}
          <div
            ref={rightDoorRef}
          className="absolute top-0 right-0 h-full w-1/2"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            backgroundColor: BASE_SURFACE,
          }}
          >
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                backgroundColor: BASE_SURFACE,
                backgroundImage: `linear-gradient(245deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 45%), linear-gradient(to left, rgba(0,0,0,0.1), rgba(0,0,0,0) 30%, rgba(0,0,0,0.16)), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 2px, rgba(0,0,0,0.02) 2px 4px)`,
                boxShadow: 'inset 12px 0 20px rgba(0,0,0,0.18), inset 0 20px 30px rgba(255,255,255,0.08)',
                borderTopRightRadius: '100% 12%',
              }}
            >
              {/* 표면 하이라이트 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(80% 120% at 90% 10%, rgba(255,255,255,0.2), rgba(255,255,255,0) 60%)',
                }}
              />
              {/* 가장자리 깊이감 */}
              <div
                className="absolute top-0 left-0 h-full w-4"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0))',
                }}
              />
              {/* 왼쪽 테두리 - 상단 3%부터 시작 */}
              <div
                className="absolute left-0 h-[97%] w-[2px]"
                style={{
                  top: '3%',
                  backgroundColor: GOLD_LINE,
                }}
              />
              {/* 문 장식 프레임 */}
              <div
                className="absolute inset-4 border-2 opacity-30"
                style={{
                  borderColor: BASE_TEXT,
                  borderTopRightRadius: '100% 12%',
                }}
              />
              <div
                className="absolute inset-8 border-2 opacity-20"
                style={{
                  borderColor: BASE_TEXT,
                  borderTopRightRadius: '100% 12%',
                }}
              />

              {/* 문손잡이 - 우측 문은 왼쪽에 (세로형) */}
              <div className="absolute top-1/2 left-6 -translate-y-1/2">
                <div className="flex flex-col items-center gap-1">
                  {/* 상단 장식 */}
                  <div
                    className="h-4 w-3 rounded-t-full"
                    style={{
                      background: `linear-gradient(to left, rgb(${HANDLE_COLOR_RGB} / 0.7), ${HANDLE_COLOR})`,
                      boxShadow: `-2px 0 4px rgba(0,0,0,0.3)`,
                    }}
                  />
                  {/* 손잡이 본체 */}
                  <div
                    className="w-2.5 rounded-sm"
                    style={{
                      height: '80px',
                      background: `linear-gradient(to left, rgb(${HANDLE_COLOR_RGB} / 0.75), ${HANDLE_COLOR}, rgb(${HANDLE_COLOR_RGB} / 0.75))`,
                      boxShadow: `-2px 0 6px rgba(0,0,0,0.4), inset 1px 0 2px rgba(0,0,0,0.3)`,
                    }}
                  />
                  {/* 하단 장식 */}
                  <div
                    className="h-4 w-3 rounded-b-full"
                    style={{
                      background: `linear-gradient(to left, rgb(${HANDLE_COLOR_RGB} / 0.7), ${HANDLE_COLOR})`,
                      boxShadow: `-2px 0 4px rgba(0,0,0,0.3)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};
