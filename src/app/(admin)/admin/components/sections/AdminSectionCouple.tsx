'use client';

import { useEffect, useState } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateBasicInfoAction, updateProfileAction } from '@/app/(admin)/admin/actions/content';
import { AdminForm } from '@/app/(admin)/admin/components/AdminForm';
import { AdminImageFileField } from '@/app/(admin)/admin/components/AdminImageFileField';
import { AdminSubmitButton } from '@/app/(admin)/admin/components/AdminSubmitButton';
import { StandardButton, StandardCard, StandardInput } from '@/components/admin/StandardComponents';
import { HeartIcon, SaveIcon } from 'lucide-react';

type AdminSectionCoupleProps = {
  profile: AdminDashboardData['profile'];
  parents: AdminDashboardData['parents'];
  sectionTitles: AdminDashboardData['sectionTitles'];
  fileUrlToNameMap: AdminDashboardData['fileUrlToNameMap'];
};

/**
 * 커플 섹션
 * @param props AdminSectionCoupleProps
 * @returns JSX.Element
 */
export const AdminSectionCouple = ({
  profile,
  parents,
  sectionTitles,
  fileUrlToNameMap,
}: AdminSectionCoupleProps) => {
  const [basicInfo, setBasicInfo] = useState({
    groomLastName: profile.groom_last_name || '',
    groomFirstName: profile.groom_first_name || '',
    brideLastName: profile.bride_last_name || '',
    brideFirstName: profile.bride_first_name || '',
    groomFatherName: parents.groom.father || '',
    groomMotherName: parents.groom.mother || '',
    brideFatherName: parents.bride.father || '',
    brideMotherName: parents.bride.mother || '',
  });

  useEffect(() => {
    setBasicInfo({
      groomLastName: profile.groom_last_name || '',
      groomFirstName: profile.groom_first_name || '',
      brideLastName: profile.bride_last_name || '',
      brideFirstName: profile.bride_first_name || '',
      groomFatherName: parents.groom.father || '',
      groomMotherName: parents.groom.mother || '',
      brideFatherName: parents.bride.father || '',
      brideMotherName: parents.bride.mother || '',
    });
  }, [profile, parents]);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <HeartIcon className="w-7 h-7 text-blue-600 mt-1" />
        <h1 className="text-2xl font-bold text-gray-900">커플 정보</h1>
        <p className="text-gray-600 mt-1">신랑신부 소개와 프로필 사진을 관리하세요</p>
      </div>
      <AdminForm
        action={updateBasicInfoAction}
        successMessage="기본 정보가 저장되었습니다"
        className="grid lg:grid-cols-2 gap-6"
      >
        <StandardCard
          title="신랑 정보"
          actions={
            <StandardButton type="submit" size="sm">
              <SaveIcon className="w-4 h-4 mr-2" />
              저장
            </StandardButton>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="성"
                name="groom_last_name"
                value={basicInfo.groomLastName}
                onChange={(value) => setBasicInfo((prev) => ({ ...prev, groomLastName: value }))}
              />
              <StandardInput
                label="이름"
                name="groom_first_name"
                value={basicInfo.groomFirstName}
                onChange={(value) => setBasicInfo((prev) => ({ ...prev, groomFirstName: value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="아버지 성함"
                name="groom_father_name"
                value={basicInfo.groomFatherName}
                onChange={(value) => setBasicInfo((prev) => ({ ...prev, groomFatherName: value }))}
              />
              <StandardInput
                label="어머니 성함"
                name="groom_mother_name"
                value={basicInfo.groomMotherName}
                onChange={(value) => setBasicInfo((prev) => ({ ...prev, groomMotherName: value }))}
              />
            </div>
          </div>
        </StandardCard>

        <StandardCard
          title="신부 정보"
          actions={
            <StandardButton type="submit" size="sm">
              <SaveIcon className="w-4 h-4 mr-2" />
              저장
            </StandardButton>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="성"
                name="bride_last_name"
                value={basicInfo.brideLastName}
                onChange={(value) => setBasicInfo((prev) => ({ ...prev, brideLastName: value }))}
              />
              <StandardInput
                label="이름"
                name="bride_first_name"
                value={basicInfo.brideFirstName}
                onChange={(value) => setBasicInfo((prev) => ({ ...prev, brideFirstName: value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="아버지 성함"
                name="bride_father_name"
                value={basicInfo.brideFatherName}
                onChange={(value) => setBasicInfo((prev) => ({ ...prev, brideFatherName: value }))}
              />
              <StandardInput
                label="어머니 성함"
                name="bride_mother_name"
                value={basicInfo.brideMotherName}
                onChange={(value) => setBasicInfo((prev) => ({ ...prev, brideMotherName: value }))}
              />
            </div>
          </div>
        </StandardCard>
      </AdminForm>

      <StandardCard title="커플 섹션">
        <AdminForm
          action={updateProfileAction}
          successMessage="커플 섹션이 저장되었습니다"
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="couple_section_title">
              커플 섹션 타이틀
            </label>
            <input
              id="couple_section_title"
              name="couple_section_title"
              defaultValue={sectionTitles.couple}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="groom_bio">
              신랑 소개글
            </label>
            <textarea
              id="groom_bio"
              name="groom_bio"
              defaultValue={profile.groom_bio || ''}
              className="min-h-[96px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="bride_bio">
              신부 소개글
            </label>
            <textarea
              id="bride_bio"
              name="bride_bio"
              defaultValue={profile.bride_bio || ''}
              className="min-h-[96px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <AdminImageFileField
            id="groom_profile_image"
            name="groom_profile_image"
            label="신랑 프로필 이미지"
            sectionId="couple/groom"
            defaultValue={profile.groom_profile_image || ''}
            defaultFileName={
              profile.groom_profile_image ? fileUrlToNameMap[profile.groom_profile_image] : null
            }
            previewClassName="h-[300px]"
            hint="2MB 초과 시 자동 압축"
            fullWidth={false}
            containerClassName="md:col-span-1"
          />
          <AdminImageFileField
            id="bride_profile_image"
            name="bride_profile_image"
            label="신부 프로필 이미지"
            sectionId="couple/bride"
            defaultValue={profile.bride_profile_image || ''}
            defaultFileName={
              profile.bride_profile_image ? fileUrlToNameMap[profile.bride_profile_image] : null
            }
            previewClassName="h-[300px]"
            hint="2MB 초과 시 자동 압축"
            fullWidth={false}
            containerClassName="md:col-span-1"
          />
          <div className="md:col-span-2 flex justify-end">
            <AdminSubmitButton size="sm" pendingText="저장 중...">
              저장하기
            </AdminSubmitButton>
          </div>
        </AdminForm>
      </StandardCard>
    </div>
  );
};
