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
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">공유 섹션</h2>
        <p className="mt-1 text-[12px] text-[var(--text-muted)]">
          청첩장 화면에 표시되는 공유 섹션의 제목/문구를 설정합니다.
        </p>
        <form action={updateShareAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="share_image_url" value={assets.share_og_image || ''} />
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="share_section_title">공유 섹션 타이틀</FieldLabel>
            <TextInput
              id="share_section_title"
              name="share_section_title"
              defaultValue={sectionTitles.share}
              placeholder="예: 공유하기"
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="share_title">공유 타이틀</FieldLabel>
            <TextInput
              id="share_title"
              name="share_title"
              defaultValue={share.title}
              placeholder="예: 우리 결혼합니다"
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="share_description">공유 설명</FieldLabel>
            <TextInput
              id="share_description"
              name="share_description"
              defaultValue={share.description}
              placeholder="예: 소중한 날에 함께해 주세요"
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
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">카카오 공유 카드</h3>
        <p className="mt-1 text-[12px] text-[var(--text-muted)]">
          카카오톡 공유 카드에 표시되는 문구/이미지를 설정합니다.
        </p>
        <form action={updateShareAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="share_image_url" value={assets.share_og_image || ''} />
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="kakao_title">카카오 타이틀</FieldLabel>
            <TextInput
              id="kakao_title"
              name="kakao_title"
              defaultValue={share.kakao_title || ''}
              placeholder="예: 철수 ❤️ 영희의 결혼식"
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="kakao_description">카카오 설명</FieldLabel>
            <TextInput
              id="kakao_description"
              name="kakao_description"
              defaultValue={share.kakao_description || ''}
              placeholder="예: 2024.12.25 토요일 오후 2시"
            />
          </div>
          <AdminImageFileField
            id="kakao_image_url"
            name="kakao_image_url"
            label="카카오 카드 이미지"
            sectionId="share/kakao"
            defaultValue={share.kakao_image_url || ''}
            hint="비어있으면 OG 이미지가 대신 사용됩니다 (2MB 이하)"
          />
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="kakao_button_label">카카오 버튼 라벨</FieldLabel>
            <TextInput
              id="kakao_button_label"
              name="kakao_button_label"
              defaultValue={share.kakao_button_label || ''}
              placeholder="예: 모바일 청첩장 보기"
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
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">미리보기(OG) 이미지</h3>
        <p className="mt-1 text-[12px] text-[var(--text-muted)]">
          카카오 외 외부 메신저/브라우저 미리보기에서 사용하는 이미지입니다.
        </p>
        <form action={updateShareImagesAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <AdminImageFileField
            id="share_og_image"
            name="share_og_image"
            label="OG 이미지"
            sectionId="share/og"
            defaultValue={assets.share_og_image}
            hint="메신저/브라우저 미리보기용 (2MB 이하)"
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
