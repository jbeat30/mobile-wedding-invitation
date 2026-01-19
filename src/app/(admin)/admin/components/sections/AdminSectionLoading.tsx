'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateLoadingAction } from '@/app/(admin)/admin/actions/content';
import { updateLoadingImageAction } from '@/app/(admin)/admin/actions/assets';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextInput } from '@/components/ui/TextInput';
import { AdminImageFileField } from '@/app/(admin)/admin/components/AdminImageFileField';

type AdminSectionLoadingProps = {
  loading: AdminDashboardData['loading'];
  assets: AdminDashboardData['assets'];
};

/**
 * 로딩 섹션
 * @param props AdminSectionLoadingProps
 * @returns JSX.Element
 */
export const AdminSectionLoading = ({ loading, assets }: AdminSectionLoadingProps) => {
  return (
    <div className="flex flex-col gap-6">
      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">로딩 설정</h2>
        <form action={updateLoadingAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-[14px] md:col-span-2">
            <input type="checkbox" name="loading_enabled" defaultChecked={loading.enabled} />
            사용
          </label>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="loading_message">로딩 메시지</FieldLabel>
            <TextInput
              id="loading_message"
              name="loading_message"
              defaultValue={loading.message}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="loading_min_duration">최소 로딩 보장 시간 (ms)</FieldLabel>
            <TextInput
              id="loading_min_duration"
              name="loading_min_duration"
              type="number"
              defaultValue={loading.min_duration}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="loading_additional_duration">추가 로딩 시간 (ms)</FieldLabel>
            <TextInput
              id="loading_additional_duration"
              name="loading_additional_duration"
              type="number"
              defaultValue={loading.additional_duration}
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
          <AdminImageFileField
            id="loading_image"
            name="loading_image"
            label="로딩 이미지"
            defaultValue={assets.loading_image}
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
};
