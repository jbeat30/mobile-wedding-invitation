import type { Metadata } from 'next';
import { Geist, Geist_Mono, Nanum_Myeongjo, Gowun_Batang } from 'next/font/google';
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

export const metadata: Metadata = {
  title: '모바일 청첩장',
  description: '모바일 청첩장 프론트 엔드',
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
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nanumMyeongjo.variable} ${gowunBatang.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
