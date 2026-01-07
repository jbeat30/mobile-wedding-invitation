import { IntroSection } from '@/components/sections/IntroSection';
import { InfoSection } from '@/components/sections/InfoSection';
import { GuestbookSection } from '@/components/sections/GuestbookSection';
import { AccountsSection } from '@/components/sections/AccountsSection';

/**
 * 퍼블릭 싱글 페이지 레이아웃 스켈레톤 확인
 */
export default function Page() {
  return (
    <div className="min-h-svh bg-[var(--base-surface)] text-[var(--base-text)]">
      <main className="min-h-svh">
        <IntroSection />
        <InfoSection />
        <GuestbookSection />
        <AccountsSection />
      </main>
    </div>
  );
}
