import { ReactNode, CSSProperties } from 'react';
import { Noto_Sans_KR } from 'next/font/google';
import { QueryProvider } from '@/app/(admin)/admin/components/QueryProvider';
import { getAccessTokenCookie, verifyAccessToken } from '@/lib/adminAuth';
import { AdminBodyFontScope } from '@/app/(admin)/admin/components/AdminBodyFontScope';
import { StandardLayout } from '@/components/admin/StandardLayout';

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-admin-sans',
  display: 'swap',
});

/**
 * 관리자 레이아웃 - 표준 CMS 스타일
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const accessToken = await getAccessTokenCookie();
  const adminPayload = accessToken ? await verifyAccessToken(accessToken) : null;

  return (
    <div
      className={`admin-scope ${notoSans.variable}`}
      style={{ '--font-sans': 'var(--font-admin-sans)' } as CSSProperties}
    >
      <AdminBodyFontScope fontClassName={notoSans.variable} />
      {adminPayload ? (
        <StandardLayout>
          <QueryProvider>{children}</QueryProvider>
        </StandardLayout>
      ) : (
        <QueryProvider>{children}</QueryProvider>
      )}
    </div>
  );
}
