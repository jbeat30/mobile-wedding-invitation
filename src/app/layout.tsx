import type { Metadata, Viewport } from 'next';
import { Geist, Nanum_Myeongjo, Gowun_Batang, Crimson_Pro, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { loadInvitationTheme, loadLoadingImageUrl, loadOgMetadata } from '@/app/invitationData';

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

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-admin-sans',
  display: 'swap',
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

export const dynamic = 'force-dynamic';

/**
 * 루트 레이아웃 (로딩 이미지 preload 포함)
 * @param props { children: React.ReactNode }
 * @returns JSX.Element
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, loadingImageUrl] = await Promise.all([
    loadInvitationTheme(),
    loadLoadingImageUrl(),
  ]);
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
      className={`${geistSans.variable} ${nanumMyeongjo.variable} ${gowunBatang.variable} ${crimsonPro.variable} ${notoSansKr.variable}`}
      style={themeStyle}
    >
      <head>
        {loadingImageUrl && (
          <link rel="preload" as="image" href={loadingImageUrl} fetchPriority="high" />
        )}
      </head>
      <body className="antialiased [text-rendering:optimizeLegibility] isolate min-[481px]:[background:radial-gradient(circle_at_top,_#FAF9F7_0%,_#F0EDE8_100%)]">
        {children}
      </body>
    </html>
  );
}
