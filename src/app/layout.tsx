import type { Metadata, Viewport } from 'next';
import { Geist, Nanum_Myeongjo, Gowun_Batang, Crimson_Pro } from 'next/font/google';
import './globals.css';
import { loadOgMetadata } from '@/app/invitationData';
import { getCachedTheme } from '@/lib/invitationCache';
import { Agentation } from 'agentation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-nanum',
  display: 'swap',
  preload: false,
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
  preload: false,
});

/**
 * 동적 메타데이터 생성 (OG 태그 포함)
 * 검색엔진은 차단하되 카카오톡 등 소셜 공유용 OG 태그는 유지
 * @returns Metadata 객체
 */
export const generateMetadata = async (): Promise<Metadata> => {
  const ogMeta = await loadOgMetadata();

  return {
    title: ogMeta.title,
    description: ogMeta.description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
    openGraph: {
      title: ogMeta.title,
      description: ogMeta.description,
      type: 'website',
      locale: 'ko_KR',
      ...(ogMeta.imageUrl && {
        images: [
          {
            url: ogMeta.imageUrl,
            width: 1200,
            height: 630,
            alt: ogMeta.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogMeta.title,
      description: ogMeta.description,
      ...(ogMeta.imageUrl && { images: [ogMeta.imageUrl] }),
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
    },
  };
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

// 60초 동안 캐싱하여 초기 로딩 속도 개선
export const revalidate = 60;

/**
 * 루트 레이아웃
 * @param props { children: React.ReactNode }
 * @returns JSX.Element
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // React.cache()로 캐시됨 - page.tsx에서 재호출해도 중복 쿼리 없음
  const theme = await getCachedTheme();
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
      <head />
      <body className="antialiased [text-rendering:optimizeLegibility] isolate min-[481px]:[background:radial-gradient(circle_at_top,_#FAF9F7_0%,_#F0EDE8_100%)]">
        {children}
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </body>
    </html>
  );
}
