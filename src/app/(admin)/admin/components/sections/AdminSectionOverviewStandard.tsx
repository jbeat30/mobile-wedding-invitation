'use client';

import { useAdminStore } from '@/stores/adminStore';
import { StandardCard, StandardButton } from '@/components/admin/StandardComponents';
import { 
  PlusIcon,
  EyeIcon,
  BarChart3Icon,
  ImageIcon,
  MessageSquareIcon,
  UsersIcon
} from 'lucide-react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';

type AdminSectionOverviewProps = {
  overview: AdminDashboardData['overview'];
};

/**
 * 대시보드 - WordPress 스타일
 */
export const AdminSectionOverview = ({ overview }: AdminSectionOverviewProps) => {
  const { data } = useAdminStore();

  const stats = [
    {
      title: '갤러리 이미지',
      value: overview.galleryCount,
      icon: ImageIcon,
      color: 'bg-blue-500'
    },
    {
      title: '방명록',
      value: overview.guestbookCount,
      icon: MessageSquareIcon,
      color: 'bg-green-500'
    },
    {
      title: 'RSVP 응답',
      value: data?.rsvpResponses?.length || 0,
      icon: UsersIcon,
      color: 'bg-purple-500'
    }
  ];

  const quickActions = [
    { label: '갤러리 관리', action: 'gallery', icon: ImageIcon },
    { label: '기본정보 설정', action: 'basic', icon: PlusIcon },
    { label: '방명록 확인', action: 'guestbook', icon: MessageSquareIcon },
    { label: '청첩장 보기', action: 'preview', icon: EyeIcon }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3Icon className="w-6 h-6 mr-3 text-blue-600" />
          대시보드
        </h1>
        <p className="text-gray-600 mt-1">청첩장 관리 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 빠른 작업 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <StandardCard title="빠른 작업">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <StandardButton
                  key={index}
                  variant="secondary"
                  onClick={() => {
                    if (action.action === 'preview') {
                      window.open('/', '_blank');
                    } else {
                      useAdminStore.getState().setActiveTab(action.action);
                    }
                  }}
                  className="flex items-center justify-center space-x-2 h-12"
                >
                  <Icon className="w-4 h-4" />
                  <span>{action.label}</span>
                </StandardButton>
              );
            })}
          </div>
        </StandardCard>

        <StandardCard title="최근 활동">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>시스템이 정상 작동 중입니다</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>갤러리 이미지 {overview.galleryCount}개가 업로드되어 있습니다</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span>방명록 메시지 {overview.guestbookCount}개를 받았습니다</span>
            </div>
          </div>
        </StandardCard>
      </div>

      {/* 도움말 */}
      <StandardCard title="시작하기" className="mt-6">
        <div className="text-sm text-gray-600 space-y-2">
          <p>• 좌측 메뉴에서 각 섹션을 관리할 수 있습니다</p>
          <p>• 기본 정보부터 차례대로 설정해보세요</p>
          <p>• 모든 변경사항은 자동으로 저장됩니다</p>
        </div>
      </StandardCard>
    </div>
  );
};