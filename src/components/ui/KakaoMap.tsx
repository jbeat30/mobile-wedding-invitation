'use client';

import { useEffect, useRef, useState } from 'react';

type KakaoLatLng = {
  getLat: () => number;
  getLng: () => number;
};

type KakaoMapInstance = {
  setCenter: (latlng: KakaoLatLng) => void;
  getLevel: () => number;
  setLevel: (level: number) => void;
};

type KakaoMarker = {
  setMap: (map: KakaoMapInstance | null) => void;
  setPosition: (latlng: KakaoLatLng) => void;
};

type KakaoMaps = {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMapInstance;
  Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;
  load: (callback: () => void) => void;
};

type KakaoNamespace = {
  maps: KakaoMaps;
};

declare global {
  interface Window {
    kakao?: KakaoNamespace;
  }
}

let kakaoMapLoader: Promise<void> | null = null;

const loadKakaoMap = (appKey: string) => {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  if (window.kakao?.maps) {
    return Promise.resolve();
  }
  if (kakaoMapLoader) {
    return kakaoMapLoader;
  }
  kakaoMapLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.dataset.kakaoMap = 'true';
    script.onload = () => {
      if (!window.kakao?.maps?.load) {
        reject(new Error('Kakao map load failed'));
        return;
      }
      window.kakao.maps.load(() => resolve());
    };
    script.onerror = () => reject(new Error('Kakao map script error'));
    document.head.appendChild(script);
  });
  return kakaoMapLoader;
};

type KakaoMapProps = {
  lat: number;
  lng: number;
  level?: number;
  className?: string;
};

/**
 * 카카오 지도 렌더링 처리
 * @param props KakaoMapProps
 * @returns JSX.Element
 */
export const KakaoMap = ({ lat, lng, level = 3, className = '' }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

  useEffect(() => {
    if (!appKey) {
      setErrorMessage('NEXT_PUBLIC_KAKAO_APP_KEY is not defined');
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }
    loadKakaoMap(appKey)
      .then(() => {
        if (!mapRef.current || !window.kakao?.maps) return;
        const center = new window.kakao.maps.LatLng(lat, lng);
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
            center,
            level,
          });
          markerRef.current = new window.kakao.maps.Marker({ position: center });
          markerRef.current.setMap(mapInstanceRef.current);
          return;
        }
        mapInstanceRef.current.setCenter(center);
        if (markerRef.current) {
          markerRef.current.setPosition(center);
        }
      })
      .catch(() => {
        setErrorMessage('지도 로드에 실패했습니다');
      });
  }, [appKey, lat, lng, level]);

  if (errorMessage) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center text-[12px] text-[var(--text-muted)] ${className}`}
      >
        {errorMessage}
      </div>
    );
  }

  return <div ref={mapRef} className={`h-full w-full ${className}`} />;
};
