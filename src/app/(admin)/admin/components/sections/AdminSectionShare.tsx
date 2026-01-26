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
import { Textarea } from '@/components/ui/textarea';

type AdminSectionShareProps = {
  share: AdminDashboardData['share'];
  assets: AdminDashboardData['assets'];
  fileUrlToNameMap: AdminDashboardData['fileUrlToNameMap'];
};

/**
 * 공유 섹션
 * @param props AdminSectionShareProps
 * @returns JSX.Element
 */
export const AdminSectionShare = ({ share, assets, fileUrlToNameMap }: AdminSectionShareProps) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jbeat.com';

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>공유 섹션</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[14px] text-[var(--text-muted)]">
            청첩장 화면에 표시되는 공유 섹션 제목/문구와 OG 메타 정보를 분리해서 설정합니다.
          </p>
          <AdminForm
            action={updateShareAction}
            successMessage="공유 섹션이 저장되었습니다"
            className="mt-4 grid gap-4 md:grid-cols-2"
          >
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="section_title">공유 섹션 타이틀</Label>
              <Input
                id="section_title"
                name="section_title"
                defaultValue={share.section_title}
                placeholder="예: 청첩장 공유하기"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="description">공유 섹션 문구</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={share.description}
                placeholder="예: 소중한 분들과 함께 이야기를 나눌게요"
              />
              <p className="text-[11px] text-[var(--text-muted)]">
                이 문구는 공개 페이지의 공유 섹션 하단 설명으로 사용됩니다.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-dashed border-[var(--border-light)] bg-white/60 p-4">
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">OG 메타 정보</p>
                <p className="mt-1 text-[12px] text-[var(--text-muted)]">
                  OG 타이틀과 설명은 소셜 미리보기에서 사용하는 데이터입니다. 아래 값들은
                  자동으로 함께 제공됩니다.
                </p>
                <div className="mt-3 space-y-1 text-[12px] text-[var(--text-secondary)]">
                  <p>og:type: website (고정)</p>
                  <p>og:url: {siteUrl}</p>
                  <p>og:site_name: jbeat</p>
                  <p>developer: jbeat (관리자화면에는 노출되지 않으며 변경할 수 없습니다)</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="og_title">OG 타이틀</Label>
              <Input
                id="og_title"
                name="og_title"
                defaultValue={share.og_title || ''}
                placeholder="예: 강신랑 · 장신부 결혼식에 초대합니다"
              />
              <p className="text-[11px] text-[var(--text-muted)]">
                OG 타이틀은 메신저/브라우저 미리보기 제목으로 사용되며 60자 내외로 입력하세요.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="og_description">OG 설명</Label>
              <Textarea
                id="og_description"
                name="og_description"
                defaultValue={share.og_description || ''}
                placeholder="예: 2026년 05월 16일 오후 3시 00분 | 채림 웨딩홀"
              />
              <p className="text-[11px] text-[var(--text-muted)]">
                OG 설명은 메신저/브라우저 미리보기 본문으로 사용됩니다. 최대 두 줄을 권장합니다.
              </p>
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
          <p className="text-[14px] text-[var(--text-muted)]">
            카카오톡 공유 카드에 표시되는 문구/이미지를 설정합니다.
          </p>
          <AdminForm
            action={updateShareAction}
            successMessage="카카오 공유 카드가 저장되었습니다"
            className="mt-4 grid gap-4 md:grid-cols-2"
          >
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
          <p className="text-[14px] text-[var(--text-muted)]">
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
