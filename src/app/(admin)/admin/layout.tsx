import { ReactNode, CSSProperties } from 'react';
import Link from 'next/link';
import { Noto_Sans_KR } from 'next/font/google';
import { QueryProvider } from '@/app/(admin)/admin/components/QueryProvider';
import { AdminLogoutButton } from '@/app/(admin)/admin/components/AdminLogoutButton';
import { getAccessTokenCookie, verifyAccessToken } from '@/lib/adminAuth';
import { AdminBodyFontScope } from '@/app/(admin)/admin/components/AdminBodyFontScope';

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
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const accessToken = await getAccessTokenCookie();
  const adminPayload = accessToken ? await verifyAccessToken(accessToken) : null;

  return (
    <div
      className={`admin-scope min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans ${notoSans.variable}`}
      style={{ '--font-sans': 'var(--font-admin-sans)' } as CSSProperties}
    >
      <AdminBodyFontScope fontClassName={notoSans.variable} />
      <header className="border-b border-[var(--border-light)] bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div className="flex flex-col">
            <Link href="/admin" className="text-[18px] font-semibold">
              Wedding Admin
            </Link>
            <span className="text-[14px] text-[var(--text-tertiary)]">모바일 청첩장 관리 센터</span>
          </div>
          {adminPayload ? <AdminLogoutButton /> : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-6 py-8">
        <QueryProvider>{children}</QueryProvider>
      </main>
    </div>
  );
}
