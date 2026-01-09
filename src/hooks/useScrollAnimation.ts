'use client';

import { useEffect, useRef, useState } from 'react';

type UseScrollAnimationOptions = {
  threshold?: number; // Intersection threshold (기본: 0.2)
  rootMargin?: string; // Root margin (기본: '0px')
};

/**
 * 스크롤 진입 애니메이션 훅
 * Intersection Observer를 사용하여 요소가 화면에 보일 때 애니메이션 트리거
 */
export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.2, rootMargin = '0px' } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 한 번 보이면 observer 해제 (재진입 애니메이션 방지)
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};
