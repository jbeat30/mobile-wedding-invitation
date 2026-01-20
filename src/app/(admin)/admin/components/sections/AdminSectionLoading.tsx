'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateLoadingAction } from '@/app/(admin)/admin/actions/content';
import { updateLoadingImageAction } from '@/app/(admin)/admin/actions/assets';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { AdminSwitchField } from '@/app/(admin)/admin/components/AdminSwitchField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminImageFileField } from '@/app/(admin)/admin/components/AdminImageFileField';

type AdminSectionLoadingProps = {
  loading: AdminDashboardData['loading'];
  assets: AdminDashboardData['assets'];
  fileUrlToNameMap: AdminDashboardData['fileUrlToNameMap'];
};

/**
 * 로딩 섹션
 * @param props AdminSectionLoadingProps
 * @returns JSX.Element
 */
export const AdminSectionLoading = ({ loading, assets, fileUrlToNameMap }: AdminSectionLoadingProps) => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>로딩 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminForm
            action={updateLoadingAction}
            successMessage="로딩 설정이 저장되었습니다"
            className="grid gap-4 md:grid-cols-2"
          >
            <AdminSwitchField
              id="loading_enabled"
              name="loading_enabled"
              label="사용"
              defaultChecked={loading.enabled}
              className="md:col-span-2"
            />
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="loading_message">로딩 메시지</Label>
              <Input id="loading_message" name="loading_message" defaultValue={loading.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="loading_min_duration">최소 로딩 보장 시간 (ms)</Label>
              <Input
                id="loading_min_duration"
                name="loading_min_duration"
                type="number"
                defaultValue={loading.min_duration}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="loading_additional_duration">추가 로딩 시간 (ms)</Label>
              <Input
                id="loading_additional_duration"
                name="loading_additional_duration"
                type="number"
                defaultValue={loading.additional_duration}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <AdminSubmitButton size="sm" pendingText="저장 중...">
                저장하기
              </AdminSubmitButton>
            </div>
          </AdminForm>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>로딩 이미지</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminForm
            action={updateLoadingImageAction}
            successMessage="로딩 이미지가 저장되었습니다"
            className="grid gap-4 md:grid-cols-2"
          >
            <AdminImageFileField
              id="loading_image"
              name="loading_image"
              label="로딩 이미지"
              sectionId="loading/image"
              defaultValue={assets.loading_image}
              defaultFileName={assets.loading_image ? fileUrlToNameMap[assets.loading_image] : null}
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
    </div>
  );
};
