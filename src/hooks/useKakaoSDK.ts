'use client';

import { useEffect, useState } from 'react';

interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (settings: object) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

/**
 * 카카오 SDK 로드 및 초기화 훅
 *
 * - 환경변수에 NEXT_PUBLIC_KAKAO_APP_KEY가 있으면 자동으로 SDK 로드
 * - 키가 없으면 isReady=false 반환 (공유 버튼 비활성화)
 * - 키 추가 후 재빌드하면 자동으로 활성화
 */
export const useKakaoSDK = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 환경변수에서 카카오 앱 키 가져오기
  const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

  useEffect(() => {
    // 카카오 앱 키가 없으면 로드하지 않음
    if (!appKey) {
      setError('NEXT_PUBLIC_KAKAO_APP_KEY is not defined');
      return;
    }

    // 이미 SDK가 로드되어 있으면 초기화만 수행
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(appKey);
      }
      setIsReady(true);
      return;
    }

    // SDK 스크립트 로드
    setIsLoading(true);
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.integrity = 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4';
    script.crossOrigin = 'anonymous';
    script.async = true;

    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(appKey);
        setIsReady(true);
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      setError('Failed to load Kakao SDK');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // cleanup 시 스크립트 제거하지 않음 (전역으로 한 번만 로드)
    };
  }, [appKey]);

  return { isReady, isLoading, error, hasAppKey: !!appKey };
};
