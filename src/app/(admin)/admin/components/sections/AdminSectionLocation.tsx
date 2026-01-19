'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import {
  updateLocationSectionTitleAction,
  updateWeddingInfoSectionAction,
  updateTransportationAction,
} from '@/app/(admin)/admin/actions/content';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';

type AdminSectionLocationProps = {
  data: AdminDashboardData;
};

/**
 * 예식 정보 & 오시는 길 섹션
 * @param props AdminSectionLocationProps
 * @returns JSX.Element
 */
export const AdminSectionLocation = ({ data }: AdminSectionLocationProps) => {
  return (
    <div className="flex flex-col gap-6">
      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">예식 정보</h2>
        <form action={updateWeddingInfoSectionAction} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="wedding_section_title">예식 섹션 타이틀</FieldLabel>
            <TextInput
              id="wedding_section_title"
              name="wedding_section_title"
              defaultValue={data.sectionTitles.wedding}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="location_notices">안내 문구 (줄바꿈)</FieldLabel>
            <TextArea
              id="location_notices"
              name="location_notices"
              className="min-h-[140px]"
              defaultValue={(data.location.notices || []).join('\n')}
            />
          </div>
          <div className="flex justify-end">
            <AdminSubmitButton size="sm" pendingText="저장 중...">
              저장하기
            </AdminSubmitButton>
          </div>
        </form>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">오시는 길 안내</h2>
        <form action={updateLocationSectionTitleAction} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="location_section_title">오시는 길 섹션 타이틀</FieldLabel>
            <TextInput
              id="location_section_title"
              name="location_section_title"
              defaultValue={data.sectionTitles.location}
            />
          </div>
          <div className="flex justify-end">
            <AdminSubmitButton size="sm" pendingText="저장 중...">
              타이틀 저장
            </AdminSubmitButton>
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
            <AdminSubmitButton size="sm" pendingText="저장 중...">
              교통 안내 저장
            </AdminSubmitButton>
          </div>
        </form>
      </SurfaceCard>
    </div>
  );
};
