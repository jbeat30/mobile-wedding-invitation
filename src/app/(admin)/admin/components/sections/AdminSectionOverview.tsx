'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { ModernCard, ModernStatsCard, ModernAlert } from '@/components/admin/ModernComponents';
import { ModernButton } from '@/components/admin/ModernButton';
import { 
  ImageIcon,
  MessageSquareIcon,
  UsersIcon,
  EyeIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  BarChart3Icon,
  PieChartIcon,
  MapPinIcon,
  MusicIcon,
  ShareIcon
} from 'lucide-react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';

type AdminSectionOverviewProps = {
  overview: AdminDashboardData['overview'];
};

/**
 * 현대적인 CMS 대시보드 개요 섹션
 * @returns JSX.Element
 */
export const AdminSectionOverview = ({ overview }: AdminSectionOverviewProps) => {
  const { data } = useAdminStore();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // 실시간 업데이트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 통계 데이터 계산
  const stats = {
    totalImages: overview.galleryCount,
    totalMessages: overview.guestbookCount,
    rsvpResponses: data?.rsvpResponses?.length || 0,
    totalSections: 12,
  };

  // 완료 상태 체크
  const completionStatus = [
    { 
      name: '기본 정보', 
      completed: !!(data?.profile?.bride_first_name && data?.profile?.groom_first_name),
      section: 'basic'
    },
    { 
      name: '갤러리', 
      completed: stats.totalImages > 0,
      section: 'gallery'
    },
    { 
      name: '예식 정보', 
      completed: !!(data?.location?.place_name),
      section: 'location'
    },
    { 
      name: '계좌 정보', 
      completed: (data?.accountEntries?.length || 0) > 0,
      section: 'accounts'
    },
    { 
      name: 'BGM 설정', 
      completed: !!(data?.bgm?.audio_url),
      section: 'bgm'
    },
  ];

  const completedSections = completionStatus.filter(s => s.completed).length;
  const completionPercentage = Math.round((completedSections / completionStatus.length) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침입니다! ☀️';
    if (hour < 18) return '좋은 오후입니다! 🌤️';
    return '좋은 저녁입니다! 🌙';
  };

  return (
    <div className="p-6 space-y-8">
      {/* 환영 메시지 */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        <div className="relative">
          <h1 className="text-2xl font-bold mb-2">{getGreeting()}</h1>
          <p className="text-rose-100 mb-4">
            jbeat 청첩장 관리 시스템에 오신 것을 환영합니다. 아름다운 결혼식을 준비해보세요.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <ClockIcon className="w-4 h-4" />
              <span>마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle2Icon className="w-4 h-4" />
              <span>{completionPercentage}% 완료</span>
            </div>
          </div>
        </div>
      </div>

      {/* 주요 통계 카드들 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernStatsCard
          title="갤러리 이미지"
          value={stats.totalImages}
          change={stats.totalImages > 10 ? "+5 이번 주" : "더 추가해보세요"}
          changeType={stats.totalImages > 10 ? "increase" : "neutral"}
          icon={<ImageIcon className="w-6 h-6 text-white" />}
        />
        
        <ModernStatsCard
          title="방명록 메시지"
          value={stats.totalMessages}
          change={stats.totalMessages > 5 ? "+2 오늘" : "축하 메시지를 기다려요"}
          changeType={stats.totalMessages > 5 ? "increase" : "neutral"}
          icon={<MessageSquareIcon className="w-6 h-6 text-white" />}
        />
        
        <ModernStatsCard
          title="RSVP 응답"
          value={stats.rsvpResponses}
          change={stats.rsvpResponses > 10 ? "응답률 85%" : "참석 의사를 받아보세요"}
          changeType={stats.rsvpResponses > 10 ? "increase" : "neutral"}
          icon={<UsersIcon className="w-6 h-6 text-white" />}
        />
        
        <ModernStatsCard
          title="설정 완료율"
          value={`${completionPercentage}%`}
          change={completionPercentage === 100 ? "모두 완료!" : `${completionStatus.length - completedSections}개 남음`}
          changeType={completionPercentage > 80 ? "increase" : completionPercentage > 50 ? "neutral" : "decrease"}
          icon={<PieChartIcon className="w-6 h-6 text-white" />}
        />
      </div>

      {/* 빠른 액션 및 완료 상태 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 빠른 액션 */}
        <ModernCard
          title="빠른 작업"
          subtitle="자주 사용하는 기능에 빠르게 접근하세요"
          icon={<BarChart3Icon className="w-5 h-5 text-white" />}
        >
          <div className="grid grid-cols-2 gap-3">
            <ModernButton 
              variant="outline" 
              size="sm" 
              icon={<ImageIcon className="w-4 h-4" />}
              onClick={() => useAdminStore.getState().setActiveTab('gallery')}
            >
              갤러리 관리
            </ModernButton>
            
            <ModernButton 
              variant="outline" 
              size="sm" 
              icon={<MapPinIcon className="w-4 h-4" />}
              onClick={() => useAdminStore.getState().setActiveTab('location')}
            >
              예식장 설정
            </ModernButton>
            
            <ModernButton 
              variant="outline" 
              size="sm" 
              icon={<MusicIcon className="w-4 h-4" />}
              onClick={() => useAdminStore.getState().setActiveTab('bgm')}
            >
              BGM 설정
            </ModernButton>
            
            <ModernButton 
              variant="outline" 
              size="sm" 
              icon={<ShareIcon className="w-4 h-4" />}
              onClick={() => useAdminStore.getState().setActiveTab('share')}
            >
              공유 설정
            </ModernButton>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
            <ModernButton 
              variant="primary" 
              size="sm" 
              icon={<EyeIcon className="w-4 h-4" />}
              onClick={() => window.open('/', '_blank')}
              fullWidth
            >
              청첩장 미리보기
            </ModernButton>
          </div>
        </ModernCard>

        {/* 설정 완료 상태 */}
        <ModernCard
          title="설정 진행상황"
          subtitle="청첩장 설정의 완료 상태를 확인하세요"
          icon={<CheckCircle2Icon className="w-5 h-5 text-white" />}
        >
          <div className="space-y-3">
            {completionStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {status.completed ? (
                    <CheckCircle2Icon className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangleIcon className="w-5 h-5 text-amber-500" />
                  )}
                  <span className="text-sm font-medium text-slate-700">
                    {status.name}
                  </span>
                </div>
                <ModernButton
                  variant="ghost"
                  size="xs"
                  onClick={() => useAdminStore.getState().setActiveTab(status.section)}
                >
                  {status.completed ? '수정' : '설정'}
                </ModernButton>
              </div>
            ))}
          </div>

          {completionPercentage === 100 && (
            <ModernAlert type="success" title="축하합니다!" className="mt-4">
              모든 기본 설정이 완료되었습니다. 이제 청첩장을 공유할 준비가 되었어요!
            </ModernAlert>
          )}
        </ModernCard>
      </div>

      {/* 최근 활동 */}
      <ModernCard
        title="최근 활동"
        subtitle="시스템의 최근 변경사항을 확인하세요"
        icon={<ClockIcon className="w-5 h-5 text-white" />}
      >
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">갤러리가 업데이트되었습니다</p>
              <p className="text-xs text-blue-700 mt-1">2분 전 • {stats.totalImages}개의 이미지</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">새로운 방명록 메시지</p>
              <p className="text-xs text-green-700 mt-1">15분 전 • 총 {stats.totalMessages}개 메시지</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900">RSVP 응답이 도착했습니다</p>
              <p className="text-xs text-purple-700 mt-1">1시간 전 • 총 {stats.rsvpResponses}명 응답</p>
            </div>
          </div>
        </div>
      </ModernCard>

      {/* 도움말 및 팁 */}
      <ModernCard
        title="💡 알아두면 좋은 팁"
        subtitle="청첩장을 더욱 매력적으로 만들어보세요"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <ModernAlert type="tip" title="갤러리 최적화">
            이미지는 3MB 이하로 업로드하면 로딩 속도가 빨라집니다.
          </ModernAlert>
          
          <ModernAlert type="info" title="BGM 설정">
            YouTube 링크를 사용하면 자동으로 음악이 재생됩니다.
          </ModernAlert>
        </div>
      </ModernCard>
    </div>
  );
};
