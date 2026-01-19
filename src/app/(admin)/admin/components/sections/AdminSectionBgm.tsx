'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateBgmAction } from '@/app/(admin)/admin/actions/bgm';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextInput } from '@/components/ui/TextInput';

type AdminSectionBgmProps = {
  bgm: AdminDashboardData['bgm'];
};

/**
 * BGM 섹션
 * @param props AdminSectionBgmProps
 * @returns JSX.Element
 */
export const AdminSectionBgm = ({ bgm }: AdminSectionBgmProps) => {
  return (
    <SurfaceCard className="p-6">
      <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">BGM 설정</h2>
      <form action={updateBgmAction} className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" name="bgm_enabled" defaultChecked={bgm.enabled} />
          사용
        </label>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" name="bgm_auto_play" defaultChecked={bgm.auto_play} />
          자동 재생
        </label>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" name="bgm_loop" defaultChecked={bgm.loop} />
          반복 재생
        </label>
        <div className="flex flex-col gap-2 md:col-span-2">
          <FieldLabel htmlFor="bgm_audio_url">BGM URL</FieldLabel>
          <TextInput id="bgm_audio_url" name="bgm_audio_url" defaultValue={bgm.audio_url || ''} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" size="sm">
            저장하기
          </Button>
        </div>
      </form>
    </SurfaceCard>
  );
};
