import type { Metadata, Viewport } from 'next';
import { Geist, Nanum_Myeongjo, Gowun_Batang, Crimson_Pro } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-nanum',
  display: 'swap',
  preload: true,
});

const gowunBatang = Gowun_Batang({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-gowun',
  display: 'swap',
  preload: true,
});

const crimsonPro = Crimson_Pro({
  weight: ['400', '600', '700'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-crimson',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '강신랑 · 장신부 결혼식에 초대합니다',
  description: '2026년 05월 16일 오후 2시 30분, 채림 웨딩홀',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
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
    <html
      lang="ko"
      className={`${geistSans.variable} ${nanumMyeongjo.variable} ${gowunBatang.variable} ${crimsonPro.variable}`}
    >
      <body className="antialiased [text-rendering:optimizeLegibility] isolate min-[481px]:[background:radial-gradient(circle_at_top,_#FAF9F7_0%,_#F0EDE8_100%)]">
        {children}
      </body>
    </html>
  );
}
