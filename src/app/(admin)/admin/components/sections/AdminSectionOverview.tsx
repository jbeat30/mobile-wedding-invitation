'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { OverviewCard } from '@/app/(admin)/admin/components/OverviewCard';

type AdminSectionOverviewProps = {
  overview: AdminDashboardData['overview'];
};

/**
 * 요약 섹션
 * @returns JSX.Element
 */
export const AdminSectionOverview = ({ overview }: AdminSectionOverviewProps) => {
  return <OverviewCard data={overview} />;
};
