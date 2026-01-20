'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import {
  updateLocationSectionTitleAction,
  updateWeddingInfoSectionAction,
  updateTransportationAction,
} from '@/app/(admin)/admin/actions/content';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type AdminSectionLocationProps = {
  data: AdminDashboardData;
};

/**
 * 예식 정보 & 오시는 길 섹션
 * @param props AdminSectionLocationProps
 * @returns JSX.Element
 */
export const AdminSectionLocation = ({ data }: AdminSectionLocationProps) => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>예식 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminForm
            action={updateWeddingInfoSectionAction}
            successMessage="예식 정보가 저장되었습니다"
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="wedding_section_title">예식 섹션 타이틀</Label>
              <Input
                id="wedding_section_title"
                name="wedding_section_title"
                defaultValue={data.sectionTitles.wedding}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location_notices">안내 문구 (줄바꿈)</Label>
              <Textarea
                id="location_notices"
                name="location_notices"
                className="min-h-[140px]"
                defaultValue={(data.location.notices || []).join('\n')}
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

      <Card>
        <CardHeader>
          <CardTitle>오시는 길 안내</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminForm
            action={updateLocationSectionTitleAction}
            successMessage="오시는 길 타이틀이 저장되었습니다"
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="location_section_title">오시는 길 섹션 타이틀</Label>
              <Input
                id="location_section_title"
                name="location_section_title"
                defaultValue={data.sectionTitles.location}
              />
            </div>
            <div className="flex justify-end">
              <AdminSubmitButton size="sm" pendingText="저장 중...">
                타이틀 저장
              </AdminSubmitButton>
            </div>
          </AdminForm>

          <AdminForm
            action={updateTransportationAction}
            successMessage="교통 안내가 저장되었습니다"
            className="mt-6 flex flex-col gap-4"
          >
            <input type="hidden" name="location_id" value={data.location.id} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="transport_subway">지하철 (줄바꿈)</Label>
              <Textarea
                id="transport_subway"
                name="transport_subway"
                className="min-h-[120px]"
                defaultValue={(data.transportation.subway || []).join('\n')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="transport_bus">버스 (줄바꿈)</Label>
              <Textarea
                id="transport_bus"
                name="transport_bus"
                className="min-h-[120px]"
                defaultValue={(data.transportation.bus || []).join('\n')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="transport_car">자가용</Label>
              <Input
                id="transport_car"
                name="transport_car"
                defaultValue={data.transportation.car || ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="transport_parking">주차</Label>
              <Input
                id="transport_parking"
                name="transport_parking"
                defaultValue={data.transportation.parking || ''}
              />
            </div>
            <div className="flex justify-end">
              <AdminSubmitButton size="sm" pendingText="저장 중...">
                교통 안내 저장
              </AdminSubmitButton>
            </div>
          </AdminForm>
        </CardContent>
      </Card>
    </div>
  );
};
