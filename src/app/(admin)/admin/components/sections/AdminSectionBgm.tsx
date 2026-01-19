'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateBgmAction, uploadBgmAction } from '@/app/(admin)/admin/actions/bgm';
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
          <input type="checkbox" name="bgm_enabled" defaultChecked={Boolean(bgm.enabled)} />
          사용
        </label>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" name="bgm_auto_play" defaultChecked={Boolean(bgm.auto_play)} />
          자동 재생
        </label>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" name="bgm_loop" defaultChecked={Boolean(bgm.loop)} />
          반복 재생
        </label>
        <div className="flex flex-col gap-2 md:col-span-2">
          <FieldLabel htmlFor="bgm_audio_url">BGM URL</FieldLabel>
          <TextInput id="bgm_audio_url" name="bgm_audio_url" defaultValue={bgm.audio_url || ''} />
          <p className="text-[11px] text-[var(--text-muted)]">
            업로드한 파일 URL 또는 외부 mp3 파일 URL을 입력하세요.
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[12px] font-medium text-[var(--text-secondary)]">미리 듣기</p>
          {bgm.audio_url ? (
            <audio controls preload="none" src={bgm.audio_url} className="mt-2 w-full" />
          ) : (
            <div className="mt-2 rounded-[10px] border border-dashed border-[var(--border-light)] bg-white/70 px-3 py-2 text-[12px] text-[var(--text-muted)]">
              업로드된 BGM이 없습니다.
            </div>
          )}
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" size="sm">
            저장하기
          </Button>
        </div>
      </form>
      <form action={uploadBgmAction} className="mt-6 grid gap-3">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="bgm_audio_file">BGM 파일 업로드</FieldLabel>
          <input
            id="bgm_audio_file"
            type="file"
            name="bgm_audio_file"
            accept="audio/*"
            className="w-full rounded-[10px] border border-[var(--border-light)] bg-white/70 px-3 py-2 text-[13px] text-[var(--text-primary)] file:mr-3 file:rounded-[8px] file:border-0 file:bg-[var(--bg-secondary)] file:px-3 file:py-1.5 file:text-[12px] file:text-[var(--text-secondary)]"
          />
          <p className="text-[11px] text-[var(--text-muted)]">
            mp3 등 오디오 파일을 업로드하면 URL이 자동으로 저장됩니다.
          </p>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            파일 업로드
          </Button>
        </div>
      </form>
    </SurfaceCard>
  );
};
