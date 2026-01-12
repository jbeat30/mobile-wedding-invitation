import type { Metadata } from 'next';
import { Geist, Geist_Mono, Nanum_Myeongjo, Gowun_Batang, Crimson_Pro } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-nanum',
  display: 'swap',
});

const gowunBatang = Gowun_Batang({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-gowun',
  display: 'swap',
});

const crimsonPro = Crimson_Pro({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '강신랑 · 장신부 결혼식에 초대합니다',
  description: '2026년 05월 16일 오후 2시 30분, 채림 웨딩홀',
};

/**
 * 루트 레이아웃 설정 확인
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nanumMyeongjo.variable} ${gowunBatang.variable} ${crimsonPro.variable} min-h-full bg-[var(--base-surface)] text-[var(--base-text)] font-[var(--font-crimson),var(--font-gowun),var(--font-nanum),serif] antialiased [text-rendering:optimizeLegibility] relative overflow-x-hidden isolate min-[481px]:min-h-screen min-[481px]:[background:radial-gradient(circle_at_top,_#f4ede6_0%,_#e7ded4_60%,_#e2d7cc_100%)]`}
      >
        {children}
      </body>
    </html>
  );
}
