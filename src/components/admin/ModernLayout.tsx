'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ModernSidebar } from './ModernSidebar';
import { ModernTopBar } from './ModernTopBar';
import { useAdminStore } from '@/stores/adminStore';
import { Toaster } from 'react-hot-toast';
import {
  XCircleIcon,
} from 'lucide-react';

interface ModernLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * 현대적인 CMS 메인 레이아웃
 * @param props ModernLayoutProps
 * @returns JSX.Element
 */
export const ModernLayout = ({ children, className }: ModernLayoutProps) => {
  const { isLoading, error } = useAdminStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={cn(
      'flex h-screen bg-slate-50/50 overflow-hidden',
      className
    )}>
      {/* 사이드바 */}
      <ModernSidebar className="hidden lg:flex" />

      {/* 모바일 사이드바 오버레이 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative">
            <ModernSidebar />
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 상단바 */}
        <ModernTopBar />

        {/* 콘텐츠 */}
        <main className={cn(
          'flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100/50',
          'transition-all duration-300 ease-out'
        )}>
          <div className="container max-w-7xl mx-auto p-6 space-y-6">
            {/* 에러 상태 표시 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">오류가 발생했습니다</h3>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">데이터 로딩 중</h3>
                  <p className="text-sm text-blue-600 mt-1">잠시만 기다려주세요...</p>
                </div>
              </div>
            )}

            {/* 메인 콘텐츠 */}
            <div className={cn(
              'bg-white rounded-xl border border-slate-200/60 shadow-sm',
              'min-h-[600px] transition-all duration-200'
            )}>
              {children}
            </div>
          </div>
        </main>

        {/* 푸터 */}
        <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm px-6 py-3">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center space-x-4">
              <span>© 2026 Wedding CMS</span>
              <span>•</span>
              <span>jbeat 청첩장 관리 시스템</span>
            </div>
          </div>
        </footer>
      </div>

      {/* 토스트 알림 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};