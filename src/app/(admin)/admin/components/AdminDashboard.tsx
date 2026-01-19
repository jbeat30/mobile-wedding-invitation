'use client';

import { useEffect, useRef, useState } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { AdminSectionOverview } from '@/app/(admin)/admin/components/sections/AdminSectionOverview';
import { AdminSectionLoading } from '@/app/(admin)/admin/components/sections/AdminSectionLoading';
import { AdminSectionIntro } from '@/app/(admin)/admin/components/sections/AdminSectionIntro';
import { AdminSectionBasic } from '@/app/(admin)/admin/components/sections/AdminSectionBasic';
import { AdminSectionCouple } from '@/app/(admin)/admin/components/sections/AdminSectionCouple';
import { AdminSectionLocation } from '@/app/(admin)/admin/components/sections/AdminSectionLocation';
import { AdminSectionGallery } from '@/app/(admin)/admin/components/sections/AdminSectionGallery';
import { AdminSectionAccounts } from '@/app/(admin)/admin/components/sections/AdminSectionAccounts';
import { AdminSectionGuestbook } from '@/app/(admin)/admin/components/sections/AdminSectionGuestbook';
import { AdminSectionRsvp } from '@/app/(admin)/admin/components/sections/AdminSectionRsvp';
import { AdminSectionShare } from '@/app/(admin)/admin/components/sections/AdminSectionShare';
import { AdminSectionBgm } from '@/app/(admin)/admin/components/sections/AdminSectionBgm';
import { AdminSectionClosing } from '@/app/(admin)/admin/components/sections/AdminSectionClosing';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { loadKakaoMap } from '@/components/ui/KakaoMap';

type AdminDashboardProps = {
  data: AdminDashboardData;
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
/**
 * 관리자 대시보드 본문
 * @param props AdminDashboardProps
 * @returns JSX.Element
 */
export const AdminDashboard = ({ data }: AdminDashboardProps) => {
  let daumPostcodeLoader: Promise<void> | null = null;

  /**
   * 다음 우편번호 SDK 로드
   * @returns Promise<void>
   */
  const loadDaumPostcode = () => {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Postcode loader unavailable'));
    }
    if (window.daum?.Postcode) {
      return Promise.resolve();
    }
    if (daumPostcodeLoader) {
      return daumPostcodeLoader;
    }
    daumPostcodeLoader = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Postcode script failed'));
      document.head.appendChild(script);
    });
    return daumPostcodeLoader;
  };

  const tabs = [
    { id: 'overview', label: '요약' },
    { id: 'basic', label: '기본 정보' },
    { id: 'loading', label: '로딩 섹션' },
    { id: 'intro', label: '인트로 섹션' },
    { id: 'couple', label: '커플 섹션' },
    { id: 'location', label: '예식 정보 & 오시는 길 섹션' },
    { id: 'gallery', label: '갤러리 섹션' },
    { id: 'accounts', label: '어카운트 섹션' },
    { id: 'guestbook', label: '게스트북 섹션' },
    { id: 'rsvp', label: 'RSVP 섹션' },
    { id: 'share', label: '공유 섹션' },
    { id: 'closing', label: '마무리 인삿말 섹션' },
    { id: 'bgm', label: 'BGM 섹션' },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'overview');
  const [guestbookPage, setGuestbookPage] = useState(1);
  const [rsvpPage, setRsvpPage] = useState(1);
  const [galleryItems, setGalleryItems] = useState(data.galleryImages);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [dragOverImageId, setDragOverImageId] = useState<string | null>(null);
  const [orderSaved, setOrderSaved] = useState(false);
  const [accountFormOpen, setAccountFormOpen] = useState({ groom: false, bride: false });
  const [locationCoords, setLocationCoords] = useState({
    lat: data.location.latitude,
    lng: data.location.longitude,
  });
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const [isPlaceSearchOpen, setIsPlaceSearchOpen] = useState(false);
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const [placeSearchResults, setPlaceSearchResults] = useState<KakaoPlace[]>([]);
  const [placeSearchStatus, setPlaceSearchStatus] = useState<string | null>(null);
  const [placeSearchError, setPlaceSearchError] = useState<string | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const venueInputRef = useRef<HTMLInputElement | null>(null);
  const postcodeContainerRef = useRef<HTMLDivElement | null>(null);
  const placeSearchMapRef = useRef<HTMLDivElement | null>(null);
  const placeSearchMapInstanceRef = useRef<KakaoMapInstance | null>(null);
  const placeSearchPlacesRef = useRef<KakaoPlaces | null>(null);
  const placeSearchMarkersRef = useRef<KakaoMarker[]>([]);
  const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

  useEffect(() => {
    setGalleryItems(data.galleryImages);
  }, [data.galleryImages]);

  useEffect(() => {
    setLocationCoords({
      lat: data.location.latitude,
      lng: data.location.longitude,
    });
  }, [data.location.latitude, data.location.longitude]);

  const groomEntries = data.accountEntries.filter((entry) => entry.group_type === 'groom');
  const brideEntries = data.accountEntries.filter((entry) => entry.group_type === 'bride');

  /**
   * 주소 검색 모달 열기
   * @returns Promise<void>
   */
  const openPostcodeModal = async () => {
    setIsPostcodeOpen(true);
    setPostcodeError(null);
    try {
      await loadDaumPostcode();
    } catch (error) {
      console.error('Postcode load failed:', error);
      setPostcodeError('카카오 주소 검색을 불러오지 못했습니다');
      return;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 0));

    if (!postcodeContainerRef.current || !window.daum?.Postcode) {
      setPostcodeError('주소 검색 초기화에 실패했습니다');
      return;
    }

    postcodeContainerRef.current.innerHTML = '';
    const postcode = new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeResult) => {
        const selectedAddress = data.roadAddress || data.address;
        if (addressInputRef.current) {
          addressInputRef.current.value = selectedAddress;
        }
        if (venueInputRef.current) {
          venueInputRef.current.value = data.buildingName || selectedAddress;
        }
        setIsPostcodeOpen(false);
      },
      onresize: (size: DaumPostcodeSize) => {
        if (!postcodeContainerRef.current) return;
        postcodeContainerRef.current.style.height = `${size.height}px`;
      },
      width: '100%',
      height: '100%',
    });
    postcode.embed(postcodeContainerRef.current);
  };

  /**
   * 주소 검색 모달 닫기
   * @returns void
   */
  const closePostcodeModal = () => {
    setIsPostcodeOpen(false);
  };

  /**
   * 장소 검색 마커 초기화
   * @returns void
   */
  const clearPlaceSearchMarkers = () => {
    placeSearchMarkersRef.current.forEach((marker) => marker.setMap(null));
    placeSearchMarkersRef.current = [];
  };

  /**
   * 카카오 장소 검색 모달 열기
   * @returns Promise<void>
   */
  const openPlaceSearchModal = async () => {
    setIsPlaceSearchOpen(true);
    setPlaceSearchError(null);
    setPlaceSearchStatus(null);
    setPlaceSearchResults([]);
    setPlaceSearchQuery(venueInputRef.current?.value || '');

    if (!kakaoAppKey) {
      setPlaceSearchError('NEXT_PUBLIC_KAKAO_APP_KEY is not defined');
      return;
    }

    try {
      await loadKakaoMap(kakaoAppKey);
    } catch (error) {
      console.error('Kakao map load failed:', error);
      setPlaceSearchError('카카오 지도 로딩에 실패했습니다');
      return;
    }

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
  };

  /**
   * 카카오 장소 검색 모달 닫기
   * @returns void
   */
  const closePlaceSearchModal = () => {
    setIsPlaceSearchOpen(false);
    setPlaceSearchStatus(null);
    setPlaceSearchError(null);
    clearPlaceSearchMarkers();
    placeSearchMapInstanceRef.current = null;
    placeSearchPlacesRef.current = null;
  };

  /**
   * 장소 선택 후 입력값/좌표 반영
   * @param place KakaoPlace
   * @returns void
   */
  const handlePlaceSelect = (place: KakaoPlace) => {
    const selectedAddress = place.road_address_name || place.address_name;
    const lat = Number(place.y);
    const lng = Number(place.x);

    if (venueInputRef.current) {
      venueInputRef.current.value = place.place_name;
    }
    if (addressInputRef.current) {
      addressInputRef.current.value = selectedAddress;
    }
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setLocationCoords({ lat, lng });
    }
    closePlaceSearchModal();
  };

  /**
   * 카카오 키워드 장소 검색 실행
   * @returns void
   */
  const handlePlaceSearch = () => {
    const query = placeSearchQuery.trim();
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
    places.keywordSearch(query, (data, status) => {
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
          marker.setMap(map);
          placeSearchMarkersRef.current.push(marker);
          bounds.extend(position);
        });
        map.setBounds(bounds);
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
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminSectionOverview />;
      case 'loading':
        return <AdminSectionLoading loading={data.loading} assets={data.assets} />;
      case 'intro':
        return (
          <AdminSectionIntro
            assets={data.assets}
            greeting={data.greeting}
            sectionTitles={data.sectionTitles}
          />
        );
      case 'basic':
        return (
          <AdminSectionBasic
            data={data}
            locationCoords={locationCoords}
            onOpenPlaceSearchModal={openPlaceSearchModal}
            onOpenPostcodeModal={openPostcodeModal}
            addressInputRef={addressInputRef}
            venueInputRef={venueInputRef}
          />
        );
      case 'couple':
        return (
          <AdminSectionCouple
            profile={data.profile}
            sectionTitles={data.sectionTitles}
          />
        );
      case 'location':
        return <AdminSectionLocation data={data} />;
      case 'gallery':
        return (
          <AdminSectionGallery
            gallery={data.gallery}
            galleryItems={galleryItems}
            setGalleryItems={setGalleryItems}
            draggedImageId={draggedImageId}
            setDraggedImageId={setDraggedImageId}
            dragOverImageId={dragOverImageId}
            setDragOverImageId={setDragOverImageId}
            orderSaved={orderSaved}
            setOrderSaved={setOrderSaved}
          />
        );
      case 'accounts':
        return (
          <AdminSectionAccounts
            accounts={data.accounts}
            groomEntries={groomEntries}
            brideEntries={brideEntries}
            accountFormOpen={accountFormOpen}
            setAccountFormOpen={setAccountFormOpen}
          />
        );
      case 'guestbook':
        return (
          <AdminSectionGuestbook
            guestbook={data.guestbook}
            guestbookEntries={data.guestbookEntries}
            sectionTitles={data.sectionTitles}
            guestbookPage={guestbookPage}
            setGuestbookPage={setGuestbookPage}
          />
        );
      case 'rsvp':
        return (
          <AdminSectionRsvp
            rsvp={data.rsvp}
            rsvpResponses={data.rsvpResponses}
            sectionTitles={data.sectionTitles}
            rsvpPage={rsvpPage}
            setRsvpPage={setRsvpPage}
          />
        );
      case 'share':
        return (
          <AdminSectionShare
            share={data.share}
            assets={data.assets}
            sectionTitles={data.sectionTitles}
          />
        );
      case 'bgm':
        return <AdminSectionBgm bgm={data.bgm} />;
      case 'closing':
        return <AdminSectionClosing closing={data.closing} />;
      default:
        return null;
    }
  };


  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 rounded-[16px] border border-[var(--border-light)] bg-white/80 p-4 lg:w-[240px] lg:self-start">
        <p className="text-[12px] font-semibold text-[var(--text-secondary)]">콘텐츠 메뉴</p>
        <div className="mt-3 flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer rounded-[10px] px-3 py-2 text-[13px] whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[var(--accent-rose-light)] text-[var(--text-primary)]'
                    : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </aside>

      <section className="flex-1">{renderTabContent()}</section>

      {isPlaceSearchOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            onClick={closePlaceSearchModal}
            className="absolute inset-0 cursor-pointer bg-black/40"
            aria-label="장소 검색 닫기"
          />
          <div className="relative z-10 w-full max-w-[960px] overflow-hidden rounded-[16px] border border-[var(--border-light)] bg-white shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-3 border-b border-[var(--border-light)] px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                  카카오 장소 검색
                </h3>
                <Button type="button" size="sm" variant="ghost" onClick={closePlaceSearchModal}>
                  닫기
                </Button>
              </div>
              <div className="flex flex-1 gap-2">
                <TextInput
                  value={placeSearchQuery}
                  onChange={(event) => setPlaceSearchQuery(event.target.value)}
                  placeholder="예: 채림 웨딩홀"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handlePlaceSearch();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handlePlaceSearch}
                  className="shrink-0 whitespace-nowrap"
                >
                  검색
                </Button>
              </div>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-[1.2fr_1fr]">
              <div className="h-[360px] overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/60">
                <div ref={placeSearchMapRef} className="h-full w-full" />
              </div>
              <div className="max-h-[360px] overflow-y-auto rounded-[12px] border border-[var(--border-light)] bg-white/70">
                {placeSearchResults.length > 0 ? (
                  <div className="divide-y divide-[var(--border-light)]">
                    {placeSearchResults.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => handlePlaceSelect(place)}
                        className="w-full px-4 py-3 text-left transition hover:bg-[var(--bg-secondary)]"
                      >
                        <p className="text-[14px] font-medium text-[var(--text-primary)]">
                          {place.place_name}
                        </p>
                        <p className="mt-1 text-[12px] text-[var(--text-muted)]">
                          {place.road_address_name || place.address_name}
                        </p>
                        {place.category_name ? (
                          <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">
                            {place.category_name}
                          </p>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-[12px] text-[var(--text-muted)]">
                    {placeSearchStatus || '검색어를 입력하세요'}
                  </div>
                )}
              </div>
            </div>
            {placeSearchError ? (
              <div className="border-t border-[var(--border-light)] px-4 py-3 text-[12px] text-[var(--accent-burgundy)]">
                {placeSearchError}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {isPostcodeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            onClick={closePostcodeModal}
            className="absolute inset-0 cursor-pointer bg-black/40"
            aria-label="주소 검색 닫기"
          />
          <div className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-[16px] border border-[var(--border-light)] bg-white shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b border-[var(--border-light)] px-4 py-3">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                카카오 주소 검색
              </h3>
              <Button type="button" size="sm" variant="ghost" onClick={closePostcodeModal}>
                닫기
              </Button>
            </div>
            <div className="h-[420px] bg-[var(--bg-secondary)]" ref={postcodeContainerRef} />
            {postcodeError ? (
              <div className="border-t border-[var(--border-light)] px-4 py-3 text-[12px] text-[var(--accent-burgundy)]">
                {postcodeError}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
