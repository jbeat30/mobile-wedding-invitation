'use client';

import { useState } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { StandardCard, StandardInput, StandardButton } from '@/components/admin/StandardComponents';
import { 
  UserIcon,
  SaveIcon
} from 'lucide-react';
import { updateBasicInfoAction, updateLocationAction } from '@/app/(admin)/admin/actions/content';
import toast from 'react-hot-toast';

type AdminSectionBasicProps = {
  data: AdminDashboardData;
};

/**
 * 기본 정보 관리 - WordPress 스타일
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

  // 예식 정보 상태
  const [weddingInfo, setWeddingInfo] = useState({
    weddingDate: data.event?.date_time?.split('T')[0] || '',
    weddingTime: data.event?.date_time?.split('T')[1]?.substring(0, 5) || '',
    placeName: data.location?.place_name || '',
    address: data.location?.address || '',
  });

  const [saving, setSaving] = useState({ basic: false, wedding: false });

  // 기본 정보 저장
  const handleSaveBasicInfo = async () => {
    setSaving(prev => ({ ...prev, basic: true }));
    try {
      const formData = new FormData();
      Object.entries(basicInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await updateBasicInfoAction(formData);
      toast.success('기본 정보가 저장되었습니다.');
    } catch (_error) {
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving(prev => ({ ...prev, basic: false }));
    }
  };

  // 예식 정보 저장
  const handleSaveWeddingInfo = async () => {
    setSaving(prev => ({ ...prev, wedding: true }));
    try {
      const formData = new FormData();
      Object.entries(weddingInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await updateLocationAction(formData);
      toast.success('예식 정보가 저장되었습니다.');
    } catch (_error) {
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving(prev => ({ ...prev, wedding: false }));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <UserIcon className="w-6 h-6 mr-3 text-blue-600" />
          기본 정보
        </h1>
        <p className="text-gray-600 mt-1">신랑신부의 기본 정보를 입력하세요</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* 신랑 정보 */}
        <StandardCard 
          title="신랑 정보"
          actions={
            <StandardButton
              loading={saving.basic}
              onClick={handleSaveBasicInfo}
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              저장
            </StandardButton>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="성 (영문)"
                placeholder="Kim"
                value={basicInfo.groomLastName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomLastName: value }))}
              />
              <StandardInput
                label="이름 (영문)"
                placeholder="Minsu"
                value={basicInfo.groomFirstName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomFirstName: value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="아버지 성함"
                placeholder="김철수"
                value={basicInfo.groomFatherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomFatherName: value }))}
              />
              <StandardInput
                label="어머니 성함"
                placeholder="이영희"
                value={basicInfo.groomMotherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomMotherName: value }))}
              />
            </div>
          </div>
        </StandardCard>

        {/* 신부 정보 */}
        <StandardCard 
          title="신부 정보"
          actions={
            <StandardButton
              loading={saving.basic}
              onClick={handleSaveBasicInfo}
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              저장
            </StandardButton>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="성 (영문)"
                placeholder="Lee"
                value={basicInfo.brideLastName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideLastName: value }))}
              />
              <StandardInput
                label="이름 (영문)"
                placeholder="Jihye"
                value={basicInfo.brideFirstName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideFirstName: value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StandardInput
                label="아버지 성함"
                placeholder="이수호"
                value={basicInfo.brideFatherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideFatherName: value }))}
              />
              <StandardInput
                label="어머니 성함"
                placeholder="박미라"
                value={basicInfo.brideMotherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideMotherName: value }))}
              />
            </div>
          </div>
        </StandardCard>
      </div>

      {/* 예식 정보 */}
      <StandardCard 
        title="예식 정보"
        actions={
          <StandardButton
            loading={saving.wedding}
            onClick={handleSaveWeddingInfo}
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            저장
          </StandardButton>
        }
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StandardInput
            label="결혼식 날짜"
            type="date"
            value={weddingInfo.weddingDate}
            onChange={(value) => setWeddingInfo(prev => ({ ...prev, weddingDate: value }))}
            required
          />
          <StandardInput
            label="결혼식 시간"
            type="time"
            value={weddingInfo.weddingTime}
            onChange={(value) => setWeddingInfo(prev => ({ ...prev, weddingTime: value }))}
            required
          />
          <div className="md:col-span-2">
            <StandardInput
              label="예식장 이름"
              placeholder="예식장 이름을 입력하세요"
              value={weddingInfo.placeName}
              onChange={(value) => setWeddingInfo(prev => ({ ...prev, placeName: value }))}
              required
            />
          </div>
        </div>
        
        <StandardInput
          label="주소"
          placeholder="예식장 주소를 입력하세요"
          value={weddingInfo.address}
          onChange={(value) => setWeddingInfo(prev => ({ ...prev, address: value }))}
        />
      </StandardCard>
    </div>
  );
};