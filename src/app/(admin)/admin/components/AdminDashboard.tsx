'use client';

import Image from 'next/image';
import { useState } from 'react';
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
  updateEventGuidanceAction,
  updateIntroAction,
  updateLoadingAction,
  updateLocationAction,
  updateBasicInfoAction,
  updateProfileAction,
  updateWeddingInfoAction,
  updateTransportationAction,
} from '@/app/(admin)/admin/actions/content';
import { updateGreetingAction } from '@/app/(admin)/admin/actions/greeting';
import { updateGuestbookAction } from '@/app/(admin)/admin/actions/guestbook';
import {
  addRsvpFieldAction,
  deleteRsvpFieldAction,
  updateRsvpAction,
  updateRsvpFieldAction,
} from '@/app/(admin)/admin/actions/rsvp';
import { updateShareAction } from '@/app/(admin)/admin/actions/share';
import { OverviewCard } from '@/app/(admin)/admin/components/OverviewCard';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SelectField } from '@/components/ui/SelectField';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';

type AdminDashboardProps = {
  data: AdminDashboardData;
};

type ImagePreviewFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
  previewClassName?: string;
};

/**
 * 이미지 URL 입력 + 로컬 미리보기
 * @param props ImagePreviewFieldProps
 * @returns JSX.Element
 */
const ImagePreviewField = ({
  id,
  name,
  label,
  defaultValue = '',
  hint,
  previewClassName = 'h-[360px]',
}: ImagePreviewFieldProps) => {
  const [value, setValue] = useState<string>(defaultValue || '');
  const [hasError, setHasError] = useState(false);
  const showPreview = value.trim().length > 0 && !hasError;

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <TextInput
        id={id}
        name={name}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setHasError(false);
        }}
      />
      {hint ? <p className="text-[11px] text-[var(--text-muted)]">{hint}</p> : null}
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
                onError={() => setHasError(true)}
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
  const tabs = [
    { id: 'overview', label: '요약' },
    { id: 'basic', label: '기본 정보' },
    { id: 'loading', label: '로딩' },
    { id: 'intro', label: '인트로' },
    { id: 'couple', label: '커플 섹션' },
    { id: 'wedding', label: '결혼 정보' },
    { id: 'location', label: '오시는 길' },
    { id: 'gallery', label: '갤러리' },
    { id: 'greeting', label: '인사말' },
    { id: 'accounts', label: '어카운트' },
    { id: 'guestbook', label: '게스트북' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'share', label: 'share' },
    { id: 'closing', label: '마무리 인삿말' },
    { id: 'bgm', label: 'BGM' },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'overview');

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
                  <FieldLabel htmlFor="loading_min_duration">최소 노출 (ms)</FieldLabel>
                  <TextInput
                    id="loading_min_duration"
                    name="loading_min_duration"
                    type="number"
                    defaultValue={data.loading.min_duration}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="loading_additional_duration">추가 노출 (ms)</FieldLabel>
                  <TextInput
                    id="loading_additional_duration"
                    name="loading_additional_duration"
                    type="number"
                    defaultValue={data.loading.additional_duration}
                  />
                </div>
                <Button type="submit" size="full" className="md:col-span-2">
                  저장하기
                </Button>
              </form>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                로딩 이미지
              </h2>
              <form action={updateLoadingImageAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <ImagePreviewField
                  id="loading_image"
                  name="loading_image"
                  label="로딩 이미지 URL"
                  defaultValue={data.assets.loading_image}
                />
                <Button type="submit" size="full" className="md:col-span-2">
                  이미지 저장
                </Button>
              </form>
            </SurfaceCard>
          </div>
        );
      case 'intro':
        return (
          <div className="flex flex-col gap-6">
            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                인트로
              </h2>
              <form action={updateIntroAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="intro_quote">메인 문구</FieldLabel>
                  <TextInput id="intro_quote" name="intro_quote" defaultValue={data.intro.quote} />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="intro_sub_quote">서브 문구</FieldLabel>
                  <TextInput
                    id="intro_sub_quote"
                    name="intro_sub_quote"
                    defaultValue={data.intro.sub_quote || ''}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="intro_theme_dark_background">다크 배경</FieldLabel>
                  <TextInput
                    id="intro_theme_dark_background"
                    name="intro_theme_dark_background"
                    defaultValue={data.intro.theme_dark_background}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="intro_theme_light_background">라이트 배경</FieldLabel>
                  <TextInput
                    id="intro_theme_light_background"
                    name="intro_theme_light_background"
                    defaultValue={data.intro.theme_light_background}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="intro_theme_text_color">텍스트 컬러</FieldLabel>
                  <TextInput
                    id="intro_theme_text_color"
                    name="intro_theme_text_color"
                    defaultValue={data.intro.theme_text_color}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="intro_theme_accent_color">포인트 컬러</FieldLabel>
                  <TextInput
                    id="intro_theme_accent_color"
                    name="intro_theme_accent_color"
                    defaultValue={data.intro.theme_accent_color}
                  />
                </div>
                <Button type="submit" size="full" className="md:col-span-2">
                  저장하기
                </Button>
              </form>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                메인 이미지
              </h2>
              <form action={updateHeroImageAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <ImagePreviewField
                  id="hero_image"
                  name="hero_image"
                  label="메인 이미지 URL"
                  defaultValue={data.assets.hero_image}
                />
                <Button type="submit" size="full" className="md:col-span-2">
                  이미지 저장
                </Button>
              </form>
            </SurfaceCard>
          </div>
        );
      case 'basic':
        return (
          <SurfaceCard className="p-6">
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">기본 정보</h2>
            <form action={updateBasicInfoAction} className="mt-4 grid gap-4 md:grid-cols-2">
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
              <Button type="submit" size="full" className="md:col-span-2">
                저장하기
              </Button>
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
              <ImagePreviewField
                id="groom_profile_image"
                name="groom_profile_image"
                label="신랑 프로필 이미지"
                defaultValue={data.profile.groom_profile_image || ''}
                previewClassName="h-[240px]"
              />
              <ImagePreviewField
                id="bride_profile_image"
                name="bride_profile_image"
                label="신부 프로필 이미지"
                defaultValue={data.profile.bride_profile_image || ''}
                previewClassName="h-[240px]"
              />
              <Button type="submit" size="full" className="md:col-span-2">
                저장하기
              </Button>
            </form>
          </SurfaceCard>
        );
      case 'wedding':
        return (
          <div className="flex flex-col gap-6">
            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                결혼 정보
              </h2>
              <form action={updateWeddingInfoAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="event_title">행사 타이틀</FieldLabel>
                  <TextInput id="event_title" name="event_title" defaultValue={data.event.title} />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="wedding_date_time">예식 일시</FieldLabel>
                  <TextInput
                    id="wedding_date_time"
                    name="wedding_date_time"
                    defaultValue={data.event.date_time}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="event_date_text">표시용 날짜</FieldLabel>
                  <TextInput
                    id="event_date_text"
                    name="event_date_text"
                    defaultValue={data.event.date_text}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="venue">예식장</FieldLabel>
                  <TextInput id="venue" name="venue" defaultValue={data.event.venue} />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="address">주소</FieldLabel>
                  <TextInput id="address" name="address" defaultValue={data.event.address} />
                </div>
                <Button type="submit" size="full" className="md:col-span-2">
                  저장하기
                </Button>
              </form>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                행사 안내
              </h2>
              <form action={updateEventGuidanceAction} className="mt-4 flex flex-col gap-4">
                <input type="hidden" name="event_id" value={data.event.id} />
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="event_directions">오시는 길 (줄바꿈)</FieldLabel>
                  <TextArea
                    id="event_directions"
                    name="event_directions"
                    className="min-h-[140px]"
                    defaultValue={(data.eventGuidance.directions || []).join('\n')}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="event_notices">안내 문구 (줄바꿈)</FieldLabel>
                  <TextArea
                    id="event_notices"
                    name="event_notices"
                    className="min-h-[140px]"
                    defaultValue={(data.eventGuidance.notices || []).join('\n')}
                  />
                </div>
                <Button type="submit" size="full">
                  저장하기
                </Button>
              </form>
            </SurfaceCard>
          </div>
        );
      case 'location':
        return (
          <div className="flex flex-col gap-6">
            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                오시는 길
              </h2>
              <form action={updateLocationAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="location_place_name">장소명</FieldLabel>
                  <TextInput
                    id="location_place_name"
                    name="location_place_name"
                    defaultValue={data.location.place_name}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="location_address">주소</FieldLabel>
                  <TextInput
                    id="location_address"
                    name="location_address"
                    defaultValue={data.location.address}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="location_latitude">위도</FieldLabel>
                  <TextInput
                    id="location_latitude"
                    name="location_latitude"
                    defaultValue={data.location.latitude}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="location_longitude">경도</FieldLabel>
                  <TextInput
                    id="location_longitude"
                    name="location_longitude"
                    defaultValue={data.location.longitude}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="location_nav_naver">네이버 지도 URL</FieldLabel>
                  <TextInput
                    id="location_nav_naver"
                    name="location_nav_naver"
                    defaultValue={data.location.navigation_naver_web || ''}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="location_nav_kakao">카카오맵 URL</FieldLabel>
                  <TextInput
                    id="location_nav_kakao"
                    name="location_nav_kakao"
                    defaultValue={data.location.navigation_kakao_web || ''}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="location_nav_tmap">티맵 URL</FieldLabel>
                  <TextInput
                    id="location_nav_tmap"
                    name="location_nav_tmap"
                    defaultValue={data.location.navigation_tmap_web || ''}
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
                <Button type="submit" size="full" className="md:col-span-2">
                  저장하기
                </Button>
              </form>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                교통 안내
              </h2>
              <form action={updateTransportationAction} className="mt-4 flex flex-col gap-4">
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
                <Button type="submit" size="full">
                  저장하기
                </Button>
              </form>
            </SurfaceCard>
          </div>
        );
      case 'greeting':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">인사말</h2>
        <form action={updateGreetingAction} className="mt-4 flex flex-col gap-4">
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
          <Button type="submit" size="full">
            저장하기
          </Button>
        </form>
      </SurfaceCard>
        );
      case 'share':
        return (
          <div className="flex flex-col gap-6">
            <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">공유 설정</h2>
        <form action={updateShareAction} className="mt-4 grid gap-4 md:grid-cols-2">
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
          <ImagePreviewField
            id="share_image_url"
            name="share_image_url"
            label="공유 이미지"
            defaultValue={data.share.image_url}
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
          <ImagePreviewField
            id="kakao_image_url"
            name="kakao_image_url"
            label="카카오 이미지"
            defaultValue={data.share.kakao_image_url || ''}
          />
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="kakao_button_label">카카오 버튼 라벨</FieldLabel>
            <TextInput
              id="kakao_button_label"
              name="kakao_button_label"
              defaultValue={data.share.kakao_button_label || ''}
            />
          </div>
          <Button type="submit" size="full" className="md:col-span-2">
            저장하기
          </Button>
        </form>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
          공유 이미지
        </h2>
        <form action={updateShareImagesAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <ImagePreviewField
            id="share_og_image"
            name="share_og_image"
            label="OG 이미지 URL"
            defaultValue={data.assets.share_og_image}
          />
          <ImagePreviewField
            id="share_kakao_image"
            name="share_kakao_image"
            label="카카오 이미지 URL"
            defaultValue={data.assets.share_kakao_image}
          />
          <Button type="submit" size="full" className="md:col-span-2">
            이미지 저장
          </Button>
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
            <FieldLabel htmlFor="bgm_title">BGM 제목</FieldLabel>
            <TextInput id="bgm_title" name="bgm_title" defaultValue={data.bgm.title || ''} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="bgm_audio_url">BGM URL</FieldLabel>
            <TextInput
              id="bgm_audio_url"
              name="bgm_audio_url"
              defaultValue={data.bgm.audio_url || ''}
            />
          </div>
          <Button type="submit" size="full" className="md:col-span-2">
            저장하기
          </Button>
        </form>
      </SurfaceCard>
        );
      case 'gallery':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">갤러리 이미지</h2>
        <div className="mt-4 flex flex-col gap-4">
          <form action={updateGalleryAction} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="gallery_id" value={data.gallery.id} />
            <div className="flex flex-col gap-2">
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
            <label className="flex items-center gap-2 text-[14px]">
              <input
                type="checkbox"
                name="gallery_autoplay"
                defaultChecked={Boolean(data.gallery.autoplay)}
              />
              자동 재생
            </label>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="gallery_autoplay_delay">자동 재생 간격 (ms)</FieldLabel>
              <TextInput
                id="gallery_autoplay_delay"
                name="gallery_autoplay_delay"
                defaultValue={data.gallery.autoplay_delay ?? ''}
              />
            </div>
            <Button type="submit" size="full" className="md:col-span-2">
              갤러리 저장
            </Button>
          </form>

          <form action={addGalleryImageAction} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="gallery_id" value={data.gallery.id} />
            <ImagePreviewField id="image_src" name="image_src" label="이미지 URL" />
            <ImagePreviewField
              id="image_thumbnail"
              name="image_thumbnail"
              label="썸네일 URL"
              previewClassName="h-[120px]"
            />
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="image_alt">대체 텍스트</FieldLabel>
              <TextInput id="image_alt" name="image_alt" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="sort_order">정렬 순서</FieldLabel>
              <TextInput id="sort_order" name="sort_order" />
            </div>
            <Button type="submit" size="full" className="md:col-span-2">
              이미지 추가
            </Button>
          </form>
          <div className="grid gap-3">
            {data.galleryImages.map((image) => (
              <div
                key={image.id}
                className="flex flex-col gap-3 rounded-[12px] border border-[var(--border-light)] bg-white/60 px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
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
                    <p className="text-[12px] text-[var(--text-muted)]">{image.src}</p>
                  </div>
                </div>
                <form action={deleteGalleryImageAction}>
                  <input type="hidden" name="image_id" value={image.id} />
                  <Button type="submit" variant="danger" size="sm">
                    삭제
                  </Button>
                </form>
              </div>
            ))}
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
            <Button type="submit" size="full" className="md:col-span-2">
              저장하기
            </Button>
          </form>

          <form action={addAccountEntryAction} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="accounts_id" value={data.accounts.id} />
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="account_group_type">구분</FieldLabel>
              <SelectField id="account_group_type" name="account_group_type" defaultValue="groom">
                <option value="groom">신랑</option>
                <option value="bride">신부</option>
              </SelectField>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="account_bank_name">은행명</FieldLabel>
              <TextInput id="account_bank_name" name="account_bank_name" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="account_number">계좌번호</FieldLabel>
              <TextInput id="account_number" name="account_number" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="account_holder">예금주</FieldLabel>
              <TextInput id="account_holder" name="account_holder" />
            </div>
            <Button type="submit" size="full" className="md:col-span-2">
              계좌 추가
            </Button>
          </form>

          <div className="grid gap-3">
            {data.accountEntries.map((entry) => (
              <form
                key={entry.id}
                action={updateAccountEntryAction}
                className="grid gap-3 rounded-[12px] border border-[var(--border-light)] bg-white/60 px-4 py-3 md:grid-cols-2"
              >
                <input type="hidden" name="account_entry_id" value={entry.id} />
                <div className="flex flex-col gap-2">
                  <FieldLabel>구분</FieldLabel>
                  <SelectField name="account_group_type" defaultValue={entry.group_type}>
                    <option value="groom">신랑</option>
                    <option value="bride">신부</option>
                  </SelectField>
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
                <div className="flex items-center justify-end gap-2 md:col-span-2">
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
            ))}
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
          <Button type="submit" size="full" className="md:col-span-2">
            저장하기
          </Button>
        </form>
      </SurfaceCard>
        );
      case 'rsvp':
        return (
          <div className="flex flex-col gap-6">
            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                RSVP 설정
              </h2>
              <form action={updateRsvpAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-2 text-[14px] md:col-span-2">
                  <input type="checkbox" name="rsvp_enabled" defaultChecked={data.rsvp.enabled} />
                  사용
                </label>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="rsvp_deadline">응답 마감</FieldLabel>
                  <TextInput
                    id="rsvp_deadline"
                    name="rsvp_deadline"
                    defaultValue={data.rsvp.deadline || ''}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="rsvp_consent_title">동의 타이틀</FieldLabel>
                  <TextInput
                    id="rsvp_consent_title"
                    name="rsvp_consent_title"
                    defaultValue={data.rsvp.consent_title}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="rsvp_consent_description">동의 설명</FieldLabel>
                  <TextArea
                    id="rsvp_consent_description"
                    name="rsvp_consent_description"
                    defaultValue={data.rsvp.consent_description}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="rsvp_consent_retention">보관 기간</FieldLabel>
                  <TextArea
                    id="rsvp_consent_retention"
                    name="rsvp_consent_retention"
                    defaultValue={data.rsvp.consent_retention}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel htmlFor="rsvp_consent_notice">동의 안내</FieldLabel>
                  <TextArea
                    id="rsvp_consent_notice"
                    name="rsvp_consent_notice"
                    defaultValue={data.rsvp.consent_notice}
                  />
                </div>
                <Button type="submit" size="full" className="md:col-span-2">
                  저장하기
                </Button>
              </form>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                RSVP 입력 필드
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                <form action={addRsvpFieldAction} className="grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="rsvp_id" value={data.rsvp.id} />
                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="rsvp_field_key">키</FieldLabel>
                    <SelectField id="rsvp_field_key" name="rsvp_field_key">
                      <option value="attendance">attendance</option>
                      <option value="meal">meal</option>
                      <option value="companions">companions</option>
                      <option value="notes">notes</option>
                    </SelectField>
                  </div>
                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="rsvp_field_label">라벨</FieldLabel>
                    <TextInput id="rsvp_field_label" name="rsvp_field_label" />
                  </div>
                  <label className="flex items-center gap-2 text-[14px]">
                    <input type="checkbox" name="rsvp_field_required" />
                    필수
                  </label>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <FieldLabel htmlFor="rsvp_field_placeholder">플레이스홀더</FieldLabel>
                    <TextInput id="rsvp_field_placeholder" name="rsvp_field_placeholder" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <FieldLabel htmlFor="rsvp_field_options">옵션 (줄바꿈)</FieldLabel>
                    <TextArea
                      id="rsvp_field_options"
                      name="rsvp_field_options"
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="rsvp_field_sort_order">정렬 순서</FieldLabel>
                    <TextInput
                      id="rsvp_field_sort_order"
                      name="rsvp_field_sort_order"
                      type="number"
                    />
                  </div>
                  <Button type="submit" size="full" className="md:col-span-2">
                    필드 추가
                  </Button>
                </form>

                <div className="grid gap-3">
                  {data.rsvpFields.map((field) => (
                    <form
                      key={field.id}
                      action={updateRsvpFieldAction}
                      className="grid gap-3 rounded-[12px] border border-[var(--border-light)] bg-white/60 px-4 py-3 md:grid-cols-2"
                    >
                      <input type="hidden" name="rsvp_field_id" value={field.id} />
                      <div className="flex flex-col gap-2">
                        <FieldLabel>키</FieldLabel>
                        <SelectField name="rsvp_field_key" defaultValue={field.field_key}>
                          <option value="attendance">attendance</option>
                          <option value="meal">meal</option>
                          <option value="companions">companions</option>
                          <option value="notes">notes</option>
                        </SelectField>
                      </div>
                      <div className="flex flex-col gap-2">
                        <FieldLabel>라벨</FieldLabel>
                        <TextInput name="rsvp_field_label" defaultValue={field.label} />
                      </div>
                      <label className="flex items-center gap-2 text-[14px]">
                        <input
                          type="checkbox"
                          name="rsvp_field_required"
                          defaultChecked={field.required}
                        />
                        필수
                      </label>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <FieldLabel>플레이스홀더</FieldLabel>
                        <TextInput
                          name="rsvp_field_placeholder"
                          defaultValue={field.placeholder || ''}
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <FieldLabel>옵션 (줄바꿈)</FieldLabel>
                        <TextArea
                          name="rsvp_field_options"
                          className="min-h-[120px]"
                          defaultValue={(field.options || []).join('\n')}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <FieldLabel>정렬 순서</FieldLabel>
                        <TextInput
                          name="rsvp_field_sort_order"
                          type="number"
                          defaultValue={field.sort_order ?? ''}
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 md:col-span-2">
                        <Button type="submit" size="sm">
                          저장
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          variant="danger"
                          formAction={deleteRsvpFieldAction}
                        >
                          삭제
                        </Button>
                      </div>
                    </form>
                  ))}
                </div>
              </div>
            </SurfaceCard>
          </div>
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
            <FieldLabel htmlFor="closing_signature">서명</FieldLabel>
            <TextInput
              id="closing_signature"
              name="closing_signature"
              defaultValue={data.closing.signature || ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="closing_copyright">저작권 표기</FieldLabel>
            <TextInput
              id="closing_copyright"
              name="closing_copyright"
              defaultValue={data.closing.copyright || ''}
            />
          </div>
          <Button type="submit" size="full">
            저장하기
          </Button>
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
