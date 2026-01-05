/**
 * 퍼블릭 싱글 페이지 레이아웃 스켈레톤 확인
 */
export default function Page() {
  return (
    <div className="min-h-svh bg-[var(--surface-dark)] text-[var(--text-light)]">
      <main className="min-h-svh">
        <section id="intro" />
        <section id="info" />
        <section id="guestbook" />
        <section id="accounts" />
      </main>
    </div>
  );
}
