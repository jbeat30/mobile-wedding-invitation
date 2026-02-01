'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/stores/adminStore';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  FileTextIcon,
  PlayIcon,
  UsersIcon,
  MapPinIcon,
  ImageIcon,
  CreditCardIcon,
  MessageSquareIcon,
  ClipboardListIcon,
  ShareIcon,
  MusicIcon,
  HandHeartIcon,
  Settings2Icon,
} from 'lucide-react';

const NAVIGATION_GROUPS = [
  {
    title: '대시보드',
    items: [
      { id: 'overview', label: '개요', icon: HomeIcon, badge: null },
    ]
  },
  {
    title: '콘텐츠 관리',
    items: [
      { id: 'basic', label: '기본 정보', icon: FileTextIcon, badge: null },
      { id: 'loading', label: '로딩 화면', icon: PlayIcon, badge: null },
      { id: 'intro', label: '인트로', icon: FileTextIcon, badge: null },
      { id: 'couple', label: '커플 정보', icon: UsersIcon, badge: null },
      { id: 'location', label: '예식장 정보', icon: MapPinIcon, badge: null },
      { id: 'gallery', label: '갤러리', icon: ImageIcon, badge: 'HOT' },
    ]
  },
  {
    title: '사용자 기능',
    items: [
      { id: 'accounts', label: '계좌 정보', icon: CreditCardIcon, badge: null },
      { id: 'guestbook', label: '게스트북', icon: MessageSquareIcon, badge: null },
      { id: 'rsvp', label: 'RSVP', icon: ClipboardListIcon, badge: null },
    ]
  },
  {
    title: '설정 및 기타',
    items: [
      { id: 'share', label: '공유 설정', icon: ShareIcon, badge: null },
      { id: 'closing', label: '마무리 인사', icon: HandHeartIcon, badge: null },
      { id: 'bgm', label: 'BGM 설정', icon: MusicIcon, badge: null },
    ]
  }
];

interface ModernSidebarProps {
  className?: string;
}

/**
 * 현대적인 CMS 스타일의 사이드바
 * @param props ModernSidebarProps
 * @returns JSX.Element
 */
export const ModernSidebar = ({ className }: ModernSidebarProps) => {
  const { activeTab, sidebarCollapsed, setActiveTab, toggleSidebar } = useAdminStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 키보드 단축키 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '[':
            e.preventDefault();
            toggleSidebar();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return (
    <div
      ref={sidebarRef}
      className={cn(
        'relative flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-out',
        sidebarCollapsed ? 'w-16' : 'w-72',
        'shadow-2xl shadow-slate-900/50 border-r border-slate-700/50',
        className
      )}
    >
      {/* 헤더 */}
      <div className="relative p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Settings2Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Wedding CMS</h1>
                <p className="text-xs text-slate-400">관리자 콘솔</p>
              </div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              'p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/50',
              'focus:outline-none focus:ring-2 focus:ring-rose-400/50',
              sidebarCollapsed && 'mx-auto'
            )}
            title={sidebarCollapsed ? '사이드바 확장 (Cmd+[)' : '사이드바 축소 (Cmd+[)'}
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon className="w-4 h-4 text-slate-300" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
        <nav className="space-y-6">
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.title}>
              {!sidebarCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isHovered = hoveredItem === item.id;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={cn(
                          'group relative w-full flex items-center px-3 py-2.5 text-left transition-all duration-200 rounded-lg',
                          'focus:outline-none focus:ring-2 focus:ring-rose-400/50',
                          isActive
                            ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-white border border-rose-400/30 shadow-lg shadow-rose-500/10'
                            : 'text-slate-300 hover:bg-slate-700/30 hover:text-white border border-transparent',
                          sidebarCollapsed && 'justify-center px-2'
                        )}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        {/* 활성 표시 인디케이터 */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-pink-500 rounded-r-full" />
                        )}
                        
                        <div className={cn(
                          'flex items-center gap-3 w-full',
                          sidebarCollapsed && 'justify-center'
                        )}>
                          <Icon className={cn(
                            'w-5 h-5 transition-all duration-200 flex-shrink-0',
                            isActive 
                              ? 'text-rose-300 drop-shadow-sm' 
                              : 'text-slate-400 group-hover:text-slate-200'
                          )} />
                          
                          {!sidebarCollapsed && (
                            <div className="flex items-center justify-between w-full min-w-0">
                              <span className="text-sm font-medium truncate">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="px-2 py-0.5 text-xs font-bold text-orange-900 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 호버 효과 */}
                        {(isHovered || isActive) && !sidebarCollapsed && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* 푸터 */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <div className="text-slate-400">
              <p className="font-medium">Wedding CMS v1.0</p>
              <p className="text-slate-500">현대적인 관리 시스템</p>
            </div>
          </div>
        </div>
      )}

      {/* 사이드바 축소 시 툴팁을 위한 배경 오버레이 */}
      {sidebarCollapsed && hoveredItem && (
        <div className="fixed inset-0 pointer-events-none z-40" />
      )}
    </div>
  );
};