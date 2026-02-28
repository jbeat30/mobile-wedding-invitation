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
import { Share2Icon } from 'lucide-react';

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
  const nowUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || nowUrl;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <Share2Icon className="w-7 h-7 text-blue-600 mt-1" />
        <h1 className="text-2xl font-bold text-gray-900">공유 설정</h1>
        <p className="text-gray-600 mt-1">공유 문구와 소셜 미리보기 정보를 관리하세요</p>
      </div>

      {/* 화면 노출 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>공유 섹션 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[14px] text-[var(--text-muted)]">
            청첩장 공개 페이지의 공유 섹션에 표시되는 제목과 문구입니다.
          </p>
          <AdminForm
            action={updateShareAction}
            successMessage="공유 섹션 정보가 저장되었습니다"
            className="mt-4 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="section_title">공유 섹션 타이틀</Label>
              <Input
                id="section_title"
                name="section_title"
                defaultValue={share.section_title}
                placeholder="입력하세요"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">공유 섹션 문구</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={share.description}
                placeholder="입력하세요"
              />
              <p className="text-[11px] text-[var(--text-muted)]">
                공개 페이지의 공유 섹션 하단 설명으로 사용됩니다.
              </p>
            </div>
            <div className="flex justify-end">
              <AdminSubmitButton size="sm" pendingText="저장 중...">
                저장하기
              </AdminSubmitButton>
            </div>
          </AdminForm>
        </CardContent>
      </Card>

      {/* 기본 미리보기 — 카카오톡 이외의 앱·브라우저 공유 시 사용 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 미리보기 (OG)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[14px] text-[var(--text-muted)]">
            카카오톡이 아닌 메신저·브라우저에서 링크를 공유했을 때 표시되는 정보입니다.
          </p>
          <AdminForm
            action={updateShareAction}
            successMessage="OG 정보가 저장되었습니다"
            className="mt-4 grid gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-dashed border-[var(--border-light)] bg-white/60 p-4">
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">자동 제공되는 OG 메타</p>
                <div className="mt-2 space-y-1 text-[12px] text-[var(--text-secondary)]">
                  <p>og:type: website</p>
                  <p>og:url: {siteUrl}</p>
                  <p>og:site_name: Wedding Invitation</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="og_title">OG 타이틀</Label>
              <Input
                id="og_title"
                name="og_title"
                defaultValue={share.og_title || ''}
                placeholder="입력하세요"
              />
              <p className="text-[11px] text-[var(--text-muted)]">60자 내외로 입력하세요.</p>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="og_description">OG 설명</Label>
              <Textarea
                id="og_description"
                name="og_description"
                defaultValue={share.og_description || ''}
                placeholder="입력하세요"
              />
              <p className="text-[11px] text-[var(--text-muted)]">최대 두 줄을 권장합니다.</p>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <AdminSubmitButton size="sm" pendingText="저장 중...">
                저장하기
              </AdminSubmitButton>
            </div>
          </AdminForm>

          <AdminForm
            action={updateShareImagesAction}
            successMessage="OG 이미지가 저장되었습니다"
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2 flex flex-col gap-2">
              <AdminImageFileField
                id="share_og_image"
                name="share_og_image"
                label="OG 이미지"
                sectionId="share/og"
                defaultValue={assets.share_og_image}
                defaultFileName={assets.share_og_image ? fileUrlToNameMap[assets.share_og_image] : null}
                hint="카카오톡 외 메신저·브라우저 미리보기용 (2MB 초과 시 자동 압축)"
              />
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 mt-1">
                <p className="text-[12px] font-semibold text-blue-900 mb-1">💡 세로형 이미지 권장</p>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  웨딩 이미지는 세로가 긴 비율이 많으므로, <strong>400px × 800px (1:2 비율)</strong> 또는 <strong>3:4 비율</strong>의 세로형 이미지를 사용하시면 카카오톡에서 이미지가 잘리지 않고 더욱 아름답게 표시됩니다.
                </p>
              </div>
            </div>

            {/* OG 미리보기 */}
            {assets.share_og_image && (
              <div className="md:col-span-2">
                <p className="text-[13px] font-semibold text-[var(--text-primary)] mb-3">미리보기</p>
                <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden shadow-sm w-[240px]">
                  {/* OG 이미지 */}
                  <div className="w-full h-[320px] bg-gray-100 overflow-hidden">
                    <img
                      src={assets.share_og_image}
                      alt="OG 미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* OG 텍스트 정보 */}
                  <div className="p-3">
                    <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">
                      {share.og_title || '제목 없음'}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1 line-clamp-2">
                      {share.og_description || '설명 없음'}
                    </p>
                    <p className="text-[9px] text-[var(--text-muted)] mt-1.5 truncate">
                      {siteUrl}
                    </p>
                  </div>
                  <div className="px-3 pb-3">
                    <p className="text-[9px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-light)]">
                      💡 카카오톡 공유 시 이와 유사한 형태로 표시됩니다
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <AdminSubmitButton size="sm" pendingText="저장 중...">
                이미지 저장
              </AdminSubmitButton>
            </div>
          </AdminForm>
        </CardContent>
      </Card>

      {/* 카카오톡 앱 내 공유 버튼 전용 — OG와 독립적 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>카카오 공유 카드</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[14px] text-[var(--text-muted)]">
            카카오톡 앱 내 공유 버튼을 통해 공유했을 때 표시되는 카드입니다. OG와 독립적으로
            설정됩니다.
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
                placeholder="입력하세요"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="kakao_description">카카오 설명</Label>
              <Input
                id="kakao_description"
                name="kakao_description"
                defaultValue={share.kakao_description || ''}
                placeholder="입력하세요"
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <AdminImageFileField
                id="kakao_image_url"
                name="kakao_image_url"
                label="카카오 카드 이미지"
                sectionId="share/kakao"
                defaultValue={share.kakao_image_url || ''}
                defaultFileName={share.kakao_image_url ? fileUrlToNameMap[share.kakao_image_url] : null}
                hint="비어있으면 OG 이미지가 대신 사용됩니다 (2MB 초과 시 자동 압축)"
              />
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 mt-1">
                <p className="text-[12px] font-semibold text-blue-900 mb-1">💡 세로형 이미지 권장</p>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  웨딩 이미지는 세로가 긴 비율이 많으므로, <strong>400px × 800px (1:2 비율)</strong> 또는 <strong>3:4 비율</strong>의 세로형 이미지를 사용하시면 카카오톡에서 이미지가 잘리지 않고 더욱 아름답게 표시됩니다.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="kakao_button_label">카카오 버튼 라벨</Label>
              <Input
                id="kakao_button_label"
                name="kakao_button_label"
                defaultValue={share.kakao_button_label || ''}
                placeholder="입력하세요"
              />
            </div>

            {/* 카카오 미리보기 */}
            {(share.kakao_image_url || assets.share_og_image) && (
              <div className="md:col-span-2">
                <p className="text-[13px] font-semibold text-[var(--text-primary)] mb-3">미리보기</p>
                <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden shadow-sm w-[240px]">
                  {/* 카카오 이미지 */}
                  <div className="w-full h-[320px] bg-gray-100 overflow-hidden">
                    <img
                      src={share.kakao_image_url || assets.share_og_image || ''}
                      alt="카카오 미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* 카카오 텍스트 정보 */}
                  <div className="p-3">
                    <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">
                      {share.kakao_title || share.og_title || '제목 없음'}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1 line-clamp-2">
                      {share.kakao_description || share.og_description || '설명 없음'}
                    </p>
                    <p className="text-[9px] text-[var(--text-muted)] mt-1.5 truncate">
                      {siteUrl}
                    </p>
                  </div>
                  <div className="px-3 pb-3">
                    <p className="text-[9px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-light)]">
                      💡 카카오톡 앱 내 공유 시 이와 유사한 형태로 표시됩니다
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
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
