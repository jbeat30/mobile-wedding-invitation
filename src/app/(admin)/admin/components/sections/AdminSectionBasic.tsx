'use client';

import type { RefObject } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateBasicInfoAction, updateLocationAction } from '@/app/(admin)/admin/actions/content';
import { Button } from '@/components/ui/Button';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextInput } from '@/components/ui/TextInput';
import { KakaoMap } from '@/components/ui/KakaoMap';
import { DateTimePicker } from '@/components/ui/DateTimePicker';

type AdminSectionBasicProps = {
  data: AdminDashboardData;
  locationCoords: { lat: number; lng: number };
  onOpenPlaceSearchModal: () => void | Promise<void>;
  onOpenPostcodeModal: () => void | Promise<void>;
  addressInputRef: RefObject<HTMLInputElement | null>;
  venueInputRef: RefObject<HTMLInputElement | null>;
};

/**
 * 기본 정보 섹션
 * @param props AdminSectionBasicProps
 * @returns JSX.Element
 */
export const AdminSectionBasic = ({
  data,
  locationCoords,
  onOpenPlaceSearchModal,
  onOpenPostcodeModal,
  addressInputRef,
  venueInputRef,
}: AdminSectionBasicProps) => {
  const formatCoordinate = (value: number) =>
    Number.isFinite(value) ? value.toFixed(6) : '—';

  return (
    <div className="flex flex-col gap-6">
      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">기본 정보</h2>
        <AdminForm
          action={updateBasicInfoAction}
          successMessage="기본 정보가 저장되었습니다"
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <div className="grid gap-2 sm:grid-cols-2">
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
          <div className="grid gap-2 sm:grid-cols-2">
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
          </div>
          <div className="flex flex-col gap-2">
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
          </div>
          <div className="md:col-span-2 flex justify-end">
            <AdminSubmitButton size="sm" pendingText="저장 중...">
              저장하기
            </AdminSubmitButton>
          </div>
        </AdminForm>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">예식장 정보</h2>
        <AdminForm
          action={updateLocationAction}
          successMessage="예식장 정보가 저장되었습니다"
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <DateTimePicker
              id="event_date_time"
              name="event_date_time"
              label="예식 일시"
              defaultValue={data.event.date_time}
              required
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="event_venue">예식장</FieldLabel>
            <TextInput id="event_venue" name="event_venue" ref={venueInputRef} defaultValue={data.event.venue} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="event_address">주소</FieldLabel>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <TextInput
                id="event_address"
                name="event_address"
                ref={addressInputRef}
                defaultValue={data.event.address}
                readOnly
                onClick={onOpenPlaceSearchModal}
                className="flex-1"
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="ghost" onClick={onOpenPlaceSearchModal}>
                  장소 검색
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={onOpenPostcodeModal}>
                  주소 검색
                </Button>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 relative overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/60">
            <div className="h-[220px]">
              <KakaoMap lat={locationCoords.lat} lng={locationCoords.lng} />
            </div>
            <div className="pointer-events-none absolute bottom-3 right-3 rounded-[12px] border border-[var(--border-light)] bg-white/80 p-3 text-[12px] font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)]">
              <p className="leading-tight">위도: {formatCoordinate(locationCoords.lat)}</p>
              <p className="leading-tight">경도: {formatCoordinate(locationCoords.lng)}</p>
            </div>
          </div>
          <input
            type="hidden"
            name="location_latitude"
            value={Number.isFinite(locationCoords.lat) ? locationCoords.lat : ''}
          />
          <input
            type="hidden"
            name="location_longitude"
            value={Number.isFinite(locationCoords.lng) ? locationCoords.lng : ''}
          />
          <div className="md:col-span-2">
            <p className="text-[12px] text-[var(--text-muted)]">
              좌표는 장소 검색 결과로 자동 채워지고 수정되지 않습니다.
            </p>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <AdminSubmitButton size="sm" pendingText="저장 중...">
              저장하기
            </AdminSubmitButton>
          </div>
        </AdminForm>
      </SurfaceCard>
    </div>
  );
};
