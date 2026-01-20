import { redirect } from 'next/navigation';
import { loadAdminData } from '@/app/(admin)/admin/data';
import { AdminDashboard } from '@/app/(admin)/admin/components/AdminDashboard';
import { requireAccessToken } from '@/lib/adminAuth';

/**
 * 관리자 대시보드
 * @returns JSX.Element
 */
export default async function AdminPage() {
  try {
    await requireAccessToken();
  } catch {
    redirect('/admin/login');
  }

  const data = await loadAdminData();

  return (
    <div className="flex flex-col gap-6">
      <AdminDashboard initialData={data} />
    </div>
  );
}
