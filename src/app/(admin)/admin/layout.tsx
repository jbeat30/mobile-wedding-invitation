import { ReactNode } from 'react';
import Link from 'next/link';
import { Noto_Sans_KR } from 'next/font/google';
import { logoutAction } from '@/app/(admin)/admin/actions/auth';
import { Button } from '@/components/ui/Button';

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

/**
 * 관리자 레이아웃
 * @param props { children: ReactNode }
 * @returns JSX.Element
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`admin-scope min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] ${notoSans.className}`}
    >
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
