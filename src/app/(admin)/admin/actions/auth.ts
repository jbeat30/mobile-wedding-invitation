'use server';

import { redirect } from 'next/navigation';
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

  if (error || !data || !data.is_active) {
    return '아이디 또는 비밀번호가 올바르지 않습니다';
  }

  const isMatch = await bcrypt.compare(password, data.password_hash);
  if (!isMatch) {
    return '아이디 또는 비밀번호가 올바르지 않습니다';
  }

  const accessToken = await createAccessToken({
    sub: data.id,
    username: data.username,
    role: data.role,
  });
  const refreshToken = createRefreshToken();

  await supabase.from('admin_users').update({ last_login_at: new Date().toISOString() }).eq('id', data.id);
  await supabase.from('admin_refresh_tokens').insert({
    admin_user_id: data.id,
    token_hash: refreshToken.hash,
    expires_at: refreshToken.expiresAt.toISOString(),
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
