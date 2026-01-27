'use client';

import { useAdminStore } from '@/stores/adminStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  PlayIcon,
  UserGroupIcon,
  MapPinIcon,
  PhotoIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  ShareIcon,
  MusicalNoteIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';

const NAVIGATION_ITEMS = [
  { id: 'overview', label: '대시보드', icon: HomeIcon },
  { id: 'basic', label: '기본 정보', icon: DocumentTextIcon },
  { id: 'loading', label: '로딩 섹션', icon: PlayIcon },
  { id: 'intro', label: '인트로 섹션', icon: DocumentTextIcon },
  { id: 'couple', label: '커플 섹션', icon: UserGroupIcon },
  { id: 'location', label: '예식 정보', icon: MapPinIcon },
  { id: 'gallery', label: '갤러리', icon: PhotoIcon },
  { id: 'accounts', label: '계좌 정보', icon: CreditCardIcon },
  { id: 'guestbook', label: '게스트북', icon: ChatBubbleLeftRightIcon },
  { id: 'rsvp', label: 'RSVP', icon: ClipboardDocumentListIcon },
  { id: 'share', label: '공유 설정', icon: ShareIcon },
  { id: 'closing', label: '마무리 인사', icon: HandRaisedIcon },
  { id: 'bgm', label: 'BGM 설정', icon: MusicalNoteIcon },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * 관리자 메인 레이아웃
 * @param props AdminLayoutProps
 * @returns JSX.Element
 */
export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { activeTab, sidebarCollapsed, setActiveTab, toggleSidebar } = useAdminStore();

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 사이드바 */}
      <aside className={cn(
        "flex flex-col bg-white border-r border-slate-200 shadow-sm transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          {!sidebarCollapsed && (
            <h1 className="text-lg font-semibold text-slate-900">관리자 패널</h1>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100"
          >
            {sidebarCollapsed ? (
              <Bars3Icon className="h-5 w-5" />
            ) : (
              <XMarkIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2.5 text-left transition-colors",
                  isActive 
                    ? "bg-rose-50 text-rose-700 hover:bg-rose-100" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  sidebarCollapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate text-sm font-medium">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* 푸터 정보 */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">모바일 청첩장 CMS</p>
            <p className="text-xs text-slate-400">v0.6.0</p>
          </div>
        )}
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 바 */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {NAVIGATION_ITEMS.find(item => item.id === activeTab)?.label || '관리자'}
              </h2>
              <p className="text-sm text-slate-500">청첩장 콘텐츠를 관리하세요</p>
            </div>
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};