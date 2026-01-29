'use client';

import { useAdminStore } from '@/stores/adminStore';
import dynamic from 'next/dynamic';

// 스켈레톤 로더
const SectionSkeleton = ({ title: _title }: { title: string }) => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

// 동적 임포트
const AdminSectionOverview = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionOverviewStandard')
    .then(m => ({ default: m.AdminSectionOverview })),
  { loading: () => <SectionSkeleton title="대시보드" /> }
);

const AdminSectionBasic = dynamic(
  () => import('@/app/(admin)/admin/components/sections/AdminSectionBasicStandard')
    .then(m => ({ default: m.AdminSectionBasic })),
  { loading: () => <SectionSkeleton title="기본 정보" /> }
);

/**
 * 관리자 컨텐츠 라우터
 */
export const AdminContentRouter = () => {
  const { activeTab, data } = useAdminStore();

  if (!data) {
    return <SectionSkeleton title="데이터 로딩 중..." />;
  }

  switch (activeTab) {
    case 'overview':
      return <AdminSectionOverview overview={data.overview} />;
    
    case 'basic':
      return <AdminSectionBasic data={data} />;
    
    case 'couple':
    case 'location':
    case 'gallery':
    case 'accounts':
    case 'guestbook':
    case 'rsvp':
    case 'share':
    case 'bgm':
      return (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'couple' && '커플 정보'}
              {activeTab === 'location' && '예식장 정보'}
              {activeTab === 'gallery' && '갤러리'}
              {activeTab === 'accounts' && '계좌 정보'}
              {activeTab === 'guestbook' && '방명록'}
              {activeTab === 'rsvp' && 'RSVP'}
              {activeTab === 'share' && '공유 설정'}
              {activeTab === 'bgm' && 'BGM'}
            </h2>
            <p className="text-gray-600">
              이 섹션은 곧 업데이트 예정입니다.
            </p>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              페이지를 찾을 수 없습니다
            </h2>
            <p className="text-gray-600">
              요청하신 페이지가 존재하지 않습니다.
            </p>
          </div>
        </div>
      );
  }
};