import { createHash, randomBytes } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';

const ACCESS_COOKIE = 'admin_access_token';
const REFRESH_COOKIE = 'admin_refresh_token';
const ACCESS_TTL_SEC = 60 * 15;
const REFRESH_TTL_SEC = 60 * 60 * 24 * 14;

export type AdminJwtPayload = {
  sub: string;
  username: string;
  role: string;
};

type AuthCookies = {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
};

type RequireAuthOptions = {
  allowRefresh?: boolean;
};

const getJwtSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET || '';
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is missing');
  }
  return new TextEncoder().encode(secret);
};

/**
 * 액세스 토큰 생성
 * @param payload AdminJwtPayload
 * @returns Promise<string>
 */
export const createAccessToken = async (payload: AdminJwtPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SEC}s`)
    .sign(getJwtSecret());
};

/**
 * 액세스 토큰 검증
 * @param token string
 * @returns Promise<AdminJwtPayload | null>
 */
export const verifyAccessToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as AdminJwtPayload;
  } catch {
    return null;
  }
};

/**
 * 리프레시 토큰 생성
 * @returns { token: string, hash: string, expiresAt: Date }
 */
export const createRefreshToken = () => {
  const token = randomBytes(48).toString('base64url');
  const hash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);
  return { token, hash, expiresAt };
};

/**
 * 리프레시 토큰 해시
 * @param token string
 * @returns string
 */
export const hashRefreshToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};

/**
 * 인증 쿠키 저장
 * @param payload AuthCookies
 * @returns Promise<void>
 */
export const setAuthCookies = async ({
  accessToken,
  refreshToken,
  refreshExpiresAt,
}: AuthCookies) => {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ACCESS_TTL_SEC,
  });

  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.max(0, Math.floor((refreshExpiresAt.getTime() - Date.now()) / 1000)),
  });
};

/**
 * 인증 쿠키 삭제
 * @returns Promise<void>
 */
export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
};

/**
 * 액세스 토큰 쿠키 조회
 * @returns Promise<string | null>
 */
export const getAccessTokenCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value ?? null;
};

/**
 * 리프레시 토큰 쿠키 조회
 * @returns Promise<string | null>
 */
export const getRefreshTokenCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE)?.value ?? null;
};

/**
 * 관리자 인증 확인
 * @param supabase SupabaseClient
 * @param options RequireAuthOptions
 * @returns Promise<AdminJwtPayload>
 */
export const requireAdminAuth = async (
  supabase: SupabaseClient,
  options: RequireAuthOptions = {}
) => {
  const accessToken = await getAccessTokenCookie();
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      return payload;
    }
  }

  if (options.allowRefresh === false) {
    throw new Error('Unauthorized');
  }

  const refreshToken = await getRefreshTokenCookie();
  if (!refreshToken) {
    throw new Error('Unauthorized');
  }

  const tokenHash = hashRefreshToken(refreshToken);
  const { data, error } = await supabase
    .from('admin_refresh_tokens')
    .select('id, admin_user_id, expires_at, revoked_at, admin_users (username, role)')
    .eq('token_hash', tokenHash)
    .maybeSingle();

  if (error || !data || data.revoked_at || new Date(data.expires_at) <= new Date()) {
    await clearAuthCookies();
    throw new Error('Unauthorized');
  }

  const admin = Array.isArray(data.admin_users) ? data.admin_users[0] : data.admin_users;
  const username = admin?.username || 'admin';
  const role = admin?.role || 'admin';

  const newAccessToken = await createAccessToken({
    sub: data.admin_user_id,
    username,
    role,
  });
  const newRefresh = createRefreshToken();

  await supabase
    .from('admin_refresh_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', data.id);
  await supabase.from('admin_refresh_tokens').insert({
    admin_user_id: data.admin_user_id,
    token_hash: newRefresh.hash,
    expires_at: newRefresh.expiresAt.toISOString(),
  });

  await setAuthCookies({
    accessToken: newAccessToken,
    refreshToken: newRefresh.token,
    refreshExpiresAt: newRefresh.expiresAt,
  });

  return { sub: data.admin_user_id, username, role };
};

/**
 * 액세스 토큰 단독 검증
 * @returns Promise<AdminJwtPayload>
 */
export const requireAccessToken = async () => {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    throw new Error('Unauthorized');
  }

  return payload;
};
