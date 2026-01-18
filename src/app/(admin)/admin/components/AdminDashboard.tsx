'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import {
  addAccountEntryAction,
  deleteAccountEntryAction,
  updateAccountEntryAction,
  updateAccountsAction,
} from '@/app/(admin)/admin/actions/accounts';
import {
  addGalleryImageAction,
  deleteGalleryImageAction,
  updateGalleryAction,
  updateHeroImageAction,
  updateLoadingImageAction,
  updateShareImagesAction,
} from '@/app/(admin)/admin/actions/assets';
import { updateBgmAction } from '@/app/(admin)/admin/actions/bgm';
import {
  updateClosingAction,
  updateLoadingAction,
  updateLocationAction,
  updateBasicInfoAction,
  updateProfileAction,
  updateTransportationAction,
} from '@/app/(admin)/admin/actions/content';
import { updateGreetingAction } from '@/app/(admin)/admin/actions/greeting';
import { updateGuestbookAction } from '@/app/(admin)/admin/actions/guestbook';
import { updateShareAction } from '@/app/(admin)/admin/actions/share';
import { updateRsvpTitleAction } from '@/app/(admin)/admin/actions/rsvp';
import { OverviewCard } from '@/app/(admin)/admin/components/OverviewCard';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SelectField } from '@/components/ui/SelectField';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';
import { KakaoMap } from '@/components/ui/KakaoMap';

type AdminDashboardProps = {
  data: AdminDashboardData;
};

type ImageFileFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
  previewClassName?: string;
  required?: boolean;
};

/**
 * 이미지 파일 업로드 + 로컬 미리보기
 * @param props ImageFileFieldProps
 * @returns JSX.Element
 */
const ImageFileField = ({
  id,
  name,
  label,
  defaultValue = '',
  hint,
  previewClassName = 'h-[360px]',
  required = false,
}: ImageFileFieldProps) => {
  const [value, setValue] = useState<string>(defaultValue || '');
  const [errorMessage, setErrorMessage] = useState('');
  const showPreview = value.trim().length > 0 && !errorMessage;
  const maxSize = 2 * 1024 * 1024;

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="file"
        accept="image/*"
        required={required}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (!file.type.startsWith('image/')) {
            setErrorMessage('이미지 파일만 업로드할 수 있습니다');
            return;
          }
          if (file.size > maxSize) {
            setErrorMessage('이미지 파일은 2MB 이하만 가능합니다');
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const nextValue = String(reader.result || '');
            setValue(nextValue);
            setErrorMessage('');
          };
          reader.readAsDataURL(file);
        }}
        className="w-full rounded-[10px] border border-[var(--border-light)] bg-white/70 px-3 py-2 text-[13px] text-[var(--text-primary)] file:mr-3 file:rounded-[8px] file:border-0 file:bg-[var(--bg-secondary)] file:px-3 file:py-1.5 file:text-[12px] file:text-[var(--text-secondary)]"
      />
      <input type="hidden" name={name} value={value} />
      {hint ? <p className="text-[11px] text-[var(--text-muted)]">{hint}</p> : null}
      {errorMessage ? (
        <p className="text-[11px] text-[var(--accent-burgundy)]">{errorMessage}</p>
      ) : null}
      {value.trim().length > 0 ? (
        <div className="relative overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/60">
          {showPreview ? (
            <div className={`relative w-full ${previewClassName}`}>
              <Image
                src={value}
                alt={`${label} 미리보기`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-[120px] items-center justify-center text-[12px] text-[var(--text-muted)]">
              미리보기를 불러올 수 없습니다
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

/**
 * 관리자 대시보드 본문
 * @param props AdminDashboardProps
 * @returns JSX.Element
 */
export const AdminDashboard = ({ data }: AdminDashboardProps) => {
  const galleryOrderStorageKey = 'admin-gallery-order';
  const getImageLabel = (src: string) => {
    if (src.startsWith('data:')) {
      return '업로드 이미지';
    }
    if (src.length > 60) {
      return `${src.slice(0, 60)}...`;
    }
    return src;
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
  const [geocodeStatus, setGeocodeStatus] = useState<string | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const latInputRef = useRef<HTMLInputElement | null>(null);
  const lngInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setGalleryItems(data.galleryImages);
  }, [data.galleryImages]);

  useEffect(() => {
    const stored = window.localStorage.getItem(galleryOrderStorageKey);
    if (!stored) return;
    try {
      const ids = JSON.parse(stored);
      if (!Array.isArray(ids)) return;
      const map = new Map(galleryItems.map((image) => [image.id, image]));
      const ordered = ids.map((id) => map.get(id)).filter(Boolean) as typeof galleryItems;
      const missing = galleryItems.filter((image) => !ids.includes(image.id));
      setGalleryItems([...ordered, ...missing]);
    } catch {
      return;
    }
  }, [galleryItems]);

  useEffect(() => {
    setLocationCoords({
      lat: data.location.latitude,
      lng: data.location.longitude,
    });
  }, [data.location.latitude, data.location.longitude]);

  const groomEntries = data.accountEntries.filter((entry) => entry.group_type === 'groom');
  const brideEntries = data.accountEntries.filter((entry) => entry.group_type === 'bride');

  const handleGeocode = async () => {
    const address = addressInputRef.current?.value.trim() || '';
    if (!address) {
      setGeocodeStatus('주소를 먼저 입력해주세요');
      return;
    }
    setGeocodeStatus('좌표를 조회하고 있습니다');
    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = (await response.json()) as {
        lat?: number;
        lng?: number;
        error?: string;
        status?: string;
        message?: string;
      };
      if (!response.ok) {
        const detail = [data.status, data.message].filter(Boolean).join(' / ');
        setGeocodeStatus(detail ? `좌표 조회 실패: ${detail}` : '좌표 조회 실패');
        return;
      }
      if (Number.isFinite(data.lat) && Number.isFinite(data.lng)) {
        setLocationCoords({ lat: data.lat, lng: data.lng });
        if (latInputRef.current) latInputRef.current.value = String(data.lat);
        if (lngInputRef.current) lngInputRef.current.value = String(data.lng);
        setGeocodeStatus('좌표가 업데이트되었습니다');
      } else {
        setGeocodeStatus('좌표 결과를 찾지 못했습니다');
      }
    } catch {
      setGeocodeStatus('좌표 조회에 실패했습니다');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewCard />;
      case 'loading':
        return (
          <div className="flex flex-col gap-6">
            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                로딩 설정
              </h2>
              <form action={updateLoadingAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-2 text-[14px] md:col-span-2">
                  <input
                    type="checkbox"
                    name="loading_enabled"
                    defaultChecked={data.loading.enabled}
                  />
                  사용
                </label>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="loading_message">로딩 메시지</FieldLabel>
                  <TextInput
                    id="loading_message"
                    name="loading_message"
                    defaultValue={data.loading.message}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="loading_min_duration">최소 로딩 보장 시간 (ms)</FieldLabel>
                  <TextInput
                    id="loading_min_duration"
                    name="loading_min_duration"
                    type="number"
                    defaultValue={data.loading.min_duration}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="loading_additional_duration">추가 로딩 시간 (ms)</FieldLabel>
                  <TextInput
                    id="loading_additional_duration"
                    name="loading_additional_duration"
                    type="number"
                    defaultValue={data.loading.additional_duration}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" size="sm">
                    저장하기
                  </Button>
                </div>
              </form>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                로딩 이미지
              </h2>
              <form action={updateLoadingImageAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <ImageFileField
                  id="loading_image"
                  name="loading_image"
                  label="로딩 이미지"
                  defaultValue={data.assets.loading_image}
                  hint="2MB 이하 이미지 파일"
                />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" size="sm">
                    이미지 저장
                  </Button>
                </div>
              </form>
            </SurfaceCard>
          </div>
        );
      case 'intro':
        return (
          <div className="flex flex-col gap-6">
            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                메인 이미지
              </h2>
              <form action={updateHeroImageAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <ImageFileField
                  id="hero_image"
                  name="hero_image"
                  label="메인 이미지"
                  defaultValue={data.assets.hero_image}
                  hint="2MB 이하 이미지 파일"
                />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" size="sm">
                    이미지 저장
                  </Button>
                </div>
              </form>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                인사말
              </h2>
              <form action={updateGreetingAction} className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="greeting_section_title">인사말 섹션 타이틀</FieldLabel>
                  <TextInput
                    id="greeting_section_title"
                    name="greeting_section_title"
                    defaultValue={data.sectionTitles.greeting}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="poetic_note">시구</FieldLabel>
                  <TextInput
                    id="poetic_note"
                    name="poetic_note"
                    defaultValue={data.greeting.poetic_note || ''}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="message_lines">본문 (줄바꿈으로 구분)</FieldLabel>
                  <TextArea
                    id="message_lines"
                    name="message_lines"
                    className="min-h-[360px]"
                    defaultValue={(data.greeting.message_lines || []).join('\n')}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="sm">
                    저장하기
                  </Button>
                </div>
              </form>
            </SurfaceCard>
          </div>
        );
      case 'basic':
        return (
          <SurfaceCard className="p-6">
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">기본 정보</h2>
            <form action={updateBasicInfoAction} className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="groom_last_name">신랑 성</FieldLabel>
                  <TextInput
                    id="groom_last_name"
                    name="groom_last_name"
                    defaultValue={data.profile.groom_last_name}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="groom_first_name">신랑 이름</FieldLabel>
                  <TextInput
                    id="groom_first_name"
                    name="groom_first_name"
                    defaultValue={data.profile.groom_first_name}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="bride_last_name">신부 성</FieldLabel>
                  <TextInput
                    id="bride_last_name"
                    name="bride_last_name"
                    defaultValue={data.profile.bride_last_name}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="bride_first_name">신부 이름</FieldLabel>
                  <TextInput
                    id="bride_first_name"
                    name="bride_first_name"
                    defaultValue={data.profile.bride_first_name}
                  />
                </div>
              </div>
              <div className="text-[13px] font-semibold text-[var(--text-secondary)] md:col-span-2">
                부모님 성함
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="groom_father_name">신랑 아버지</FieldLabel>
                <TextInput
                  id="groom_father_name"
                  name="groom_father_name"
                  defaultValue={data.parents.groom.father || ''}
                />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="groom_mother_name">신랑 어머니</FieldLabel>
                <TextInput
                  id="groom_mother_name"
                  name="groom_mother_name"
                  defaultValue={data.parents.groom.mother || ''}
                />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="bride_father_name">신부 아버지</FieldLabel>
                <TextInput
                  id="bride_father_name"
                  name="bride_father_name"
                  defaultValue={data.parents.bride.father || ''}
                />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="bride_mother_name">신부 어머니</FieldLabel>
                <TextInput
                  id="bride_mother_name"
                  name="bride_mother_name"
                  defaultValue={data.parents.bride.mother || ''}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" size="sm">
                  저장하기
                </Button>
              </div>
            </form>
          </SurfaceCard>
        );
      case 'couple':
        return (
            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                커플 섹션
              </h2>
              <form action={updateProfileAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="couple_section_title">커플 섹션 타이틀</FieldLabel>
                  <TextInput
                    id="couple_section_title"
                    name="couple_section_title"
                    defaultValue={data.sectionTitles.couple}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="groom_bio">신랑 소개글</FieldLabel>
                  <TextArea
                  id="groom_bio"
                  name="groom_bio"
                  defaultValue={data.profile.groom_bio || ''}
                />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="bride_bio">신부 소개글</FieldLabel>
                <TextArea
                  id="bride_bio"
                  name="bride_bio"
                  defaultValue={data.profile.bride_bio || ''}
                />
              </div>
              <ImageFileField
                id="groom_profile_image"
                name="groom_profile_image"
                label="신랑 프로필 이미지"
                defaultValue={data.profile.groom_profile_image || ''}
                previewClassName="h-[300px]"
                hint="2MB 이하 이미지 파일"
              />
              <ImageFileField
                id="bride_profile_image"
                name="bride_profile_image"
                label="신부 프로필 이미지"
                defaultValue={data.profile.bride_profile_image || ''}
                previewClassName="h-[300px]"
                hint="2MB 이하 이미지 파일"
              />
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" size="sm">
                  저장하기
                </Button>
              </div>
            </form>
          </SurfaceCard>
        );
      case 'location':
        return (
          <div className="flex flex-col gap-6">
            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                예식 정보
              </h2>
              <form action={updateLocationAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="wedding_section_title">예식 섹션 타이틀</FieldLabel>
                  <TextInput
                    id="wedding_section_title"
                    name="wedding_section_title"
                    defaultValue={data.sectionTitles.wedding}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="event_date_time">예식 일시</FieldLabel>
                  <TextInput
                    id="event_date_time"
                    name="event_date_time"
                    defaultValue={data.event.date_time}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="event_venue">예식장</FieldLabel>
                  <TextInput
                    id="event_venue"
                    name="event_venue"
                    defaultValue={data.event.venue}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="event_address">주소</FieldLabel>
                  <TextInput
                    id="event_address"
                    name="event_address"
                    ref={addressInputRef}
                    defaultValue={data.event.address}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="location_place_name">지도 표시명</FieldLabel>
                  <TextInput
                    id="location_place_name"
                    name="location_place_name"
                    defaultValue={data.location.place_name}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="location_notices">안내 문구 (줄바꿈)</FieldLabel>
                  <TextArea
                    id="location_notices"
                    name="location_notices"
                    className="min-h-[140px]"
                    defaultValue={(data.location.notices || []).join('\n')}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" size="sm">
                    저장하기
                  </Button>
                </div>
              </form>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                오시는 길 지도/교통
              </h2>
              <form action={updateLocationAction} className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="location_section_title">오시는 길 섹션 타이틀</FieldLabel>
                  <TextInput
                    id="location_section_title"
                    name="location_section_title"
                    defaultValue={data.sectionTitles.location}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="sm">
                    타이틀 저장
                  </Button>
                </div>
              </form>
              <form action={updateLocationAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/60">
                  <div className="h-[220px]">
                    <KakaoMap lat={locationCoords.lat} lng={locationCoords.lng} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="location_latitude">위도</FieldLabel>
                  <TextInput
                    id="location_latitude"
                    name="location_latitude"
                    ref={latInputRef}
                    defaultValue={data.location.latitude}
                    onChange={(event) => {
                      const nextLat = Number(event.target.value);
                      setLocationCoords((prev) => ({
                        ...prev,
                        lat: Number.isFinite(nextLat) ? nextLat : prev.lat,
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="location_longitude">경도</FieldLabel>
                  <TextInput
                    id="location_longitude"
                    name="location_longitude"
                    ref={lngInputRef}
                    defaultValue={data.location.longitude}
                    onChange={(event) => {
                      const nextLng = Number(event.target.value);
                      setLocationCoords((prev) => ({
                        ...prev,
                        lng: Number.isFinite(nextLng) ? nextLng : prev.lng,
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center justify-between md:col-span-2">
                  <button
                    type="button"
                    onClick={handleGeocode}
                    className="text-[12px] font-medium text-[var(--accent-burgundy)] underline-offset-4 hover:underline"
                  >
                    주소로 좌표 조회
                  </button>
                  {geocodeStatus ? (
                    <span className="text-[12px] text-[var(--text-muted)]">
                      {geocodeStatus}
                    </span>
                  ) : null}
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" size="sm">
                    좌표 저장
                  </Button>
                </div>
              </form>

              <form action={updateTransportationAction} className="mt-6 flex flex-col gap-4">
                <input type="hidden" name="location_id" value={data.location.id} />
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="transport_subway">지하철 (줄바꿈)</FieldLabel>
                  <TextArea
                    id="transport_subway"
                    name="transport_subway"
                    className="min-h-[120px]"
                    defaultValue={(data.transportation.subway || []).join('\n')}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="transport_bus">버스 (줄바꿈)</FieldLabel>
                  <TextArea
                    id="transport_bus"
                    name="transport_bus"
                    className="min-h-[120px]"
                    defaultValue={(data.transportation.bus || []).join('\n')}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="transport_car">자가용</FieldLabel>
                  <TextInput
                    id="transport_car"
                    name="transport_car"
                    defaultValue={data.transportation.car || ''}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="transport_parking">주차</FieldLabel>
                  <TextInput
                    id="transport_parking"
                    name="transport_parking"
                    defaultValue={data.transportation.parking || ''}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="sm">
                    교통 안내 저장
                  </Button>
                </div>
              </form>
            </SurfaceCard>
          </div>
        );
      case 'share':
        return (
          <div className="flex flex-col gap-6">
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">공유 설정</h2>
        <form action={updateShareAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="share_section_title">공유 섹션 타이틀</FieldLabel>
            <TextInput
              id="share_section_title"
              name="share_section_title"
              defaultValue={data.sectionTitles.share}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="share_title">공유 타이틀</FieldLabel>
            <TextInput id="share_title" name="share_title" defaultValue={data.share.title} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="share_description">공유 설명</FieldLabel>
            <TextInput
              id="share_description"
              name="share_description"
              defaultValue={data.share.description}
            />
          </div>
          <ImageFileField
            id="share_image_url"
            name="share_image_url"
            label="공유 이미지"
            defaultValue={data.share.image_url}
            hint="2MB 이하 이미지 파일"
          />
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="kakao_title">카카오 타이틀</FieldLabel>
            <TextInput
              id="kakao_title"
              name="kakao_title"
              defaultValue={data.share.kakao_title || ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="kakao_description">카카오 설명</FieldLabel>
            <TextInput
              id="kakao_description"
              name="kakao_description"
              defaultValue={data.share.kakao_description || ''}
            />
          </div>
          <ImageFileField
            id="kakao_image_url"
            name="kakao_image_url"
            label="카카오 이미지"
            defaultValue={data.share.kakao_image_url || ''}
            hint="2MB 이하 이미지 파일"
          />
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="kakao_button_label">카카오 버튼 라벨</FieldLabel>
            <TextInput
              id="kakao_button_label"
              name="kakao_button_label"
              defaultValue={data.share.kakao_button_label || ''}
            />
          </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" size="sm">
                  저장하기
                </Button>
              </div>
        </form>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
          공유 이미지
        </h2>
        <form action={updateShareImagesAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <ImageFileField
            id="share_og_image"
            name="share_og_image"
            label="OG 이미지"
            defaultValue={data.assets.share_og_image}
            hint="2MB 이하 이미지 파일"
          />
          <ImageFileField
            id="share_kakao_image"
            name="share_kakao_image"
            label="카카오 이미지"
            defaultValue={data.assets.share_kakao_image}
            hint="2MB 이하 이미지 파일"
          />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" size="sm">
              이미지 저장
            </Button>
          </div>
        </form>
      </SurfaceCard>
          </div>
        );
      case 'bgm':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">BGM 설정</h2>
        <form action={updateBgmAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-[14px]">
            <input type="checkbox" name="bgm_enabled" defaultChecked={data.bgm.enabled} />
            사용
          </label>
          <label className="flex items-center gap-2 text-[14px]">
            <input type="checkbox" name="bgm_auto_play" defaultChecked={data.bgm.auto_play} />
            자동 재생
          </label>
          <label className="flex items-center gap-2 text-[14px]">
            <input type="checkbox" name="bgm_loop" defaultChecked={data.bgm.loop} />
            반복 재생
          </label>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="bgm_audio_url">BGM URL</FieldLabel>
            <TextInput
              id="bgm_audio_url"
              name="bgm_audio_url"
              defaultValue={data.bgm.audio_url || ''}
            />
          </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" size="sm">
                    저장하기
                  </Button>
                </div>
        </form>
      </SurfaceCard>
        );
      case 'gallery':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">갤러리 이미지</h2>
        <div className="mt-4 flex flex-col gap-6">
          <div className="rounded-[12px] border border-[var(--border-light)] bg-white/70 p-4">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">갤러리 설정</h3>
            <form action={updateGalleryAction} className="mt-4 grid gap-4 md:grid-cols-2">
              <input type="hidden" name="gallery_id" value={data.gallery.id} />
              <div className="flex flex-col gap-2 md:col-span-2">
                <FieldLabel htmlFor="gallery_title">갤러리 타이틀</FieldLabel>
                <TextInput
                  id="gallery_title"
                  name="gallery_title"
                  defaultValue={data.gallery.title}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <FieldLabel htmlFor="gallery_description">설명</FieldLabel>
                <TextArea
                  id="gallery_description"
                  name="gallery_description"
                  defaultValue={data.gallery.description || ''}
                />
              </div>
              <label className="flex items-center gap-2 text-[14px] md:col-span-2">
                <input
                  type="checkbox"
                  name="gallery_autoplay"
                  defaultChecked={Boolean(data.gallery.autoplay)}
                />
                자동 재생
              </label>
              <div className="flex flex-col gap-2 md:col-span-2">
                <FieldLabel htmlFor="gallery_autoplay_delay">자동 재생 간격 (ms)</FieldLabel>
                <TextInput
                  id="gallery_autoplay_delay"
                  name="gallery_autoplay_delay"
                  type="number"
                  defaultValue={data.gallery.autoplay_delay ?? ''}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" size="sm">
                  갤러리 저장
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-[12px] border border-[var(--border-light)] bg-white/70 p-4">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">이미지 추가</h3>
              <form action={addGalleryImageAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <input type="hidden" name="gallery_id" value={data.gallery.id} />
                <ImageFileField
                  id="image_src"
                  name="image_src"
                  label="이미지 파일"
                  hint="2MB 이하 이미지 파일"
                  required
                />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" size="sm">
                    이미지 추가
                  </Button>
                </div>
              </form>
            </div>

            <div className="rounded-[12px] border border-[var(--border-light)] bg-white/70 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">이미지 목록</h3>
                <span className="text-[12px] text-[var(--text-muted)]">
                  총 {galleryItems.length}개
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--text-muted)]">
                <span>드래그로 순서를 변경하세요</span>
                <div className="flex items-center gap-2">
                  {orderSaved ? (
                    <span className="text-[var(--accent-rose-dark)]">저장됨</span>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      window.localStorage.setItem(
                        galleryOrderStorageKey,
                        JSON.stringify(galleryItems.map((image) => image.id))
                      );
                      setOrderSaved(true);
                      window.setTimeout(() => setOrderSaved(false), 1500);
                    }}
                  >
                    순서 저장
                  </Button>
                </div>
              </div>
              <div className="mt-3 divide-y divide-[var(--border-light)]">
                {galleryItems.length ? (
                  galleryItems.map((image) => (
                    <div
                      key={image.id}
                      className={`flex flex-col gap-3 rounded-[10px] px-2 py-3 transition md:flex-row md:items-center md:justify-between ${
                        draggedImageId === image.id ? 'bg-[var(--bg-secondary)] opacity-70' : ''
                      } ${
                        dragOverImageId === image.id ? 'ring-2 ring-[var(--accent-rose)]' : ''
                      }`}
                      draggable
                      onDragStart={() => setDraggedImageId(image.id)}
                      onDragEnd={() => {
                        setDraggedImageId(null);
                        setDragOverImageId(null);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragOverImageId(image.id);
                      }}
                      onDragLeave={() => {
                        if (dragOverImageId === image.id) {
                          setDragOverImageId(null);
                        }
                      }}
                      onDrop={() => {
                        if (!draggedImageId || draggedImageId === image.id) return;
                        setGalleryItems((prev) => {
                          const next = [...prev];
                          const fromIndex = next.findIndex((item) => item.id === draggedImageId);
                          const toIndex = next.findIndex((item) => item.id === image.id);
                          if (fromIndex < 0 || toIndex < 0) return prev;
                          const [moved] = next.splice(fromIndex, 1);
                          next.splice(toIndex, 0, moved);
                          return next;
                        });
                        setDraggedImageId(null);
                        setDragOverImageId(null);
                      }}
                    >
                      <div className="flex items-center gap-3 cursor-grab active:cursor-grabbing">
                        <div className="flex h-[48px] w-[28px] items-center justify-center rounded-[8px] border border-[var(--border-light)] bg-white/60 text-[14px] text-[var(--text-muted)]">
                          <span className="leading-none">⋮</span>
                        </div>
                        <Image
                          src={image.thumbnail || image.src}
                          alt={image.alt || '갤러리 이미지'}
                          width={64}
                          height={64}
                          className="h-[64px] w-[64px] rounded-[10px] object-cover"
                          unoptimized
                        />
                        <div>
                          <p className="text-[13px] font-medium text-[var(--text-primary)]">
                            {image.alt || '이미지'}
                          </p>
                          <p className="text-[12px] text-[var(--text-muted)]">
                            {getImageLabel(image.src)}
                          </p>
                        </div>
                      </div>
                      <form action={deleteGalleryImageAction} className="flex justify-end">
                        <input type="hidden" name="image_id" value={image.id} />
                        <Button type="submit" variant="danger" size="sm">
                          삭제
                        </Button>
                      </form>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-[12px] text-[var(--text-muted)]">
                    등록된 이미지가 없습니다
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SurfaceCard>
        );
      case 'accounts':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">어카운트</h2>
        <div className="mt-4 flex flex-col gap-6">
          <form action={updateAccountsAction} className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="accounts_title">타이틀</FieldLabel>
              <TextInput
                id="accounts_title"
                name="accounts_title"
                defaultValue={data.accounts.title}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <FieldLabel htmlFor="accounts_description">설명</FieldLabel>
              <TextArea
                id="accounts_description"
                name="accounts_description"
                defaultValue={data.accounts.description}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" size="sm">
                저장하기
              </Button>
            </div>
          </form>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { key: 'groom', label: '신랑', entries: groomEntries },
              { key: 'bride', label: '신부', entries: brideEntries },
            ].map((group) => {
              const groupKey = group.key as 'groom' | 'bride';
              return (
                <div key={group.key} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                      {group.label}
                    </h3>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setAccountFormOpen((prev) => ({
                          ...prev,
                          [groupKey]: !prev[groupKey],
                        }))
                      }
                    >
                      {accountFormOpen[groupKey] ? '닫기' : '+ 추가'}
                    </Button>
                  </div>

                {accountFormOpen[groupKey] ? (
                  <form action={addAccountEntryAction} className="grid gap-3 rounded-[12px] border border-[var(--border-light)] bg-white/60 px-4 py-3">
                    <input type="hidden" name="accounts_id" value={data.accounts.id} />
                    <input type="hidden" name="account_group_type" value={groupKey} />
                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor={`${group.key}-account-label`}>표시 라벨</FieldLabel>
                      <TextInput
                        id={`${group.key}-account-label`}
                        name="account_label"
                        placeholder="예: 신랑 아버지"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor={`${group.key}-account-bank`}>은행명</FieldLabel>
                      <TextInput id={`${group.key}-account-bank`} name="account_bank_name" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor={`${group.key}-account-number`}>계좌번호</FieldLabel>
                      <TextInput id={`${group.key}-account-number`} name="account_number" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor={`${group.key}-account-holder`}>예금주</FieldLabel>
                      <TextInput id={`${group.key}-account-holder`} name="account_holder" />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" size="sm">
                        계좌 추가
                      </Button>
                    </div>
                  </form>
                ) : null}

                <div className="grid gap-3">
                  {group.entries.length > 0 ? (
                    group.entries.map((entry) => (
                      <form
                        key={entry.id}
                        action={updateAccountEntryAction}
                        className="grid gap-3 rounded-[12px] border border-[var(--border-light)] bg-white/60 px-4 py-3"
                      >
                        <input type="hidden" name="account_entry_id" value={entry.id} />
                        <input type="hidden" name="account_group_type" value={groupKey} />
                        <div className="flex flex-col gap-2">
                          <FieldLabel>표시 라벨</FieldLabel>
                          <TextInput name="account_label" defaultValue={entry.label || ''} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <FieldLabel>은행명</FieldLabel>
                          <TextInput name="account_bank_name" defaultValue={entry.bank_name} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <FieldLabel>계좌번호</FieldLabel>
                          <TextInput name="account_number" defaultValue={entry.account_number} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <FieldLabel>예금주</FieldLabel>
                          <TextInput name="account_holder" defaultValue={entry.holder} />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button type="submit" size="sm">
                            저장
                          </Button>
                          <Button
                            type="submit"
                            size="sm"
                            variant="danger"
                            formAction={deleteAccountEntryAction}
                          >
                            삭제
                          </Button>
                        </div>
                      </form>
                    ))
                  ) : (
                    <div className="rounded-[12px] border border-[var(--border-light)] bg-white/50 px-4 py-6 text-center text-[12px] text-[var(--text-muted)]">
                      등록된 계좌가 없습니다
                    </div>
                  )}
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </SurfaceCard>
        );
      case 'guestbook':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">게스트북 설정</h2>
        <form action={updateGuestbookAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="guestbook_section_title">게스트북 섹션 타이틀</FieldLabel>
            <TextInput
              id="guestbook_section_title"
              name="guestbook_section_title"
              defaultValue={data.sectionTitles.guestbook}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="guestbook_privacy_notice">개인정보 안내</FieldLabel>
            <TextInput
              id="guestbook_privacy_notice"
              name="guestbook_privacy_notice"
              defaultValue={data.guestbook.privacy_notice}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="guestbook_retention_text">보관 안내</FieldLabel>
            <TextInput
              id="guestbook_retention_text"
              name="guestbook_retention_text"
              defaultValue={data.guestbook.retention_text}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="guestbook_display_mode">표시 방식</FieldLabel>
            <SelectField
              id="guestbook_display_mode"
              name="guestbook_display_mode"
              defaultValue={data.guestbook.display_mode}
            >
              <option value="recent">최근</option>
              <option value="paginated">페이지네이션</option>
            </SelectField>
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="guestbook_page_size">노출 개수</FieldLabel>
            <TextInput
              id="guestbook_page_size"
              name="guestbook_page_size"
              type="number"
              defaultValue={data.guestbook.page_size}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="guestbook_recent_notice">최근 노출 안내</FieldLabel>
            <TextInput
              id="guestbook_recent_notice"
              name="guestbook_recent_notice"
              defaultValue={data.guestbook.recent_notice}
            />
          </div>
          <label className="flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              name="guestbook_enable_password"
              defaultChecked={data.guestbook.enable_password}
            />
            비밀번호 사용
          </label>
          <label className="flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              name="guestbook_enable_edit"
              defaultChecked={data.guestbook.enable_edit}
            />
            수정 허용
          </label>
          <label className="flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              name="guestbook_enable_delete"
              defaultChecked={data.guestbook.enable_delete}
            />
            삭제 허용
          </label>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" size="sm">
              저장하기
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/70">
            <div className="grid grid-cols-3 gap-2 border-b border-[var(--border-light)] px-4 py-2 text-[12px] font-semibold text-[var(--text-secondary)]">
              <span>이름</span>
              <span>메시지</span>
              <span>작성일</span>
            </div>
            <div className="divide-y divide-[var(--border-light)]">
              {(() => {
                const pageSize = 6;
                const totalPages = Math.max(
                  1,
                  Math.ceil(data.guestbookEntries.length / pageSize)
                );
                const currentPage = Math.min(guestbookPage, totalPages);
                const startIndex = (currentPage - 1) * pageSize;
                const pageItems = data.guestbookEntries.slice(
                  startIndex,
                  startIndex + pageSize
                );

                return pageItems.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-3 gap-2 px-4 py-3 text-[13px] text-[var(--text-primary)]"
                  >
                    <span className="font-medium">{entry.name}</span>
                    <span className="line-clamp-2 text-[var(--text-secondary)]">
                      {entry.message}
                    </span>
                    <span className="text-[var(--text-muted)]">
                      {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[12px] text-[var(--text-muted)]">
            <span>총 {data.guestbookEntries.length}건</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuestbookPage((prev) => Math.max(1, prev - 1))}
                className="rounded-[8px] border border-[var(--border-light)] px-2 py-1 text-[12px] text-[var(--text-secondary)]"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() =>
                  setGuestbookPage((prev) =>
                    Math.min(
                      Math.max(1, Math.ceil(data.guestbookEntries.length / 6)),
                      prev + 1
                    )
                  )
                }
                className="rounded-[8px] border border-[var(--border-light)] px-2 py-1 text-[12px] text-[var(--text-secondary)]"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </SurfaceCard>
        );
      case 'rsvp':
        return (
          <SurfaceCard className="p-6">
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
              RSVP 응답 목록
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              <form action={updateRsvpTitleAction} className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="rsvp_section_title">RSVP 섹션 타이틀</FieldLabel>
                  <TextInput
                    id="rsvp_section_title"
                    name="rsvp_section_title"
                    defaultValue={data.sectionTitles.rsvp}
                  />
                </div>
                <Button type="submit" size="sm" className="self-end">
                  타이틀 저장
                </Button>
              </form>
              <div className="overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/70">
                <div className="grid grid-cols-5 gap-2 border-b border-[var(--border-light)] px-4 py-2 text-[12px] font-semibold text-[var(--text-secondary)]">
                  <span>이름</span>
                  <span>참석</span>
                  <span>인원</span>
                  <span>식사</span>
                  <span>작성일</span>
                </div>
                <div className="divide-y divide-[var(--border-light)]">
                  {(() => {
                    const pageSize = 8;
                    const totalPages = Math.max(
                      1,
                      Math.ceil(data.rsvpResponses.length / pageSize)
                    );
                    const currentPage = Math.min(rsvpPage, totalPages);
                    const startIndex = (currentPage - 1) * pageSize;
                    const pageItems = data.rsvpResponses.slice(
                      startIndex,
                      startIndex + pageSize
                    );

                    return pageItems.map((entry) => (
                      <div
                        key={entry.id}
                        className="grid grid-cols-5 gap-2 px-4 py-3 text-[13px] text-[var(--text-primary)]"
                      >
                        <span className="font-medium">{entry.name}</span>
                        <span>{entry.attendance}</span>
                        <span>{entry.companions || '-'}</span>
                        <span>{entry.meal || '-'}</span>
                        <span className="text-[var(--text-muted)]">
                          {new Date(entry.submittedAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              <div className="flex items-center justify-between text-[12px] text-[var(--text-muted)]">
                <span>
                  총 {data.rsvpResponses.length}건
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpPage((prev) => Math.max(1, prev - 1))}
                    className="rounded-[8px] border border-[var(--border-light)] px-2 py-1 text-[12px] text-[var(--text-secondary)]"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setRsvpPage((prev) =>
                        Math.min(
                          Math.max(1, Math.ceil(data.rsvpResponses.length / 8)),
                          prev + 1
                        )
                      )
                    }
                    className="rounded-[8px] border border-[var(--border-light)] px-2 py-1 text-[12px] text-[var(--text-secondary)]"
                  >
                    다음
                  </button>
                </div>
              </div>
            </div>
          </SurfaceCard>
        );
      case 'closing':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">마무리 인삿말</h2>
        <form action={updateClosingAction} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="closing_message">메시지</FieldLabel>
            <TextArea id="closing_message" name="closing_message" defaultValue={data.closing.message} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="closing_copyright">저작권 표기</FieldLabel>
            <TextInput
              id="closing_copyright"
              name="closing_copyright"
              defaultValue={data.closing.copyright || ''}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm">
              저장하기
            </Button>
          </div>
        </form>
      </SurfaceCard>
        );
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
                className={`cursor-pointer whitespace-nowrap rounded-[10px] px-3 py-2 text-[13px] transition ${
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
    </div>
  );
};
