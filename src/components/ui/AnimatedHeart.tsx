'use client';

import { useEffect, useRef, useState } from 'react';

type AnimatedHeartProps = {
  size?: number;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
  delay?: number;
};

/**
 * SVG 하트 라인 드로잉 애니메이션 컴포넌트
 */
export const AnimatedHeart = ({
  size = 24,
  strokeColor = 'var(--accent-rose)',
  fillColor = 'none',
  strokeWidth = 1.5,
  className = '',
  animate = true,
  delay = 0,
}: AnimatedHeartProps) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [isVisible, setIsVisible] = useState(!animate);

  useEffect(() => {
    if (!animate || !pathRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(pathRef.current);

    return () => observer.disconnect();
  }, [animate, delay]);

  // 하트 경로의 총 길이 (대략적 값)
  const pathLength = 60;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`animated-heart ${className}`}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        ref={pathRef}
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        className="heart-path"
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: isVisible ? 0 : pathLength,
          transition: isVisible ? 'stroke-dashoffset 1.2s ease-out, opacity 0.3s ease-out' : 'none',
          opacity: isVisible ? 1 : 0.3,
        }}
      />
    </svg>
  );
};
