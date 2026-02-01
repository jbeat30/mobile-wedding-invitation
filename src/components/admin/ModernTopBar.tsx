'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/stores/adminStore';
import { 
  BellIcon, 
  UserCircleIcon, 
  SearchIcon,
  RefreshCcwIcon,
  SaveIcon,
  Settings2Icon,
  MoonIcon,
  SunIcon
} from 'lucide-react';

interface ModernTopBarProps {
  className?: string;
}

/**
 * 현대적인 CMS 스타일의 상단바
 * @param props ModernTopBarProps
 * @returns JSX.Element
 */
export const ModernTopBar = ({ className }: ModernTopBarProps) => {
  const { activeTab, isLoading } = useAdminStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 실시간 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 섹션 제목 매핑
  const getSectionTitle = () => {
    const sectionMap = {
      overview: '대시보드',
      basic: '기본 정보',
      loading: '로딩 화면',
      intro: '인트로',
      couple: '커플 정보',
      location: '예식장 정보',
      gallery: '갤러리',
      accounts: '계좌 정보',
      guestbook: '게스트북',
      rsvp: 'RSVP',
      share: '공유 설정',
      closing: '마무리 인사',
      bgm: 'BGM 설정',
    };
    return sectionMap[activeTab as keyof typeof sectionMap] || '관리자 페이지';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <header className={cn(
      'sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm',
      className
    )}>
      <div className="flex items-center justify-between h-16 px-6">
        {/* 왼쪽: 제목과 브레드크럼 */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {getSectionTitle()}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <span>Wedding CMS</span>
              <span>•</span>
              <span>{getSectionTitle()}</span>
              {isLoading && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <RefreshCcwIcon className="w-3 h-3 animate-spin" />
                    <span>동기화 중</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 가운데: 검색바 (큰 화면에서만 표시) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="설정 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400',
                'placeholder:text-slate-400 transition-all duration-200'
              )}
            />
          </div>
        </div>

        {/* 오른쪽: 시간, 알림, 프로필 */}
        <div className="flex items-center space-x-4">
          {/* 시간 표시 */}
          <div className="hidden lg:flex flex-col items-end text-sm">
            <div className="font-mono font-medium text-slate-900">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-slate-500">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* 구분선 */}
          <div className="hidden lg:block w-px h-8 bg-slate-200" />

          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-2">
            {/* 새로고침 버튼 */}
            <button
              onClick={() => window.location.reload()}
              disabled={isLoading}
              className={cn(
                'p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-rose-400/20',
                isLoading && 'cursor-not-allowed opacity-50'
              )}
              title="페이지 새로고침"
            >
              <RefreshCcwIcon className={cn(
                'w-4 h-4',
                isLoading && 'animate-spin'
              )} />
            </button>

            {/* 저장 상태 표시 */}
            <div className="flex items-center space-x-1">
              <SaveIcon className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600 font-medium">저장됨</span>
            </div>

            {/* 다크모드 토글 */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                'p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-rose-400/20'
              )}
              title="다크모드 토글"
            >
              {isDarkMode ? (
                <SunIcon className="w-4 h-4" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </button>

            {/* 알림 */}
            <button
              className={cn(
                'relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-rose-400/20'
              )}
              title="알림"
            >
              <BellIcon className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white">
                <div className="w-full h-full bg-red-500 rounded-full animate-pulse" />
              </div>
            </button>

            {/* 설정 */}
            <button
              className={cn(
                'p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-rose-400/20'
              )}
              title="설정"
            >
              <Settings2Icon className="w-4 h-4" />
            </button>

            {/* 구분선 */}
            <div className="w-px h-6 bg-slate-200" />

            {/* 사용자 프로필 */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-900">관리자</span>
                <span className="text-xs text-slate-500">Wedding Admin</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 진행 표시 바 */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 to-pink-500 animate-pulse" />
      )}
    </header>
  );
};