'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateProfileAction } from '@/app/(admin)/admin/actions/content';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminImageFileField } from '@/app/(admin)/admin/components/AdminImageFileField';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type AdminSectionCoupleProps = {
  profile: AdminDashboardData['profile'];
  sectionTitles: AdminDashboardData['sectionTitles'];
  fileUrlToNameMap: AdminDashboardData['fileUrlToNameMap'];
};

/**
 * 커플 섹션
 * @param props AdminSectionCoupleProps
 * @returns JSX.Element
 */
export const AdminSectionCouple = ({
  profile,
  sectionTitles,
  fileUrlToNameMap,
}: AdminSectionCoupleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>커플 섹션</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminForm
          action={updateProfileAction}
          successMessage="커플 섹션이 저장되었습니다"
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="couple_section_title">커플 섹션 타이틀</Label>
            <Input
              id="couple_section_title"
              name="couple_section_title"
              defaultValue={sectionTitles.couple}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="groom_bio">신랑 소개글</Label>
            <Textarea id="groom_bio" name="groom_bio" defaultValue={profile.groom_bio || ''} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bride_bio">신부 소개글</Label>
            <Textarea id="bride_bio" name="bride_bio" defaultValue={profile.bride_bio || ''} />
          </div>
          <AdminImageFileField
            id="groom_profile_image"
            name="groom_profile_image"
            label="신랑 프로필 이미지"
            sectionId="couple/groom"
            defaultValue={profile.groom_profile_image || ''}
            defaultFileName={profile.groom_profile_image ? fileUrlToNameMap[profile.groom_profile_image] : null}
            previewClassName="h-[300px]"
            hint="2MB 이하 이미지 파일"
          />
          <AdminImageFileField
            id="bride_profile_image"
            name="bride_profile_image"
            label="신부 프로필 이미지"
            sectionId="couple/bride"
            defaultValue={profile.bride_profile_image || ''}
            defaultFileName={profile.bride_profile_image ? fileUrlToNameMap[profile.bride_profile_image] : null}
            previewClassName="h-[300px]"
            hint="2MB 이하 이미지 파일"
          />
          <div className="md:col-span-2 flex justify-end">
            <AdminSubmitButton size="sm" pendingText="저장 중...">
              저장하기
            </AdminSubmitButton>
          </div>
        </AdminForm>
      </CardContent>
    </Card>
  );
};
