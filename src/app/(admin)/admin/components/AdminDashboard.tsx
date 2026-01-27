'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { useAdminStore } from '@/stores/adminStore';
import { AdminLayout } from './AdminLayout';
import { AdminContentRouter } from './AdminContentRouter';
import { AdminModals } from './AdminModals';

type AdminDashboardProps = {
  /** 서버에서 로드한 초기 데이터 (hydration용) */
  initialData: AdminDashboardData;
};

/**
 * 관리자 데이터 API 호출
 * @returns Promise<AdminDashboardData>
 */
const fetchAdminData = async (): Promise<AdminDashboardData> => {
  const response = await fetch('/api/admin/data', { credentials: 'include' });
  if (!response.ok) {
    throw new Error('Failed to fetch admin data');
  }
  return response.json();
};

/**
 * 관리자 대시보드 메인 컴포넌트
 * @param props AdminDashboardProps
 * @returns JSX.Element
 */
export const AdminDashboard = ({ initialData }: AdminDashboardProps) => {
  const { setData, setLoading, setError } = useAdminStore();

  // TanStack Query로 데이터 관리
  const { data, isLoading, error } = useQuery<AdminDashboardData>({
    queryKey: ['adminData'],
    queryFn: fetchAdminData,
    initialData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Zustand 스토어 동기화
  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data, setData]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    setError(error?.message || null);
  }, [error, setError]);

  return (
    <AdminLayout>
      <AdminContentRouter />
      <AdminModals />
    </AdminLayout>
  );
};
