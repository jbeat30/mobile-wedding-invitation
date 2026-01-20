'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateShareAction } from '@/app/(admin)/admin/actions/share';
import { updateShareImagesAction } from '@/app/(admin)/admin/actions/assets';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { AdminImageFileField } from '@/app/(admin)/admin/components/AdminImageFileField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AdminSectionShareProps = {
  share: AdminDashboardData['share'];
  assets: AdminDashboardData['assets'];
  sectionTitles: AdminDashboardData['sectionTitles'];
  fileUrlToNameMap: AdminDashboardData['fileUrlToNameMap'];
};

/**
 * 공유 섹션
 * @param props AdminSectionShareProps
 * @returns JSX.Element
 */
export const AdminSectionShare = ({ share, assets, sectionTitles, fileUrlToNameMap }: AdminSectionShareProps) => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>공유 섹션</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[12px] text-[var(--text-muted)]">
            청첩장 화면에 표시되는 공유 섹션의 제목/문구를 설정합니다.
          </p>
          <AdminForm
            action={updateShareAction}
            successMessage="공유 섹션이 저장되었습니다"
            className="mt-4 grid gap-4 md:grid-cols-2"
          >
            <input type="hidden" name="share_image_url" value={assets.share_og_image || ''} />
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="share_section_title">공유 섹션 타이틀</Label>
              <Input
                id="share_section_title"
                name="share_section_title"
                defaultValue={sectionTitles.share}
                placeholder="예: 공유하기"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="share_title">공유 타이틀</Label>
              <Input
                id="share_title"
                name="share_title"
                defaultValue={share.title}
                placeholder="예: 우리 결혼합니다"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="share_description">공유 설명</Label>
              <Input
                id="share_description"
                name="share_description"
                defaultValue={share.description}
                placeholder="예: 소중한 날에 함께해 주세요"
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
          <CardTitle>카카오 공유 카드</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[12px] text-[var(--text-muted)]">
            카카오톡 공유 카드에 표시되는 문구/이미지를 설정합니다.
          </p>
          <AdminForm
            action={updateShareAction}
            successMessage="카카오 공유 카드가 저장되었습니다"
            className="mt-4 grid gap-4 md:grid-cols-2"
          >
            <input type="hidden" name="share_image_url" value={assets.share_og_image || ''} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="kakao_title">카카오 타이틀</Label>
              <Input
                id="kakao_title"
                name="kakao_title"
                defaultValue={share.kakao_title || ''}
                placeholder="예: 철수 ❤️ 영희의 결혼식"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="kakao_description">카카오 설명</Label>
              <Input
                id="kakao_description"
                name="kakao_description"
                defaultValue={share.kakao_description || ''}
                placeholder="예: 2024.12.25 토요일 오후 2시"
              />
            </div>
            <AdminImageFileField
              id="kakao_image_url"
              name="kakao_image_url"
              label="카카오 카드 이미지"
              sectionId="share/kakao"
              defaultValue={share.kakao_image_url || ''}
              defaultFileName={share.kakao_image_url ? fileUrlToNameMap[share.kakao_image_url] : null}
              hint="비어있으면 OG 이미지가 대신 사용됩니다 (2MB 초과 시 자동 압축)"
            />
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="kakao_button_label">카카오 버튼 라벨</Label>
              <Input
                id="kakao_button_label"
                name="kakao_button_label"
                defaultValue={share.kakao_button_label || ''}
                placeholder="예: 모바일 청첩장 보기"
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
          <CardTitle>미리보기(OG) 이미지</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[12px] text-[var(--text-muted)]">
            카카오 외 외부 메신저/브라우저 미리보기에서 사용하는 이미지입니다.
          </p>
          <AdminForm
            action={updateShareImagesAction}
            successMessage="OG 이미지가 저장되었습니다"
            className="mt-4 grid gap-4 md:grid-cols-2"
          >
            <AdminImageFileField
              id="share_og_image"
              name="share_og_image"
              label="OG 이미지"
              sectionId="share/og"
              defaultValue={assets.share_og_image}
              defaultFileName={assets.share_og_image ? fileUrlToNameMap[assets.share_og_image] : null}
              hint="메신저/브라우저 미리보기용 (2MB 초과 시 자동 압축)"
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
