'use client';

import { useState, useEffect } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { StandardCard, StandardInput, StandardButton } from '@/components/admin/StandardComponents';
import {
  SaveIcon,
} from 'lucide-react';
import { updateBasicInfoAction } from '@/app/(admin)/admin/actions/content';
import toast from 'react-hot-toast';

type AdminSectionBasicProps = {
  data: AdminDashboardData;
};

/**
 * 기본 정보 관리 - Standard 스타일
 */
export const AdminSectionBasic = ({ data }: AdminSectionBasicProps) => {
  // 기본 정보 상태
  const [basicInfo, setBasicInfo] = useState({
    groomLastName: data.profile?.groom_last_name || '',
    groomFirstName: data.profile?.groom_first_name || '',
    groomFatherName: data.parents?.groom?.father || '',
    groomMotherName: data.parents?.groom?.mother || '',
    brideLastName: data.profile?.bride_last_name || '',
    brideFirstName: data.profile?.bride_first_name || '',
    brideFatherName: data.parents?.bride?.father || '',
    brideMotherName: data.parents?.bride?.mother || '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBasicInfo({
      groomLastName: data.profile?.groom_last_name || '',
      groomFirstName: data.profile?.groom_first_name || '',
      groomFatherName: data.parents?.groom?.father || '',
      groomMotherName: data.parents?.groom?.mother || '',
      brideLastName: data.profile?.bride_last_name || '',
      brideFirstName: data.profile?.bride_first_name || '',
      brideFatherName: data.parents?.bride?.father || '',
      brideMotherName: data.parents?.bride?.mother || '',
    });
  }, [data]);

  // 기본 정보 저장
  const handleSaveBasicInfo = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('groom_first_name', basicInfo.groomFirstName);
      formData.append('groom_last_name', basicInfo.groomLastName);
      formData.append('bride_first_name', basicInfo.brideFirstName);
      formData.append('bride_last_name', basicInfo.brideLastName);
      formData.append('groom_father_name', basicInfo.groomFatherName);
      formData.append('groom_mother_name', basicInfo.groomMotherName);
      formData.append('bride_father_name', basicInfo.brideFatherName);
      formData.append('bride_mother_name', basicInfo.brideMotherName);

      await updateBasicInfoAction(formData);
      toast.success('기본 정보가 저장되었습니다.');
    } catch (_error) {
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 신랑 정보 */}
        <StandardCard
          title="신랑 정보"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="신랑 성"
                value={basicInfo.groomLastName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomLastName: value }))}
              />
              <StandardInput
                label="신랑 이름"
                value={basicInfo.groomFirstName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomFirstName: value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="아버지 성함"
                value={basicInfo.groomFatherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomFatherName: value }))}
              />
              <StandardInput
                label="어머니 성함"
                value={basicInfo.groomMotherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomMotherName: value }))}
              />
            </div>
          </div>
        </StandardCard>

        {/* 신부 정보 */}
        <StandardCard
          title="신부 정보"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="신부 성"
                value={basicInfo.brideLastName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideLastName: value }))}
              />
              <StandardInput
                label="신부 이름"
                value={basicInfo.brideFirstName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideFirstName: value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="아버지 성함"
                value={basicInfo.brideFatherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideFatherName: value }))}
              />
              <StandardInput
                label="어머니 성함"
                value={basicInfo.brideMotherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideMotherName: value }))}
              />
            </div>
          </div>
        </StandardCard>
      </div>
      <div className="flex justify-end">
        <StandardButton size="md" loading={saving} onClick={handleSaveBasicInfo}>
          <SaveIcon className="w-4 h-4 mr-2" />
          기본 정보 저장
        </StandardButton>
      </div>
    </div>
  );
};
