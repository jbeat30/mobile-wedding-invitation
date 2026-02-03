'use client';

import { ReactNode } from 'react';
import { StandardSidebar } from './StandardSidebar';
import { useAdminStore } from '@/stores/adminStore';
import { Toaster } from 'react-hot-toast';

interface StandardLayoutProps {
  children: ReactNode;
}

/**
 * 표준 CMS 레이아웃 (WordPress, Strapi 스타일)
 */
export const StandardLayout = ({ children }: StandardLayoutProps) => {
  const { error } = useAdminStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 고정 사이드바 */}
      <StandardSidebar />

      {/* 메인 콘텐츠 - 사이드바 너비만큼 왼쪽 패딩 */}
      <div className="lg:pl-64">
        {/* 에러 표시 */}
        {error && (
          <div className="border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
            <p className="font-medium">오류가 발생했습니다</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <main className="min-h-screen p-6">
          <div className="p-8">{children}</div>
        </main>
      </div>

      {/* 알림 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
          },
        }}
      />
    </div>
  );
};
