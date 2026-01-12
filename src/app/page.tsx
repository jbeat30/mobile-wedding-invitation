'use client';

import { IntroSection } from '@/components/sections/IntroSection';
import { CoupleSection } from '@/components/sections/CoupleSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { InfoSection } from '@/components/sections/InfoSection';
import { RSVPSection } from '@/components/sections/RSVPSection';
import { GuestbookSection } from '@/components/sections/GuestbookSection';
import { ShareSection } from '@/components/sections/ShareSection';
import { AccountsSection } from '@/components/sections/AccountsSection';
import { LoadingSection } from '@/components/sections/LoadingSection';
import { useLoadingState } from '@/hooks/useLoadingState';
import { invitationMock } from '@/mock/invitation.mock';

/**
 * 퍼블릭 싱글 페이지 레이아웃 스켈레톤 확인
 */
export default function Page() {
  const { loading } = invitationMock;
  const { isLoading } = useLoadingState({
    minDuration: loading.minDuration,
    maxDuration: loading.maxDuration,
  });

  return (
    <div className="min-h-svh bg-[var(--bg-primary)] text-[var(--base-text)]">
      <main className="mobile-container min-h-svh">
        {loading.enabled && <LoadingSection message={loading.message} isVisible={isLoading} />}
        <IntroSection />
        <CoupleSection />
        <GallerySection />
        <InfoSection />
        <RSVPSection />
        <GuestbookSection />
        <ShareSection />
        <AccountsSection />
      </main>
    </div>
  );
}
