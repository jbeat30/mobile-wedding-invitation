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
  updateAssetsAction,
  updateGalleryAction,
} from '@/app/(admin)/admin/actions/assets';
import { updateBgmAction } from '@/app/(admin)/admin/actions/bgm';
import {
  updateClosingAction,
  updateEventGuidanceAction,
  updateIntroAction,
  updateLoadingAction,
  updateLocationAction,
  updateProfileAction,
  updateTransportationAction,
} from '@/app/(admin)/admin/actions/content';
import {
  addFamilyLineAction,
  addFamilyMemberAction,
  deleteFamilyLineAction,
  deleteFamilyMemberAction,
  updateFamilyLineAction,
  updateFamilyMemberAction,
} from '@/app/(admin)/admin/actions/family';
import { updateGreetingAction } from '@/app/(admin)/admin/actions/greeting';
import { updateGuestbookAction } from '@/app/(admin)/admin/actions/guestbook';
import {
  addRsvpFieldAction,
  deleteRsvpFieldAction,
  updateRsvpAction,
  updateRsvpFieldAction,
} from '@/app/(admin)/admin/actions/rsvp';
import { updateShareAction } from '@/app/(admin)/admin/actions/share';
import { updateThemeAction } from '@/app/(admin)/admin/actions/theme';
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
  previewClassName = 'h-[160px]',
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
    { id: 'loading', label: '로딩' },
    { id: 'intro', label: '인트로' },
    { id: 'profile', label: '기본 정보' },
    { id: 'family-lines', label: '가족 라인' },
    { id: 'family-members', label: '가족 구성원' },
    { id: 'event-guidance', label: '행사 안내' },
    { id: 'location', label: '위치 정보' },
    { id: 'transportation', label: '교통 안내' },
    { id: 'theme', label: '테마' },
    { id: 'assets', label: '이미지 에셋' },
    { id: 'greeting', label: '인사말' },
    { id: 'share', label: '공유 설정' },
    { id: 'bgm', label: 'BGM' },
    { id: 'gallery', label: '갤러리' },
    { id: 'accounts', label: '계좌 안내' },
    { id: 'guestbook', label: '방명록' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'rsvp-fields', label: 'RSVP 필드' },
    { id: 'closing', label: '클로징' },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewCard />;
      case 'loading':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">로딩 설정</h2>
        <form action={updateLoadingAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-[14px] md:col-span-2">
            <input type="checkbox" name="loading_enabled" defaultChecked={data.loading.enabled} />
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
        );
      case 'intro':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">인트로</h2>
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
        );
      case 'profile':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">기본 정보</h2>
        <form action={updateProfileAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="groom_first_name">신랑 이름</FieldLabel>
            <TextInput
              id="groom_first_name"
              name="groom_first_name"
              defaultValue={data.profile.groom_first_name}
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
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="groom_last_name">신랑 성</FieldLabel>
            <TextInput
              id="groom_last_name"
              name="groom_last_name"
              defaultValue={data.profile.groom_last_name}
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
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="groom_role">신랑 역할</FieldLabel>
            <TextInput
              id="groom_role"
              name="groom_role"
              defaultValue={data.profile.groom_role || ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="bride_role">신부 역할</FieldLabel>
            <TextInput
              id="bride_role"
              name="bride_role"
              defaultValue={data.profile.bride_role || ''}
            />
          </div>
          <ImagePreviewField
            id="groom_profile_image"
            name="groom_profile_image"
            label="신랑 프로필 이미지"
            defaultValue={data.profile.groom_profile_image || ''}
            previewClassName="h-[140px]"
          />
          <ImagePreviewField
            id="bride_profile_image"
            name="bride_profile_image"
            label="신부 프로필 이미지"
            defaultValue={data.profile.bride_profile_image || ''}
            previewClassName="h-[140px]"
          />
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="wedding_date_time">예식 일시</FieldLabel>
            <TextInput
              id="wedding_date_time"
              name="wedding_date_time"
              defaultValue={data.profile.wedding_date_time}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="event_title">행사 타이틀</FieldLabel>
            <TextInput id="event_title" name="event_title" defaultValue={data.event.title} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="event_date_text">표시용 날짜</FieldLabel>
            <TextInput
              id="event_date_text"
              name="event_date_text"
              defaultValue={data.event.date_text}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="venue">예식장</FieldLabel>
            <TextInput id="venue" name="venue" defaultValue={data.profile.venue} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="address">주소</FieldLabel>
            <TextInput id="address" name="address" defaultValue={data.profile.address} />
          </div>
          <Button type="submit" size="full" className="md:col-span-2">
            저장하기
          </Button>
        </form>
      </SurfaceCard>
        );
      case 'family-lines':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">가족 라인</h2>
        <div className="mt-4 flex flex-col gap-4">
          <form action={addFamilyLineAction} className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="family_subject">대상</FieldLabel>
              <SelectField id="family_subject" name="family_subject" defaultValue="groom">
                <option value="groom">신랑</option>
                <option value="bride">신부</option>
              </SelectField>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <FieldLabel htmlFor="family_relationship_label">관계 라벨</FieldLabel>
              <TextInput id="family_relationship_label" name="family_relationship_label" />
            </div>
            <Button type="submit" size="full" className="md:col-span-3">
              라인 추가
            </Button>
          </form>

          <div className="grid gap-3">
            {data.familyLines.map((line) => (
              <form
                key={line.id}
                action={updateFamilyLineAction}
                className="grid gap-3 rounded-[12px] border border-[var(--border-light)] bg-white/60 px-4 py-3 md:grid-cols-3"
              >
                <input type="hidden" name="family_line_id" value={line.id} />
                <div className="flex flex-col gap-2">
                  <FieldLabel>대상</FieldLabel>
                  <SelectField name="family_subject" defaultValue={line.subject}>
                    <option value="groom">신랑</option>
                    <option value="bride">신부</option>
                  </SelectField>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel>관계 라벨</FieldLabel>
                  <TextInput name="family_relationship_label" defaultValue={line.relationship_label} />
                </div>
                <div className="flex items-center justify-end gap-2 md:col-span-3">
                  <Button type="submit" size="sm">
                    저장
                  </Button>
                  <Button type="submit" size="sm" variant="danger" formAction={deleteFamilyLineAction}>
                    삭제
                  </Button>
                </div>
              </form>
            ))}
          </div>
        </div>
      </SurfaceCard>
        );
      case 'family-members':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">가족 구성원</h2>
        <div className="mt-4 flex flex-col gap-4">
          <form action={addFamilyMemberAction} className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-2 md:col-span-2">
              <FieldLabel htmlFor="family_line_id">가족 라인</FieldLabel>
              <SelectField id="family_line_id" name="family_line_id">
                {data.familyLines.length ? (
                  data.familyLines.map((line) => (
                    <option key={line.id} value={line.id}>
                      {line.subject === 'groom' ? '신랑' : '신부'} · {line.relationship_label}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    가족 라인을 먼저 추가해주세요
                  </option>
                )}
              </SelectField>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="family_member_role">역할</FieldLabel>
              <SelectField id="family_member_role" name="family_member_role" defaultValue="father">
                <option value="father">부</option>
                <option value="mother">모</option>
                <option value="guardian">보호자</option>
                <option value="other">기타</option>
              </SelectField>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="family_member_name">이름</FieldLabel>
              <TextInput id="family_member_name" name="family_member_name" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="family_member_prefix">접두어</FieldLabel>
              <TextInput id="family_member_prefix" name="family_member_prefix" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="family_member_suffix">접미어</FieldLabel>
              <TextInput id="family_member_suffix" name="family_member_suffix" />
            </div>
            <Button type="submit" size="full" className="md:col-span-4">
              구성원 추가
            </Button>
          </form>

          <div className="grid gap-3">
            {data.familyMembers.map((member) => (
              <form
                key={member.id}
                action={updateFamilyMemberAction}
                className="grid gap-3 rounded-[12px] border border-[var(--border-light)] bg-white/60 px-4 py-3 md:grid-cols-4"
              >
                <input type="hidden" name="family_member_id" value={member.id} />
                <div className="flex flex-col gap-2 md:col-span-2">
                  <FieldLabel>가족 라인</FieldLabel>
                  <SelectField name="family_line_id" defaultValue={member.family_line_id}>
                    {data.familyLines.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.subject === 'groom' ? '신랑' : '신부'} · {item.relationship_label}
                      </option>
                    ))}
                  </SelectField>
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel>역할</FieldLabel>
                  <SelectField name="family_member_role" defaultValue={member.role}>
                    <option value="father">부</option>
                    <option value="mother">모</option>
                    <option value="guardian">보호자</option>
                    <option value="other">기타</option>
                  </SelectField>
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel>이름</FieldLabel>
                  <TextInput name="family_member_name" defaultValue={member.name} />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel>접두어</FieldLabel>
                  <TextInput name="family_member_prefix" defaultValue={member.prefix || ''} />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel>접미어</FieldLabel>
                  <TextInput name="family_member_suffix" defaultValue={member.suffix || ''} />
                </div>
                <div className="flex items-center justify-end gap-2 md:col-span-4">
                  <Button type="submit" size="sm">
                    저장
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    variant="danger"
                    formAction={deleteFamilyMemberAction}
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
      case 'event-guidance':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">행사 안내</h2>
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
        );
      case 'location':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">위치 정보</h2>
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
        );
      case 'transportation':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">교통 안내</h2>
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
        );
      case 'theme':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">테마 컬러</h2>
        <form action={updateThemeAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="fonts_serif">서체 Serif</FieldLabel>
            <TextInput id="fonts_serif" name="fonts_serif" defaultValue={data.theme.fonts_serif} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="fonts_serif_en">서체 Serif (EN)</FieldLabel>
            <TextInput
              id="fonts_serif_en"
              name="fonts_serif_en"
              defaultValue={data.theme.fonts_serif_en}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="fonts_sans">서체 Sans</FieldLabel>
            <TextInput id="fonts_sans" name="fonts_sans" defaultValue={data.theme.fonts_sans} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="bg_primary">배경 기본</FieldLabel>
            <TextInput id="bg_primary" name="bg_primary" defaultValue={data.theme.bg_primary} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="bg_secondary">배경 보조</FieldLabel>
            <TextInput id="bg_secondary" name="bg_secondary" defaultValue={data.theme.bg_secondary} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="text_primary">메인 텍스트</FieldLabel>
            <TextInput
              id="text_primary"
              name="text_primary"
              defaultValue={data.theme.text_primary}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="text_secondary">보조 텍스트</FieldLabel>
            <TextInput
              id="text_secondary"
              name="text_secondary"
              defaultValue={data.theme.text_secondary}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="text_tertiary">서브 텍스트</FieldLabel>
            <TextInput
              id="text_tertiary"
              name="text_tertiary"
              defaultValue={data.theme.text_tertiary}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="text_muted">약한 텍스트</FieldLabel>
            <TextInput id="text_muted" name="text_muted" defaultValue={data.theme.text_muted} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="accent_rose">포인트 로즈</FieldLabel>
            <TextInput
              id="accent_rose"
              name="accent_rose"
              defaultValue={data.theme.accent_rose}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="accent_rose_dark">포인트 로즈 다크</FieldLabel>
            <TextInput
              id="accent_rose_dark"
              name="accent_rose_dark"
              defaultValue={data.theme.accent_rose_dark}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="accent_rose_light">포인트 로즈 라이트</FieldLabel>
            <TextInput
              id="accent_rose_light"
              name="accent_rose_light"
              defaultValue={data.theme.accent_rose_light}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="accent_burgundy">포인트</FieldLabel>
            <TextInput
              id="accent_burgundy"
              name="accent_burgundy"
              defaultValue={data.theme.accent_burgundy}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="accent_gold">포인트 골드</FieldLabel>
            <TextInput
              id="accent_gold"
              name="accent_gold"
              defaultValue={data.theme.accent_gold}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="wedding_highlight_text">결혼 강조 텍스트</FieldLabel>
            <TextInput
              id="wedding_highlight_text"
              name="wedding_highlight_text"
              defaultValue={data.theme.wedding_highlight_text}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="wedding_highlight_bg">결혼 강조 배경</FieldLabel>
            <TextInput
              id="wedding_highlight_bg"
              name="wedding_highlight_bg"
              defaultValue={data.theme.wedding_highlight_bg}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="card_bg">카드 배경</FieldLabel>
            <TextInput id="card_bg" name="card_bg" defaultValue={data.theme.card_bg} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="card_border">카드 보더</FieldLabel>
            <TextInput id="card_border" name="card_border" defaultValue={data.theme.card_border} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="border_light">보더 라이트</FieldLabel>
            <TextInput id="border_light" name="border_light" defaultValue={data.theme.border_light} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="divider">디바이더</FieldLabel>
            <TextInput id="divider" name="divider" defaultValue={data.theme.divider} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="shadow_soft">그림자 Soft</FieldLabel>
            <TextInput id="shadow_soft" name="shadow_soft" defaultValue={data.theme.shadow_soft} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="shadow_medium">그림자 Medium</FieldLabel>
            <TextInput
              id="shadow_medium"
              name="shadow_medium"
              defaultValue={data.theme.shadow_medium}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="shadow_card">그림자 Card</FieldLabel>
            <TextInput id="shadow_card" name="shadow_card" defaultValue={data.theme.shadow_card} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="radius_lg">라운드 Large</FieldLabel>
            <TextInput id="radius_lg" name="radius_lg" defaultValue={data.theme.radius_lg} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="radius_md">라운드 Medium</FieldLabel>
            <TextInput id="radius_md" name="radius_md" defaultValue={data.theme.radius_md} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="radius_sm">라운드 Small</FieldLabel>
            <TextInput id="radius_sm" name="radius_sm" defaultValue={data.theme.radius_sm} />
          </div>
          <Button type="submit" size="full" className="md:col-span-2">
            저장하기
          </Button>
        </form>
      </SurfaceCard>
        );
      case 'assets':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">이미지 에셋</h2>
        <form action={updateAssetsAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <ImagePreviewField
            id="hero_image"
            name="hero_image"
            label="메인 이미지 URL"
            defaultValue={data.assets.hero_image}
          />
          <ImagePreviewField
            id="loading_image"
            name="loading_image"
            label="로딩 이미지 URL"
            defaultValue={data.assets.loading_image}
          />
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
            저장하기
          </Button>
        </form>
      </SurfaceCard>
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
              className="min-h-[160px]"
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
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">계좌 안내</h2>
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
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">방명록 설정</h2>
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
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">RSVP 설정</h2>
        <form action={updateRsvpAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-[14px] md:col-span-2">
            <input type="checkbox" name="rsvp_enabled" defaultChecked={data.rsvp.enabled} />
            사용
          </label>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="rsvp_deadline">응답 마감</FieldLabel>
            <TextInput id="rsvp_deadline" name="rsvp_deadline" defaultValue={data.rsvp.deadline || ''} />
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
        );
      case 'rsvp-fields':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">RSVP 입력 필드</h2>
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
              <TextInput id="rsvp_field_sort_order" name="rsvp_field_sort_order" type="number" />
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
        );
      case 'closing':
        return (
          <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">클로징</h2>
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
