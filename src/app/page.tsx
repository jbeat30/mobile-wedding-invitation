'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LoadingSection } from '@/components/sections/LoadingSection';
import { useLoadingState } from '@/hooks/useLoadingState';
import { invitationMock } from '@/mock/invitation.mock';

const IntroSection = dynamic(
  () => import('@/components/sections/IntroSection').then((mod) => mod.IntroSection),
  { ssr: false }
);
const CoupleSection = dynamic(
  () => import('@/components/sections/CoupleSection').then((mod) => mod.CoupleSection),
  { ssr: false }
);
const GallerySection = dynamic(
  () => import('@/components/sections/GallerySection').then((mod) => mod.GallerySection),
  { ssr: false }
);
const InfoSection = dynamic(
  () => import('@/components/sections/InfoSection').then((mod) => mod.InfoSection),
  { ssr: false }
);
const RSVPSection = dynamic(
  () => import('@/components/sections/RSVPSection').then((mod) => mod.RSVPSection),
  { ssr: false }
);
const GuestbookSection = dynamic(
  () => import('@/components/sections/GuestbookSection').then((mod) => mod.GuestbookSection),
  { ssr: false }
);
const ShareSection = dynamic(
  () => import('@/components/sections/ShareSection').then((mod) => mod.ShareSection),
  { ssr: false }
);
const AccountsSection = dynamic(
  () => import('@/components/sections/AccountsSection').then((mod) => mod.AccountsSection),
  { ssr: false }
);

/**
 * 퍼블릭 싱글 페이지 레이아웃 스켈레톤 확인
 */
export default function Page() {
  const { loading } = invitationMock;
  const { isLoading } = useLoadingState({
    minDuration: loading.minDuration,
    additionalDuration: loading.additionalDuration,
  });
  const showLoading = loading.enabled;
  const showContent = !loading.enabled || !isLoading;

  useEffect(() => {
    if (!loading.enabled || !isLoading) {
      return;
    }

    void Promise.all([
      import('@/components/sections/IntroSection'),
      import('@/components/sections/CoupleSection'),
      import('@/components/sections/GallerySection'),
      import('@/components/sections/InfoSection'),
      import('@/components/sections/RSVPSection'),
      import('@/components/sections/GuestbookSection'),
      import('@/components/sections/ShareSection'),
      import('@/components/sections/AccountsSection'),
    ]);
  }, [loading.enabled, isLoading]);

  return (
    <div className="min-h-svh bg-[var(--bg-primary)] text-[var(--base-text)]">
      <main className="mobile-container min-h-svh">
        {showLoading && <LoadingSection message={loading.message} isVisible={isLoading} />}
        {showContent && (
          <>
            <IntroSection />
            <CoupleSection />
            <GallerySection />
            <InfoSection />
            <RSVPSection />
            <GuestbookSection />
            <ShareSection />
            <AccountsSection />
          </>
        )}
      </main>
    </div>
  );
}
