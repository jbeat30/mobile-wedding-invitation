import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdminAuth } from '@/lib/adminAuth';

/**
 * 관리자 토큰 갱신
 * @param request Request
 * @returns Promise<Response>
 */
export const GET = async (request: Request) => {
  const supabase = createSupabaseAdmin();
  const url = new URL(request.url);
  const nextParam = url.searchParams.get('next') || '/admin';
  const nextPath =
    nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/admin';

  try {
    await requireAdminAuth(supabase, { allowRefresh: true });
    return NextResponse.redirect(new URL(nextPath, url.origin));
  } catch {
    return NextResponse.redirect(new URL('/admin/login', url.origin));
  }
};
