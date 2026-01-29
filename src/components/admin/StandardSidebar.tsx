'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/stores/adminStore';
import { 
  MenuIcon,
  XIcon,
  HomeIcon,
  FileTextIcon,
  UsersIcon,
  MapPinIcon,
  ImageIcon,
  CreditCardIcon,
  MessageSquareIcon,
  ClipboardListIcon,
  ShareIcon,
  MusicIcon,
  LogOutIcon,
} from 'lucide-react';
import { logoutAction } from '@/app/(admin)/admin/actions/auth';

const NAVIGATION_ITEMS = [
  { id: 'overview', label: '대시보드', icon: HomeIcon },
  { id: 'basic', label: '기본 정보', icon: FileTextIcon },
  { id: 'couple', label: '커플 정보', icon: UsersIcon },
  { id: 'location', label: '예식장 정보', icon: MapPinIcon },
  { id: 'gallery', label: '갤러리', icon: ImageIcon },
  { id: 'accounts', label: '계좌 정보', icon: CreditCardIcon },
  { id: 'guestbook', label: '방명록', icon: MessageSquareIcon },
  { id: 'rsvp', label: 'RSVP', icon: ClipboardListIcon },
  { id: 'share', label: '공유 설정', icon: ShareIcon },
  { id: 'bgm', label: 'BGM', icon: MusicIcon },
];

/**
 * 표준 CMS 사이드바
 */
export const StandardSidebar = () => {
  const { activeTab, setActiveTab } = useAdminStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await logoutAction();
    }
  };

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow-lg rounded-md"
      >
        {collapsed ? <MenuIcon className="w-5 h-5" /> : <XIcon className="w-5 h-5" />}
      </button>

      {/* 사이드바 */}
      <div className={cn(
        'fixed left-0 top-0 h-full bg-gray-900 text-white transition-transform duration-300 z-40',
        'lg:translate-x-0',
        collapsed ? '-translate-x-full' : 'translate-x-0',
        'w-64'
      )}>
        {/* 브랜드 */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">청첩장 CMS</h1>
          <p className="text-sm text-gray-400 mt-1">Wedding Management</p>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors text-sm font-medium',
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 로그아웃 - 하단 고정 */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium"
          >
            <LogOutIcon className="w-5 h-5 flex-shrink-0" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {/* 모바일 오버레이 */}
      {!collapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
};