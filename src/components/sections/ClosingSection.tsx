import { invitationMock } from '@/mock/invitation.mock';

/**
 * 마무리 섹션
 */
export const ClosingSection = () => {
  const { closing } = invitationMock;

  return (
    <section id="closing" className="bg-[var(--bg-primary)] py-16 pb-24">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="font-label text-[11px] text-[var(--text-muted)]">THANK YOU</span>
        </div>

        {/* 마무리 인사 */}
        <div className="text-center" data-animate="fade-up">
          <p className="font-serif text-[15px] leading-[1.9] text-[var(--text-secondary)]">
            {closing.message}
          </p>
          {closing.signature && (
            <p className="mt-6 font-serif text-[18px] font-medium text-[var(--text-primary)]">
              {closing.signature}
            </p>
          )}
        </div>

        {/* 저작권 */}
        {closing.copyright && (
          <div className="text-center pt-8" data-animate="fade">
            <p className="text-[11px] text-[var(--text-muted)]">{closing.copyright}</p>
          </div>
        )}
      </div>
    </section>
  );
};
