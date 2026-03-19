'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateShareAction } from '@/app/(admin)/admin/actions/share';
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
 */
export const AdminSectionShare = ({ share, fileUrlToNameMap }: AdminSectionShareProps) => {
  const nowUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || nowUrl;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <Share2Icon className="w-7 h-7 text-blue-600 mt-1" />
        <h1 className="text-2xl font-bold text-gray-900">공유 설정</h1>
        <p className="text-gray-600 mt-1">공유 문구와 소셜 미리보기 정보를 관리하세요</p>
      </div>

      {/* 공유 섹션 노출 문구 */}
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
                공개 페이지 공유 섹션 하단 설명으로 사용됩니다.
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

      {/* 공유 미리보기 — OG + 카카오 통합 */}
      <Card>
        <CardHeader>
          <CardTitle>공유 미리보기</CardTitle>
          <p className="text-[14px] text-[var(--text-muted)]">
            링크 복사 · 카카오톡 · 기타 메신저 · 브라우저에서 공유 시 표시되는 정보입니다.
          </p>
        </CardHeader>
        <CardContent>
          <AdminForm
            action={updateShareAction}
            successMessage="공유 미리보기가 저장되었습니다"
            className="mt-4 grid gap-4 md:grid-cols-2"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="og_title">제목</Label>
              <Input
                id="og_title"
                name="og_title"
                defaultValue={share.og_title || ''}
                placeholder="입력하세요"
              />
              <p className="text-[11px] text-[var(--text-muted)]">
                링크 공유 시 제목으로 표시됩니다 (60자 이내 권장)
              </p>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="og_description">설명</Label>
              <Textarea
                id="og_description"
                name="og_description"
                defaultValue={share.og_description || ''}
                placeholder="입력하세요"
              />
              <p className="text-[11px] text-[var(--text-muted)]">최대 두 줄을 권장합니다.</p>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <AdminImageFileField
                id="og_image_url"
                name="og_image_url"
                label="미리보기 이미지"
                sectionId="share/og"
                defaultValue={share.og_image_url || ''}
                defaultFileName={share.og_image_url ? fileUrlToNameMap[share.og_image_url] : null}
                hint="링크 복사 · 카카오톡 · 메신저 미리보기에 공통으로 사용됩니다 (2MB 초과 시 자동 압축)"
              />
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 mt-1">
                <p className="text-[12px] font-semibold text-blue-900 mb-1">💡 세로형 이미지 권장</p>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  <strong>400px × 800px (1:2 비율)</strong> 또는 <strong>3:4 비율</strong>의 세로형 이미지를 사용하시면
                  카카오톡에서 이미지가 잘리지 않고 더욱 아름답게 표시됩니다.
                </p>
              </div>
            </div>

            {/* 미리보기 */}
            {share.og_image_url && (
              <div className="md:col-span-2">
                <p className="text-[13px] font-semibold text-[var(--text-primary)] mb-3">미리보기</p>
                <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden shadow-sm w-[240px]">
                  <div className="w-full h-[320px] bg-gray-100 overflow-hidden">
                    <img
                      src={share.og_image_url}
                      alt="공유 미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">
                      {share.og_title || '제목 없음'}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1 line-clamp-2">
                      {share.og_description || '설명 없음'}
                    </p>
                    <p className="text-[9px] text-[var(--text-muted)] mt-1.5 truncate">{siteUrl}</p>
                  </div>
                  <div className="px-3 pb-3">
                    <p className="text-[9px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-light)]">
                      💡 링크 복사 · 카카오톡 · 메신저에서 표시되는 미리보기입니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="kakao_button_label">카카오 버튼 텍스트</Label>
              <Input
                id="kakao_button_label"
                name="kakao_button_label"
                defaultValue={share.kakao_button_label || ''}
                placeholder="예: 청첩장 보기"
              />
              <p className="text-[11px] text-[var(--text-muted)]">
                카카오톡 공유 카드 하단 버튼에 표시됩니다. 비어있으면 &ldquo;청첩장 보기&rdquo;로 표시됩니다.
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
    </div>
  );
};
