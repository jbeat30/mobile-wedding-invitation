'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from '@/app/(admin)/admin/actions/auth';
import { ModernInput } from '@/components/admin/ModernForm';
import { ModernButton } from '@/components/admin/ModernButton';
import { 
  Settings2Icon,
  UserIcon,
  LockIcon,
  HeartIcon,
  SparklesIcon,
  ShieldCheckIcon
} from 'lucide-react';

/**
 * 관리자 로그인 페이지
 * @returns JSX.Element
 */
export default function AdminLoginPage() {
  const [error, formAction] = useActionState(loginAction, null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  /**
   * 로그인 제출 버튼
   * @returns JSX.Element
   */
  const LoginSubmitButton = () => {
    const { pending } = useFormStatus();

    return (
      <ModernButton 
        type="submit" 
        fullWidth 
        loading={pending}
        size="lg"
        icon={<ShieldCheckIcon className="w-5 h-5" />}
      >
        {pending ? '로그인 중...' : '관리자 로그인'}
      </ModernButton>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-pink-50/30 flex items-center justify-center p-6">
      {/* 배경 데코레이션 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* 로그인 카드 */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-slate-900/10 p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
              <Settings2Icon className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-3">
              <HeartIcon className="w-5 h-5 text-rose-500" />
              <span className="text-sm font-medium text-rose-600 uppercase tracking-wider">Wedding CMS</span>
              <HeartIcon className="w-5 h-5 text-rose-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              관리자 로그인
            </h1>
            <p className="text-slate-600">
              jbeat 청첩장 관리 시스템에 접속하세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <form action={formAction} className="space-y-6">
            <ModernInput
              label="아이디"
              placeholder="관리자 아이디를 입력하세요"
              value={username}
              onChange={setUsername}
              icon={<UserIcon className="w-4 h-4" />}
              required
              name="username"
              autoComplete="username"
            />

            <ModernInput
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={setPassword}
              icon={<LockIcon className="w-4 h-4" />}
              required
              name="password"
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm text-red-700 font-medium">로그인 실패</span>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}

            <LoginSubmitButton />
          </form>

          {/* 푸터 정보 */}
          <div className="mt-8 pt-6 border-t border-slate-200/60">
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
              <SparklesIcon className="w-3 h-3" />
              <span>Modern Wedding Invitation CMS v1.0</span>
              <SparklesIcon className="w-3 h-3" />
            </div>
            <p className="text-center text-xs text-slate-400 mt-1">
              모바일 청첩장 관리자 시스템
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
