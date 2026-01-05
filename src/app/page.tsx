import { IntroSection } from '@/components/sections/IntroSection';

/**
 * 퍼블릭 싱글 페이지 레이아웃 스켈레톤 확인
 */
export default function Page() {
  return (
    <div className="min-h-svh bg-[#d6d6d6] text-[#5f5f5f]">
      <main className="min-h-svh">
        <IntroSection />
        <section id="info" />
        <section id="guestbook" />
        <section id="accounts" />
      </main>
    </div>
  );
}
