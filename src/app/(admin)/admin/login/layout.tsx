import { ReactNode, CSSProperties } from 'react';
import { Noto_Sans_KR } from 'next/font/google';

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-admin-sans',
});

/**
 * 로그인 레이아웃
 * @param props { children: ReactNode }
 * @returns JSX.Element
 */
export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`admin-scope min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans ${notoSans.variable}`}
      style={{ '--font-sans': 'var(--font-admin-sans)' } as CSSProperties}
    >
      {children}
    </div>
  );
}
