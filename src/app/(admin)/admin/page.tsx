import { loadAdminData } from '@/app/(admin)/admin/data';
import { AdminDashboard } from '@/app/(admin)/admin/components/AdminDashboard';

/**
 * 관리자 대시보드
 * @returns JSX.Element
 */
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const data = await loadAdminData();

  return (
    <div className="flex flex-col gap-6">
      <AdminDashboard initialData={data} />
    </div>
  );
}
