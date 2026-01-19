'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateHeroImageAction } from '@/app/(admin)/admin/actions/assets';
import { updateGreetingAction } from '@/app/(admin)/admin/actions/greeting';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';
import { AdminImageFileField } from '@/app/(admin)/admin/components/AdminImageFileField';

type AdminSectionIntroProps = {
  assets: AdminDashboardData['assets'];
  greeting: AdminDashboardData['greeting'];
  sectionTitles: AdminDashboardData['sectionTitles'];
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
}: AdminSectionIntroProps) => {
  return (
    <div className="flex flex-col gap-6">
      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">메인 이미지</h2>
        <form action={updateHeroImageAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <AdminImageFileField
            id="hero_image"
            name="hero_image"
            label="메인 이미지"
            sectionId="intro/hero"
            defaultValue={assets.hero_image}
            hint="2MB 이하 이미지 파일"
          />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" size="sm">
              이미지 저장
            </Button>
          </div>
        </form>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">인사말</h2>
        <form action={updateGreetingAction} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="greeting_section_title">인사말 섹션 타이틀</FieldLabel>
            <TextInput
              id="greeting_section_title"
              name="greeting_section_title"
              defaultValue={sectionTitles.greeting}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="poetic_note">시구</FieldLabel>
            <TextInput id="poetic_note" name="poetic_note" defaultValue={greeting.poetic_note || ''} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="message_lines">본문 (줄바꿈으로 구분)</FieldLabel>
            <TextArea
              id="message_lines"
              name="message_lines"
              className="min-h-[360px]"
              defaultValue={(greeting.message_lines || []).join('\n')}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm">
              저장하기
            </Button>
          </div>
        </form>
      </SurfaceCard>
    </div>
  );
};
