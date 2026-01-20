'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateClosingAction } from '@/app/(admin)/admin/actions/content';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
    <Card>
      <CardHeader>
        <CardTitle>마무리 인삿말</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminForm
          action={updateClosingAction}
          successMessage="마무리 인삿말이 저장되었습니다"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="closing_title">섹션 타이틀</Label>
            <Input
              id="closing_title"
              name="closing_title"
              defaultValue={closing.title}
              placeholder="예: THANK YOU"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="closing_message">메시지</Label>
            <Textarea id="closing_message" name="closing_message" defaultValue={closing.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="closing_copyright">저작권 표기</Label>
            <Input
              id="closing_copyright"
              name="closing_copyright"
              defaultValue={closing.copyright || ''}
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
  );
};
