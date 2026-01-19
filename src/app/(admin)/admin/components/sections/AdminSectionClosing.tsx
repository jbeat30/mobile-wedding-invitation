'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateClosingAction } from '@/app/(admin)/admin/actions/content';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';

type AdminSectionClosingProps = {
  closing: AdminDashboardData['closing'];
};

/**
 * 마무리 인삿말 섹션
 * @param props AdminSectionClosingProps
 * @returns JSX.Element
 */
export const AdminSectionClosing = ({ closing }: AdminSectionClosingProps) => {
  return (
    <SurfaceCard className="p-6">
      <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">마무리 인삿말</h2>
      <form action={updateClosingAction} className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="closing_message">메시지</FieldLabel>
          <TextArea id="closing_message" name="closing_message" defaultValue={closing.message} />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="closing_copyright">저작권 표기</FieldLabel>
          <TextInput
            id="closing_copyright"
            name="closing_copyright"
            defaultValue={closing.copyright || ''}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            저장하기
          </Button>
        </div>
      </form>
    </SurfaceCard>
  );
};
