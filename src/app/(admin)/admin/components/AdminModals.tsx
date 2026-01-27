'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { loadKakaoMap } from '@/components/ui/KakaoMap';

/**
 * 관리자 모달 관리 컴포넌트
 * 우편번호 검색, 장소 검색 등의 모달을 관리
 * @returns JSX.Element
 */
export const AdminModals = () => {
  const {
    modals,
    placeSearch,
    closePostcodeModal,
    closePlaceSearchModal,
    setPlaceSearchQuery,
    setPlaceSearchResults,
    setPlaceSearchStatus,
    setPlaceSearchError,
    locationCoords,
    setLocationCoords,
  } = useAdminStore();

  const postcodeContainerRef = useRef<HTMLDivElement | null>(null);
  const placeSearchMapRef = useRef<HTMLDivElement | null>(null);
  const placeSearchMapInstanceRef = useRef<unknown>(null);
  const placeSearchPlacesRef = useRef<unknown>(null);
  const placeSearchMarkersRef = useRef<unknown[]>([]);
  const daumPostcodeLoaderRef = useRef<Promise<void> | null>(null);

  const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

  /**
   * 다음 우편번호 SDK 로드
   * @returns Promise<void>
   */
  const loadDaumPostcode = useCallback(() => {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Postcode loader unavailable'));
    }
    if (window.daum?.Postcode) {
      return Promise.resolve();
    }
    if (daumPostcodeLoaderRef.current) {
      return daumPostcodeLoaderRef.current;
    }
    daumPostcodeLoaderRef.current = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Postcode script failed'));
      document.head.appendChild(script);
    });
    return daumPostcodeLoaderRef.current;
  }, []);

  /**
   * 장소 검색 마커 초기화
   * @returns void
   */
  const clearPlaceSearchMarkers = useCallback(() => {
    placeSearchMarkersRef.current.forEach((marker: unknown) => (marker as { setMap: (map: unknown) => void }).setMap(null));
    placeSearchMarkersRef.current = [];
  }, []);

  /**
   * 장소 선택 후 입력값/좌표 반영
   * @param place KakaoPlace
   * @returns void
   */
  const handlePlaceSelect = useCallback((place: KakaoPlace) => {
    const lat = Number(place.y);
    const lng = Number(place.x);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setLocationCoords({ lat, lng });
    }
    closePlaceSearchModal();
  }, [setLocationCoords, closePlaceSearchModal]);

  /**
   * 카카오 키워드 장소 검색 실행
   * @returns void
   */
  const handlePlaceSearch = useCallback(() => {
    const query = placeSearch.query.trim();
    if (!query) {
      setPlaceSearchStatus('검색어를 입력해주세요');
      setPlaceSearchResults([]);
      clearPlaceSearchMarkers();
      return;
    }

    const places = placeSearchPlacesRef.current;
    const map = placeSearchMapInstanceRef.current;
    if (!places || !map || !window.kakao?.maps?.services) {
      setPlaceSearchStatus('지도 준비 중입니다');
      return;
    }

    setPlaceSearchStatus('검색 중...');
    (places as { keywordSearch: (query: string, callback: (data: KakaoPlace[], status: string) => void) => void }).keywordSearch(query, (data, status) => {
      const kakao = window.kakao;
      if (!kakao?.maps) return;
      
      if (status === kakao.maps.services.Status.OK) {
        setPlaceSearchResults(data);
        setPlaceSearchStatus(null);
        clearPlaceSearchMarkers();
        
        const bounds = new kakao.maps.LatLngBounds();
        data.forEach((place) => {
          const lat = Number(place.y);
          const lng = Number(place.x);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
          
          const position = new kakao.maps.LatLng(lat, lng);
          const marker = new kakao.maps.Marker({ position });
          (marker as { setMap: (map: unknown) => void }).setMap(map);
          placeSearchMarkersRef.current.push(marker);
          bounds.extend(position);
        });
        (map as { setBounds: (bounds: unknown) => void }).setBounds(bounds);
        return;
      }
      
      if (status === kakao.maps.services.Status.ZERO_RESULT) {
        setPlaceSearchStatus('검색 결과가 없습니다');
      } else {
        setPlaceSearchStatus('검색 중 오류가 발생했습니다');
      }
      setPlaceSearchResults([]);
      clearPlaceSearchMarkers();
    });
  }, [placeSearch.query, setPlaceSearchStatus, setPlaceSearchResults, clearPlaceSearchMarkers]);

  // 우편번호 모달 초기화
  useEffect(() => {
    if (!modals.postcodeOpen) return;

    const initPostcode = async () => {
      try {
        await loadDaumPostcode();
        await new Promise((resolve) => window.setTimeout(resolve, 0));

        if (!window.daum) {
          return;
        }

        if (!postcodeContainerRef.current) {
          return;
        }

        postcodeContainerRef.current.innerHTML = '';
        const postcode = new (window.daum as unknown as { 
          Postcode: new (options: unknown) => { embed: (container: HTMLElement) => void } 
        }).Postcode({
          oncomplete: () => {
            closePostcodeModal();
          },
          onresize: (size: { height: number }) => {
            if (!postcodeContainerRef.current) return;
            postcodeContainerRef.current.style.height = `${size.height}px`;
          },
          width: '100%',
          height: '100%',
        });
        postcode.embed(postcodeContainerRef.current);
      } catch (error) {
        console.error('Postcode load failed:', error);
      }
    };

    initPostcode();
  }, [modals.postcodeOpen, loadDaumPostcode, closePostcodeModal]);

  // 장소 검색 모달 초기화
  useEffect(() => {
    if (!modals.placeSearchOpen) return;

    const initPlaceSearch = async () => {
      if (!kakaoAppKey) {
        setPlaceSearchError('NEXT_PUBLIC_KAKAO_APP_KEY is not defined');
        return;
      }

      try {
        await loadKakaoMap(kakaoAppKey);
        await new Promise((resolve) => window.setTimeout(resolve, 0));

        if (!placeSearchMapRef.current || !window.kakao?.maps) {
          setPlaceSearchError('지도 초기화에 실패했습니다');
          return;
        }

        if (!window.kakao.maps.services) {
          setPlaceSearchError('카카오 장소 검색 기능을 불러오지 못했습니다');
          return;
        }

        if (!placeSearchMapInstanceRef.current) {
          const fallbackLat = Number.isFinite(locationCoords.lat) ? locationCoords.lat : 37.5665;
          const fallbackLng = Number.isFinite(locationCoords.lng) ? locationCoords.lng : 126.978;
          const center = new window.kakao.maps.LatLng(fallbackLat, fallbackLng);
          
          placeSearchMapInstanceRef.current = new window.kakao.maps.Map(placeSearchMapRef.current, {
            center,
            level: 3,
          });
        }

        if (!placeSearchPlacesRef.current) {
          placeSearchPlacesRef.current = new window.kakao.maps.services.Places();
        }
      } catch (error) {
        console.error('Kakao map load failed:', error);
        setPlaceSearchError('카카오 지도 로딩에 실패했습니다');
      }
    };

    initPlaceSearch();
  }, [modals.placeSearchOpen, kakaoAppKey, locationCoords, setPlaceSearchError]);

  return (
    <>
      {/* 장소 검색 모달 */}
      {modals.placeSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">카카오 장소 검색</h3>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={closePlaceSearchModal}
                className="text-slate-500 hover:text-slate-700"
              >
                닫기
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <Input
                  value={placeSearch.query}
                  onChange={(e) => setPlaceSearchQuery(e.target.value)}
                  placeholder="예: 채림 웨딩홀"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handlePlaceSearch();
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handlePlaceSearch}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  검색
                </Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] h-96">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <div ref={placeSearchMapRef} className="h-full w-full" />
                </div>
                
                <div className="rounded-lg border border-slate-200 overflow-y-auto bg-slate-50">
                  {placeSearch.results.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                      {placeSearch.results.map((place) => (
                        <button
                          key={place.id}
                          type="button"
                          onClick={() => handlePlaceSelect(place)}
                          className="w-full p-4 text-left hover:bg-white transition-colors"
                        >
                          <p className="font-medium text-slate-900">{place.place_name}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {place.road_address_name || place.address_name}
                          </p>
                          {place.category_name && (
                            <p className="text-xs text-slate-500 mt-1">{place.category_name}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      {placeSearch.status || '검색어를 입력하세요'}
                    </div>
                  )}
                </div>
              </div>
              
              {placeSearch.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{placeSearch.error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 우편번호 검색 모달 */}
      {modals.postcodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">우편번호 검색</h3>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={closePostcodeModal}
                className="text-slate-500 hover:text-slate-700"
              >
                닫기
              </Button>
            </div>
            <div className="h-96 bg-slate-100" ref={postcodeContainerRef} />
          </div>
        </div>
      )}
    </>
  );
};

type KakaoPlace = {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  category_name: string;
  x: string;
  y: string;
};