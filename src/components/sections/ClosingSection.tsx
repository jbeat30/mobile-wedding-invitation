import { invitationMock } from '@/mock/invitation.mock';

/**
 * 마무리 섹션
 */
export const ClosingSection = () => {
  const { closing } = invitationMock;

  return (
    <section id="closing" className="bg-[var(--bg-primary)] py-24 pb-32">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
        {/* 마무리 인사 */}
        <div className="text-center" data-animate="fade-up">
          <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {closing.message}
          </p>
          {closing.signature && (
            <p className="mt-6 text-[18px] font-semibold text-[var(--text-primary)]">
              {closing.signature}
            </p>
          )}
        </div>

        {/* 저작권 */}
        {closing.copyright && (
          <div className="text-center" data-animate="fade">
            <p className="text-[12px] text-[var(--text-muted)]">{closing.copyright}</p>
          </div>
        )}
      </div>
    </section>
  );
};
