'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  clearAuthCookies,
  createAccessToken,
  createRefreshToken,
  getRefreshTokenCookie,
  hashRefreshToken,
  setAuthCookies,
} from '@/lib/adminAuth';

/**
 * 클라이언트 IP 주소 조회
 * @returns Promise<string | null>
 */
const getClientIp = async () => {
  const headersList = await headers();
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    null
  );
};

/**
 * 로그인 로그 기록
 * @param supabase SupabaseClient
 * @param params { adminUserId?: string, username: string, success: boolean, failureReason?: string, ipAddress?: string | null }
 */
const logLoginAttempt = async (
  supabase: ReturnType<typeof createSupabaseAdmin>,
  params: {
    adminUserId?: string;
    username: string;
    success: boolean;
    failureReason?: string;
    ipAddress?: string | null;
  }
) => {
  const headersList = await headers();
  const ipAddress = params.ipAddress ?? (await getClientIp());
  const userAgent = headersList.get('user-agent') || null;

  await supabase.from('admin_login_logs').insert({
    admin_user_id: params.adminUserId || null,
    username: params.username,
    ip_address: ipAddress,
    user_agent: userAgent,
    success: params.success,
    failure_reason: params.failureReason || null,
  });
};

/**
 * 로그인 처리
 * @param prevState string | null
 * @param formData FormData
 * @returns Promise<string | void>
 */
export const loginAction = async (prevState: string | null, formData: FormData) => {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '').trim();

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, username, password_hash, role, is_active')
    .eq('username', username)
    .maybeSingle();

  if (error || !data) {
    await logLoginAttempt(supabase, {
      username,
      success: false,
      failureReason: '사용자 없음',
    });
    return '아이디 또는 비밀번호가 올바르지 않습니다';
  }

  if (!data.is_active) {
    await logLoginAttempt(supabase, {
      adminUserId: data.id,
      username,
      success: false,
      failureReason: '비활성 계정',
    });
    return '아이디 또는 비밀번호가 올바르지 않습니다';
  }

  const isMatch = await bcrypt.compare(password, data.password_hash);
  if (!isMatch) {
    await logLoginAttempt(supabase, {
      adminUserId: data.id,
      username,
      success: false,
      failureReason: '비밀번호 불일치',
    });
    return '아이디 또는 비밀번호가 올바르지 않습니다';
  }

  const accessToken = await createAccessToken({
    sub: data.id,
    username: data.username,
    role: data.role,
  });
  const refreshToken = createRefreshToken();
  const clientIp = await getClientIp();

  await supabase.from('admin_users').update({ last_login_at: new Date().toISOString() }).eq('id', data.id);
  await supabase.from('admin_refresh_tokens').insert({
    admin_user_id: data.id,
    token_hash: refreshToken.hash,
    expires_at: refreshToken.expiresAt.toISOString(),
    ip_address: clientIp,
  });

  await logLoginAttempt(supabase, {
    adminUserId: data.id,
    username,
    success: true,
    ipAddress: clientIp,
  });

  await setAuthCookies({
    accessToken,
    refreshToken: refreshToken.token,
    refreshExpiresAt: refreshToken.expiresAt,
  });

  redirect('/admin');
};

/**
 * 로그아웃 처리
 * @returns Promise<void>
 */
export const logoutAction = async () => {
  const supabase = createSupabaseAdmin();
  const refreshToken = await getRefreshTokenCookie();

  if (refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);
    await supabase
      .from('admin_refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('token_hash', tokenHash);
  }

  await clearAuthCookies();
  redirect('/admin/login');
};
