'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/(admin)/admin/actions/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * 관리자 로그인 페이지
 * @returns JSX.Element
 */
export default function AdminLoginPage() {
  const [error, formAction] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-[420px] p-6">
        <div className="text-center">
          <p className="font-label text-[12px] text-[var(--accent-rose)]">ADMIN</p>
          <h1 className="mt-2 text-[24px] font-semibold text-[var(--text-primary)]">
            관리자 로그인
          </h1>
          <p className="mt-2 text-[13px] text-[var(--text-tertiary)]">
            계정 정보를 입력해주세요
          </p>
        </div>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">아이디</Label>
            <Input id="username" name="username" autoComplete="username" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-[10px] bg-[var(--bg-secondary)] px-3 py-2 text-[12px] text-[var(--accent-burgundy)]">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
      </Card>
    </div>
  );
}
