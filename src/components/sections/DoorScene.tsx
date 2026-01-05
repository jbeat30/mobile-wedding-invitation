'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const BASE_SURFACE_DARK = 'var(--base-surface-dark)';
  const BASE_TEXT = 'var(--base-text)';
  const HANDLE_COLOR = 'var(--door-handle)';
  const HANDLE_COLOR_RGB = 'var(--door-handle-rgb)';
  const GOLD_LINE = '#cbb899';
  const containerRef = useRef<HTMLDivElement>(null);
  const doorFrameRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const doorFrame = doorFrameRef.current;
    const spacer = spacerRef.current;
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;
    const content = contentRef.current;
    const background = backgroundRef.current;

    if (!container || !doorFrame || !spacer || !leftDoor || !rightDoor || !content || !background) return;

    const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;
    const getDoorHeight = () => doorFrame.getBoundingClientRect().height;
    const getScrollDistance = () => {
      const doorHeight = getDoorHeight();
      const viewportHeight = getViewportHeight();
      const baseDistance = doorHeight >= viewportHeight ? viewportHeight * 2 : doorHeight * 2.2;
      const minimumDistance = viewportHeight * 1.2;

      return Math.max(600, Math.round(baseDistance), Math.round(minimumDistance));
    };

    const syncSpacer = () => {
      spacer.style.height = `${getScrollDistance()}px`;
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh: syncSpacer,
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

    const handleResize = () => {
      syncSpacer();
      ScrollTrigger.refresh();
    };

    syncSpacer();
    ScrollTrigger.refresh();

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="sticky top-0 flex w-full items-start justify-center pt-2"
        style={{ minHeight: '100vh', height: '100svh' }}
      >
        <div
          ref={doorFrameRef}
          className="relative w-full overflow-hidden"
          style={{ height: `min(100vh, ${MAX_DOOR_HEIGHT}px)` }}
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
            <div className="text-center">
              <h2 className="text-4xl font-semibold" style={{ color: BASE_TEXT }}>
                Welcome
              </h2>
              <p className="mt-4 text-lg" style={{ color: BASE_TEXT }}>
                우리의 새로운 시작을 함께해주세요
              </p>
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
                background: `linear-gradient(to right, ${BASE_SURFACE}, ${BASE_SURFACE})`,
                borderTopLeftRadius: '100% 12%',
              }}
            >
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
                background: `linear-gradient(to left, ${BASE_SURFACE}, ${BASE_SURFACE})`,
                borderTopRightRadius: '100% 12%',
              }}
            >
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
      <div ref={spacerRef} aria-hidden />
    </div>
  );
};
