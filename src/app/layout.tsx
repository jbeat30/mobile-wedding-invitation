import type { Metadata, Viewport } from 'next';
import { Geist, Nanum_Myeongjo, Gowun_Batang, Crimson_Pro } from 'next/font/google';
import './globals.css';
import { invitationMock } from '@/mock/invitation.mock';

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
  const { theme } = invitationMock;
  const themeStyle = {
    '--font-serif': theme.fonts.serif,
    '--font-serif-en': theme.fonts.serifEn,
    '--font-sans': theme.fonts.sans,
    '--bg-primary': theme.colors.background.primary,
    '--bg-secondary': theme.colors.background.secondary,
    '--bg-tertiary': theme.colors.background.tertiary,
    '--text-primary': theme.colors.text.primary,
    '--text-secondary': theme.colors.text.secondary,
    '--text-tertiary': theme.colors.text.tertiary,
    '--text-muted': theme.colors.text.muted,
    '--accent-rose': theme.colors.accent.rose,
    '--accent-rose-dark': theme.colors.accent.roseDark,
    '--accent-rose-light': theme.colors.accent.roseLight,
    '--accent-burgundy': theme.colors.accent.burgundy,
    '--accent-gold': theme.colors.accent.gold,
    '--wedding-highlight': theme.colors.weddingHighlight.text,
    '--wedding-highlight-bg': theme.colors.weddingHighlight.background,
    '--card-bg': theme.colors.card.background,
    '--card-border': theme.colors.card.border,
    '--border-light': theme.colors.border.light,
    '--divider': theme.colors.border.divider,
    '--shadow-soft': theme.shadow.soft,
    '--shadow-medium': theme.shadow.medium,
    '--shadow-card': theme.shadow.card,
    '--radius-lg': theme.radius.lg,
    '--radius-md': theme.radius.md,
    '--radius-sm': theme.radius.sm,
  } as React.CSSProperties;

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${nanumMyeongjo.variable} ${gowunBatang.variable} ${crimsonPro.variable}`}
      style={themeStyle}
    >
      <body className="antialiased [text-rendering:optimizeLegibility] isolate min-[481px]:[background:radial-gradient(circle_at_top,_#FAF9F7_0%,_#F0EDE8_100%)]">
        {children}
      </body>
    </html>
  );
}
