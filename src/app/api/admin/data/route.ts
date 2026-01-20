import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdminAuth } from '@/lib/adminAuth';
import { loadAdminData } from '@/app/(admin)/admin/data';

/**
 * 관리자 대시보드 데이터 API
 * TanStack Query 실시간 동기화용
 * @returns Promise<Response>
 */
export const GET = async () => {
  const supabase = createSupabaseAdmin();

  try {
    await requireAdminAuth(supabase);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await loadAdminData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin data load error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
