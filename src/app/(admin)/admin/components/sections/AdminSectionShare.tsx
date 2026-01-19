'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateShareAction } from '@/app/(admin)/admin/actions/share';
import { updateShareImagesAction } from '@/app/(admin)/admin/actions/assets';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextInput } from '@/components/ui/TextInput';
import { AdminImageFileField } from '@/app/(admin)/admin/components/AdminImageFileField';

type AdminSectionShareProps = {
  share: AdminDashboardData['share'];
  assets: AdminDashboardData['assets'];
  sectionTitles: AdminDashboardData['sectionTitles'];
};

/**
 * 공유 섹션
 * @param props AdminSectionShareProps
 * @returns JSX.Element
 */
export const AdminSectionShare = ({ share, assets, sectionTitles }: AdminSectionShareProps) => {
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
              defaultValue={sectionTitles.share}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="share_title">공유 타이틀</FieldLabel>
            <TextInput id="share_title" name="share_title" defaultValue={share.title} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="share_description">공유 설명</FieldLabel>
            <TextInput
              id="share_description"
              name="share_description"
              defaultValue={share.description}
            />
          </div>
          <AdminImageFileField
            id="share_image_url"
            name="share_image_url"
            label="공유 이미지"
            defaultValue={share.image_url}
            hint="2MB 이하 이미지 파일"
          />
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="kakao_title">카카오 타이틀</FieldLabel>
            <TextInput id="kakao_title" name="kakao_title" defaultValue={share.kakao_title || ''} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="kakao_description">카카오 설명</FieldLabel>
            <TextInput
              id="kakao_description"
              name="kakao_description"
              defaultValue={share.kakao_description || ''}
            />
          </div>
          <AdminImageFileField
            id="kakao_image_url"
            name="kakao_image_url"
            label="카카오 이미지"
            defaultValue={share.kakao_image_url || ''}
            hint="2MB 이하 이미지 파일"
          />
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="kakao_button_label">카카오 버튼 라벨</FieldLabel>
            <TextInput
              id="kakao_button_label"
              name="kakao_button_label"
              defaultValue={share.kakao_button_label || ''}
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
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">공유 이미지</h2>
        <form action={updateShareImagesAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <AdminImageFileField
            id="share_og_image"
            name="share_og_image"
            label="OG 이미지"
            defaultValue={assets.share_og_image}
            hint="2MB 이하 이미지 파일"
          />
          <AdminImageFileField
            id="share_kakao_image"
            name="share_kakao_image"
            label="카카오 이미지"
            defaultValue={assets.share_kakao_image}
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
