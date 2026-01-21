import { ReactNode, CSSProperties } from 'react';
import Link from 'next/link';
import { Noto_Sans_KR } from 'next/font/google';
import { QueryProvider } from '@/app/(admin)/admin/components/QueryProvider';
import { AdminLogoutButton } from '@/app/(admin)/admin/components/AdminLogoutButton';

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-admin-sans',
  display: 'swap',
});

/**
 * 관리자 레이아웃
 * @param props { children: ReactNode }
 * @returns JSX.Element
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`admin-scope min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans ${notoSans.variable}`}
      style={{ '--font-sans': 'var(--font-admin-sans)' } as CSSProperties}
    >
      <header className="border-b border-[var(--border-light)] bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div>
            <Link href="/admin" className="text-[18px] font-semibold">
              Wedding Admin
            </Link>
          </div>
          <AdminLogoutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-6 py-8">
        <QueryProvider>{children}</QueryProvider>
      </main>
    </div>
  );
}
