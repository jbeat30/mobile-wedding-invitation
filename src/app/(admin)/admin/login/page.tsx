'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from '@/app/(admin)/admin/actions/auth';
import { StandardInput, StandardButton } from '@/components/admin/StandardComponents';
import { 
  ShieldCheckIcon
} from 'lucide-react';

/**
 * 표준 로그인 페이지
 */
export default function AdminLoginPage() {
  const [error, formAction] = useActionState(loginAction, null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const LoginSubmitButton = () => {
    const { pending } = useFormStatus();

    return (
      <StandardButton 
        type="submit" 
        loading={pending}
        className="w-full"
      >
        <ShieldCheckIcon className="w-4 h-4 mr-2" />
        {pending ? '로그인 중...' : '로그인'}
      </StandardButton>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 bg-blue-600 rounded-xl flex items-center justify-center">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            관리자 로그인
          </h2>
          <p className="mt-2 text-base text-gray-600">
            청첩장 관리 시스템
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
          <form action={formAction} className="space-y-6">
            <div>
              <StandardInput
                label="아이디"
                placeholder="관리자 아이디"
                value={username}
                onChange={setUsername}
                required
              />
            </div>

            <div>
              <StandardInput
                label="비밀번호"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={setPassword}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <LoginSubmitButton />
          </form>
        </div>

        {/* 푸터 */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Wedding CMS v1.0 - 보안 접속
          </p>
        </div>
      </div>
    </div>
  );
}