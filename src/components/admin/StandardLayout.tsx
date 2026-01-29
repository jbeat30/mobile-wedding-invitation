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
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <StandardSidebar />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
            <p className="font-medium">오류가 발생했습니다</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 컨텐츠 영역 */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
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