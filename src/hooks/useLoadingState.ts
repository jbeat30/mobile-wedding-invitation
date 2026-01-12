'use client';

import { useEffect, useState } from 'react';

type UseLoadingStateProps = {
  minDuration: number; // 최소 로딩 시간 (ms)
  additionalDuration: number; // 페이지 로딩 완료 후 추가 대기 시간 (ms)
};

/**
 * 로딩 상태 관리 훅
 * - 페이지 로딩 시간 측정
 * - 최소 로딩 시간 보장
 * - 로딩 완료 후 추가 대기 시간 적용
 */
export const useLoadingState = ({ minDuration, additionalDuration }: UseLoadingStateProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHintVisible, setIsHintVisible] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    let hintTimer: number | undefined;
    let loadingTimer: number | undefined;

    const handleLoad = () => {
      const loadTime = Date.now() - startTime;

      // 최소 시간 미만이면 최소 시간까지 대기
      const waitTime = Math.max(0, minDuration - loadTime);

      // 최소 시간 대기 + 추가 대기 시간
      const totalWaitTime = waitTime + additionalDuration;
      const hintLeadTime = Math.max(0, totalWaitTime - 100);

      hintTimer = window.setTimeout(() => {
        setIsHintVisible(true);
      }, hintLeadTime);

      loadingTimer = window.setTimeout(() => {
        setIsLoading(false);
      }, totalWaitTime);
    };

    // 페이지 로드 완료 감지
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      if (hintTimer) {
        window.clearTimeout(hintTimer);
      }
      if (loadingTimer) {
        window.clearTimeout(loadingTimer);
      }
    };
  }, [minDuration, additionalDuration]);

  return { isLoading, isHintVisible };
};
