import { ReactNode } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/(admin)/admin/actions';
import { Button } from '@/components/ui/Button';

/**
 * 관리자 레이아웃
 * @param props { children: ReactNode }
 * @returns JSX.Element
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-light)] bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div>
            <Link href="/admin" className="text-[18px] font-semibold">
              Wedding Admin
            </Link>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm" className="bg-white">
              로그아웃
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-6 py-8">{children}</main>
    </div>
  );
}
