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
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nanumMyeongjo.variable} ${gowunBatang.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
