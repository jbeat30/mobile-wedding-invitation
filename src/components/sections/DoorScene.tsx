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
  darkBackground,
  lightBackground,
  accentColor,
}: DoorSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;
    const content = contentRef.current;
    const background = backgroundRef.current;

    if (!container || !leftDoor || !rightDoor || !content || !background) return;

    // ScrollTrigger 생성
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=200%', // 스크롤 영역 확대 (문이 열리는 동안 충분한 스크롤 거리 확보)
        scrub: 1, // 스크롤과 동기화
        pin: true, // 섹션 고정
        anticipatePin: 1,
      },
    });

    // 애니메이션 정의
    tl.to(
      leftDoor,
      {
        rotateY: -90, // 좌측 문 열기
        transformOrigin: 'left center',
        ease: 'power2.inOut',
      },
      0
    )
      .to(
        rightDoor,
        {
          rotateY: 90, // 우측 문 열기
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
      .to(
        background,
        {
          backgroundColor: lightBackground,
          ease: 'power2.inOut',
        },
        0
      );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [lightBackground]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* 배경 */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 transition-colors"
        style={{ backgroundColor: darkBackground }}
      />

      {/* 문 뒤 콘텐츠 */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex items-center justify-center opacity-0"
        style={{
          filter: 'blur(10px) brightness(0.5) contrast(0.8)',
        }}
      >
        <div className="text-center">
          <h2
            className="text-4xl font-bold"
            style={{ color: accentColor }}
          >
            Welcome
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            우리의 새로운 시작을 함께해주세요
          </p>
        </div>
      </div>

      {/* 좌측 문 */}
      <div
        ref={leftDoorRef}
        className="absolute left-0 top-0 h-full w-1/2"
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        <div
          className="relative h-full w-full"
          style={{
            background: `linear-gradient(to right, ${darkBackground}, ${darkBackground}dd)`,
            borderRight: `2px solid ${accentColor}`,
          }}
        >
          {/* 문 장식 프레임 */}
          <div className="absolute inset-4 border-2 opacity-30" style={{ borderColor: accentColor }} />
          <div className="absolute inset-8 border opacity-20" style={{ borderColor: accentColor }} />

          {/* 문손잡이 - 좌측 문은 오른쪽에 (세로형) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center gap-1">
              {/* 상단 장식 */}
              <div
                className="h-4 w-3 rounded-t-full"
                style={{
                  background: `linear-gradient(to right, ${accentColor}dd, ${accentColor})`,
                  boxShadow: `2px 0 4px rgba(0,0,0,0.3)`,
                }}
              />
              {/* 손잡이 본체 */}
              <div
                className="w-2.5 rounded-sm"
                style={{
                  height: '80px',
                  background: `linear-gradient(to right, ${accentColor}cc, ${accentColor}, ${accentColor}cc)`,
                  boxShadow: `2px 0 6px rgba(0,0,0,0.4), inset -1px 0 2px rgba(0,0,0,0.3)`,
                }}
              />
              {/* 하단 장식 */}
              <div
                className="h-4 w-3 rounded-b-full"
                style={{
                  background: `linear-gradient(to right, ${accentColor}dd, ${accentColor})`,
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
        className="absolute right-0 top-0 h-full w-1/2"
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        <div
          className="relative h-full w-full"
          style={{
            background: `linear-gradient(to left, ${darkBackground}, ${darkBackground}dd)`,
            borderLeft: `2px solid ${accentColor}`,
          }}
        >
          {/* 문 장식 프레임 */}
          <div className="absolute inset-4 border-2 opacity-30" style={{ borderColor: accentColor }} />
          <div className="absolute inset-8 border opacity-20" style={{ borderColor: accentColor }} />

          {/* 문손잡이 - 우측 문은 왼쪽에 (세로형) */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center gap-1">
              {/* 상단 장식 */}
              <div
                className="h-4 w-3 rounded-t-full"
                style={{
                  background: `linear-gradient(to left, ${accentColor}dd, ${accentColor})`,
                  boxShadow: `-2px 0 4px rgba(0,0,0,0.3)`,
                }}
              />
              {/* 손잡이 본체 */}
              <div
                className="w-2.5 rounded-sm"
                style={{
                  height: '80px',
                  background: `linear-gradient(to left, ${accentColor}cc, ${accentColor}, ${accentColor}cc)`,
                  boxShadow: `-2px 0 6px rgba(0,0,0,0.4), inset 1px 0 2px rgba(0,0,0,0.3)`,
                }}
              />
              {/* 하단 장식 */}
              <div
                className="h-4 w-3 rounded-b-full"
                style={{
                  background: `linear-gradient(to left, ${accentColor}dd, ${accentColor})`,
                  boxShadow: `-2px 0 4px rgba(0,0,0,0.3)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
