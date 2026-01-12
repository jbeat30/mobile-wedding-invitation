'use client';

import { useEffect, useState } from 'react';

type UseLoadingStateProps = {
  minDuration: number; // ms
  maxDuration: number; // ms
};

/**
 * 로딩 상태 관리 훅
 * - 최소 표시 시간 보장
 * - 최대 표시 시간 제한
 * - 리소스 로딩 감지
 */
export const useLoadingState = ({ minDuration, maxDuration }: UseLoadingStateProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    let minTimerCompleted = false;
    let resourcesLoaded = false;

    // 최소 표시 시간 타이머
    const minTimer = window.setTimeout(() => {
      minTimerCompleted = true;
      if (resourcesLoaded) {
        setIsLoading(false);
      }
    }, minDuration);

    // 최대 표시 시간 타이머 (안전장치)
    const maxTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, maxDuration);

    // 리소스 로딩 감지
    const handleLoad = () => {
      resourcesLoaded = true;
      const elapsed = Date.now() - startTime;

      if (minTimerCompleted || elapsed >= minDuration) {
        setIsLoading(false);
      }
    };

    // DOMContentLoaded 이미 완료되었는지 확인
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, [minDuration, maxDuration]);

  return { isLoading };
};
