'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/** 실시간 동기화 간격 (ms) */
const REFETCH_INTERVAL = 5000;

type QueryProviderProps = {
  children: ReactNode;
};

/**
 * 관리자 페이지용 TanStack Query Provider
 * 실시간 동기화를 위한 QueryClient 설정 포함
 * @param props QueryProviderProps
 * @returns JSX.Element
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchInterval: REFETCH_INTERVAL,
            refetchIntervalInBackground: false,
            staleTime: 0,
            refetchOnWindowFocus: true,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
