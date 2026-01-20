'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateHeroImageAction } from '@/app/(admin)/admin/actions/assets';
import { updateGreetingAction } from '@/app/(admin)/admin/actions/greeting';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { AdminImageFileField } from '@/app/(admin)/admin/components/AdminImageFileField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type AdminSectionIntroProps = {
  assets: AdminDashboardData['assets'];
  greeting: AdminDashboardData['greeting'];
  sectionTitles: AdminDashboardData['sectionTitles'];
  fileUrlToNameMap: AdminDashboardData['fileUrlToNameMap'];
};

/**
 * 인트로 섹션
 * @param props AdminSectionIntroProps
 * @returns JSX.Element
 */
export const AdminSectionIntro = ({
  assets,
  greeting,
  sectionTitles,
  fileUrlToNameMap,
}: AdminSectionIntroProps) => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>메인 이미지</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminForm
            action={updateHeroImageAction}
            successMessage="이미지가 저장되었습니다"
            className="grid gap-4 md:grid-cols-2"
          >
            <AdminImageFileField
              id="hero_image"
              name="hero_image"
              label="메인 이미지"
              sectionId="intro/hero"
              defaultValue={assets.hero_image}
              defaultFileName={assets.hero_image ? fileUrlToNameMap[assets.hero_image] : null}
              hint="2MB 이하 이미지 파일"
            />
            <div className="md:col-span-2 flex justify-end">
              <AdminSubmitButton size="sm" pendingText="저장 중...">
                이미지 저장
              </AdminSubmitButton>
            </div>
          </AdminForm>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>인사말</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminForm
            action={updateGreetingAction}
            successMessage="인사말이 저장되었습니다"
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="greeting_section_title">인사말 섹션 타이틀</Label>
              <Input
                id="greeting_section_title"
                name="greeting_section_title"
                defaultValue={sectionTitles.greeting}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="poetic_note">시구</Label>
              <Input id="poetic_note" name="poetic_note" defaultValue={greeting.poetic_note || ''} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message_lines">본문 (줄바꿈으로 구분)</Label>
              <Textarea
                id="message_lines"
                name="message_lines"
                className="min-h-[360px]"
                defaultValue={(greeting.message_lines || []).join('\n')}
              />
            </div>
            <div className="flex justify-end">
              <AdminSubmitButton size="sm" pendingText="저장 중...">
                저장하기
              </AdminSubmitButton>
            </div>
          </AdminForm>
        </CardContent>
      </Card>
    </div>
  );
};
