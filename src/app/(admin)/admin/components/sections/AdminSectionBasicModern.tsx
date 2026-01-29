'use client';

import { useState } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { ModernCard, ModernAlert } from '@/components/admin/ModernComponents';
import { ModernInput } from '@/components/admin/ModernForm';
import { ModernButton } from '@/components/admin/ModernButton';
import { 
  UserIcon,
  HeartIcon,
  CalendarIcon,
  ClockIcon,
  SaveIcon,
  MapPinIcon,
  InfoIcon,
  CheckCircle2Icon
} from 'lucide-react';
import { updateBasicInfoAction, updateLocationAction } from '@/app/(admin)/admin/actions/content';
import toast from 'react-hot-toast';
import { useAdminStore } from '@/stores/adminStore';

type AdminSectionBasicProps = {
  data: AdminDashboardData;
};

/**
 * 현대적인 기본 정보 섹션
 */
export const AdminSectionBasic = ({ data }: AdminSectionBasicProps) => {
  const { locationCoords, openPlaceSearchModal, openPostcodeModal } = useAdminStore();
  
  // 기본 정보 상태
  const [basicInfo, setBasicInfo] = useState({
    groomLastName: data.profile?.groom_last_name || '',
    groomFirstName: data.profile?.groom_first_name || '',
    groomNameKor: data.profile?.groom_first_name || '',
    groomFatherName: data.parents?.groom?.father || '',
    groomMotherName: data.parents?.groom?.mother || '',
    brideLastName: data.profile?.bride_last_name || '',
    brideFirstName: data.profile?.bride_first_name || '',
    brideNameKor: data.profile?.bride_first_name || '',
    brideFatherName: data.parents?.bride?.father || '',
    brideMotherName: data.parents?.bride?.mother || '',
  });

  // 결혼식 정보 상태
  const [weddingInfo, setWeddingInfo] = useState({
    weddingDate: data.event?.date_time?.split('T')[0] || '',
    weddingTime: data.event?.date_time?.split('T')[1]?.substring(0, 5) || '',
    placeName: data.location?.place_name || '',
    address: data.location?.address || '',
    roadAddress: '', // 현재 데이터 구조에 없음
    detailAddress: '', // 현재 데이터 구조에 없음
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
    } catch (error) {
      console.error('Basic info save error:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving(prev => ({ ...prev, basic: false }));
    }
  };

  // 결혼식 정보 저장
  const handleSaveWeddingInfo = async () => {
    setSaving(prev => ({ ...prev, wedding: true }));
    try {
      const formData = new FormData();
      Object.entries(weddingInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('latitude', locationCoords.lat.toString());
      formData.append('longitude', locationCoords.lng.toString());

      await updateLocationAction(formData);
      toast.success('예식 정보가 저장되었습니다.');
    } catch (error) {
      console.error('Wedding info save error:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving(prev => ({ ...prev, wedding: false }));
    }
  };

  // 완성도 체크
  const basicInfoComplete = basicInfo.groomNameKor && basicInfo.brideNameKor && 
    basicInfo.groomFatherName && basicInfo.groomMotherName &&
    basicInfo.brideFatherName && basicInfo.brideMotherName;

  const weddingInfoComplete = weddingInfo.weddingDate && weddingInfo.weddingTime && 
    weddingInfo.placeName && weddingInfo.address;

  return (
    <div className="p-6 space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
            <HeartIcon className="w-7 h-7 text-rose-500" />
            <span>기본 정보</span>
          </h1>
          <p className="text-slate-600 mt-1">
            신랑신부의 기본 정보와 결혼식 상세 정보를 입력하세요.
          </p>
        </div>

        {/* 완성도 표시 */}
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            basicInfoComplete && weddingInfoComplete 
              ? 'bg-green-100 text-green-700' 
              : 'bg-amber-100 text-amber-700'
          }`}>
            {basicInfoComplete && weddingInfoComplete ? (
              <>
                <CheckCircle2Icon className="w-4 h-4" />
                <span>완료</span>
              </>
            ) : (
              <>
                <InfoIcon className="w-4 h-4" />
                <span>미완료</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <ModernAlert type="info" title="기본 정보 입력 가이드">
        <ul className="text-sm space-y-1 mt-2">
          <li>• 모든 정보는 청첩장에 표시되는 내용입니다</li>
          <li>• 한글 이름은 청첩장 메인에 표시됩니다</li>
          <li>• 부모님 성함은 정식 인사말에 사용됩니다</li>
          <li>• 예식 정보는 정확히 입력해 주세요</li>
        </ul>
      </ModernAlert>

      {/* 신랑신부 정보 */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 신랑 정보 */}
        <ModernCard
          title="신랑 정보"
          subtitle="신랑과 신랑 측 가족 정보를 입력하세요"
          icon={<UserIcon className="w-5 h-5 text-white" />}
          variant="gradient"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ModernInput
                label="성 (영문)"
                placeholder="예: Kim"
                value={basicInfo.groomLastName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomLastName: value }))}
              />
              <ModernInput
                label="이름 (영문)"
                placeholder="예: Minsu"
                value={basicInfo.groomFirstName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomFirstName: value }))}
              />
            </div>

            <ModernInput
              label="한글 이름 ⭐"
              placeholder="예: 김민수"
              value={basicInfo.groomNameKor}
              onChange={(value) => setBasicInfo(prev => ({ ...prev, groomNameKor: value }))}
              required
              hint="청첩장 메인에 표시되는 이름입니다"
            />

            <div className="grid grid-cols-2 gap-4">
              <ModernInput
                label="신랑 아버지 성함"
                placeholder="예: 김철수"
                value={basicInfo.groomFatherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomFatherName: value }))}
              />
              <ModernInput
                label="신랑 어머니 성함"
                placeholder="예: 이영희"
                value={basicInfo.groomMotherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, groomMotherName: value }))}
              />
            </div>

            <ModernButton
              variant="primary"
              icon={<SaveIcon className="w-4 h-4" />}
              onClick={handleSaveBasicInfo}
              loading={saving.basic}
              fullWidth
            >
              신랑 정보 저장
            </ModernButton>
          </div>
        </ModernCard>

        {/* 신부 정보 */}
        <ModernCard
          title="신부 정보"
          subtitle="신부와 신부 측 가족 정보를 입력하세요"
          icon={<UserIcon className="w-5 h-5 text-white" />}
          variant="gradient"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ModernInput
                label="성 (영문)"
                placeholder="예: Lee"
                value={basicInfo.brideLastName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideLastName: value }))}
              />
              <ModernInput
                label="이름 (영문)"
                placeholder="예: Jihye"
                value={basicInfo.brideFirstName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideFirstName: value }))}
              />
            </div>

            <ModernInput
              label="한글 이름 ⭐"
              placeholder="예: 이지혜"
              value={basicInfo.brideNameKor}
              onChange={(value) => setBasicInfo(prev => ({ ...prev, brideNameKor: value }))}
              required
              hint="청첩장 메인에 표시되는 이름입니다"
            />

            <div className="grid grid-cols-2 gap-4">
              <ModernInput
                label="신부 아버지 성함"
                placeholder="예: 이수호"
                value={basicInfo.brideFatherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideFatherName: value }))}
              />
              <ModernInput
                label="신부 어머니 성함"
                placeholder="예: 박미라"
                value={basicInfo.brideMotherName}
                onChange={(value) => setBasicInfo(prev => ({ ...prev, brideMotherName: value }))}
              />
            </div>

            <ModernButton
              variant="primary"
              icon={<SaveIcon className="w-4 h-4" />}
              onClick={handleSaveBasicInfo}
              loading={saving.basic}
              fullWidth
            >
              신부 정보 저장
            </ModernButton>
          </div>
        </ModernCard>
      </div>

      {/* 예식 정보 */}
      <ModernCard
        title="예식 정보"
        subtitle="결혼식 날짜, 시간, 장소 정보를 입력하세요"
        icon={<MapPinIcon className="w-5 h-5 text-white" />}
        variant="gradient"
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <ModernInput
              label="결혼식 날짜 ⭐"
              type="date"
              value={weddingInfo.weddingDate}
              onChange={(value) => setWeddingInfo(prev => ({ ...prev, weddingDate: value }))}
              required
              icon={<CalendarIcon className="w-4 h-4" />}
            />

            <ModernInput
              label="결혼식 시간 ⭐"
              type="time"
              value={weddingInfo.weddingTime}
              onChange={(value) => setWeddingInfo(prev => ({ ...prev, weddingTime: value }))}
              required
              icon={<ClockIcon className="w-4 h-4" />}
            />
          </div>

          <ModernInput
            label="예식장 이름 ⭐"
            placeholder="예: 롯데호텔 월드 사파이어볼룸"
            value={weddingInfo.placeName}
            onChange={(value) => setWeddingInfo(prev => ({ ...prev, placeName: value }))}
            required
            rightElement={
              <ModernButton
                variant="ghost"
                size="xs"
                onClick={openPlaceSearchModal}
              >
                검색
              </ModernButton>
            }
          />

          <div className="grid md:grid-cols-2 gap-4">
            <ModernInput
              label="기본 주소"
              placeholder="서울특별시 송파구 ..."
              value={weddingInfo.address}
              onChange={(value) => setWeddingInfo(prev => ({ ...prev, address: value }))}
              rightElement={
                <ModernButton
                  variant="ghost"
                  size="xs"
                  onClick={openPostcodeModal}
                >
                  검색
                </ModernButton>
              }
            />

            <ModernInput
              label="도로명 주소"
              placeholder="서울특별시 송파구 올림픽로 240"
              value={weddingInfo.roadAddress}
              onChange={(value) => setWeddingInfo(prev => ({ ...prev, roadAddress: value }))}
            />
          </div>

          <ModernInput
            label="상세 주소"
            placeholder="예: B1층 사파이어볼룸"
            value={weddingInfo.detailAddress}
            onChange={(value) => setWeddingInfo(prev => ({ ...prev, detailAddress: value }))}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              <p>위도: {locationCoords.lat.toFixed(6)}</p>
              <p>경도: {locationCoords.lng.toFixed(6)}</p>
            </div>

            <ModernButton
              variant="primary"
              icon={<SaveIcon className="w-4 h-4" />}
              onClick={handleSaveWeddingInfo}
              loading={saving.wedding}
            >
              예식 정보 저장
            </ModernButton>
          </div>
        </div>
      </ModernCard>

      {/* 완료 상태 */}
      {basicInfoComplete && weddingInfoComplete && (
        <ModernAlert type="success" title="기본 정보 설정 완료!">
          모든 기본 정보가 입력되었습니다. 이제 다른 섹션들을 설정해보세요.
        </ModernAlert>
      )}
    </div>
  );
};