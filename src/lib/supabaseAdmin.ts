import { createClient } from '@supabase/supabase-js';

type SupabaseAdminEnv = NodeJS.ProcessEnv & {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

/**
 * Supabase 서버 관리자 클라이언트
 * @param env SupabaseAdminEnv
 * @returns SupabaseClient
 */
export const createSupabaseAdmin = (env: SupabaseAdminEnv = process.env) => {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase admin env is missing');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
};
