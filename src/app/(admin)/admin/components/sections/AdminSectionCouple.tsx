'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateProfileAction } from '@/app/(admin)/admin/actions/content';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';
import { AdminImageFileField } from '@/app/(admin)/admin/components/AdminImageFileField';

type AdminSectionCoupleProps = {
  profile: AdminDashboardData['profile'];
  sectionTitles: AdminDashboardData['sectionTitles'];
};

/**
 * 커플 섹션
 * @param props AdminSectionCoupleProps
 * @returns JSX.Element
 */
export const AdminSectionCouple = ({ profile, sectionTitles }: AdminSectionCoupleProps) => {
  return (
    <SurfaceCard className="p-6">
      <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">커플 섹션</h2>
      <form action={updateProfileAction} className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:col-span-2">
          <FieldLabel htmlFor="couple_section_title">커플 섹션 타이틀</FieldLabel>
          <TextInput
            id="couple_section_title"
            name="couple_section_title"
            defaultValue={sectionTitles.couple}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="groom_bio">신랑 소개글</FieldLabel>
          <TextArea id="groom_bio" name="groom_bio" defaultValue={profile.groom_bio || ''} />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="bride_bio">신부 소개글</FieldLabel>
          <TextArea id="bride_bio" name="bride_bio" defaultValue={profile.bride_bio || ''} />
        </div>
        <AdminImageFileField
          id="groom_profile_image"
          name="groom_profile_image"
          label="신랑 프로필 이미지"
          defaultValue={profile.groom_profile_image || ''}
          previewClassName="h-[300px]"
          hint="2MB 이하 이미지 파일"
        />
        <AdminImageFileField
          id="bride_profile_image"
          name="bride_profile_image"
          label="신부 프로필 이미지"
          defaultValue={profile.bride_profile_image || ''}
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
};
