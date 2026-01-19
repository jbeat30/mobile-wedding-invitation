import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdminAuth } from '@/lib/adminAuth';

const ADMIN_PATH = '/admin';

/**
 * 줄 단위 배열 파싱
 * @param value string
 * @returns string[]
 */
export const parseLines = (value: string) => {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

/**
 * 숫자 변환
 * @param value FormDataEntryValue | null
 * @param fallback number
 * @returns number
 */
export const toNumber = (value: FormDataEntryValue | null, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * 관리자 화면 갱신
 * @returns void
 */
export const revalidateAdmin = () => {
  revalidatePath(ADMIN_PATH);
};

/**
 * 관리자 세션 체크
 * @returns Promise<void>
 */
export const requireAdminSession = async () => {
  const supabase = createSupabaseAdmin();
  try {
    await requireAdminAuth(supabase);
  } catch {
    redirect('/admin/login');
  }
};

/**
 * Supabase 에러 처리
 * @param result { error: unknown }
 * @returns void
 */
export const assertNoError = (result: { error: unknown }) => {
  if (result.error) {
    throw result.error;
  }
};
