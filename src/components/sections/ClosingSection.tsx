import type { InvitationClosing, InvitationCouple } from '@/mock/invitation.mock';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HeartIcon } from '@/components/ui/HeartIcon';

type ClosingSectionProps = {
  closing: InvitationClosing;
  couple: InvitationCouple;
};

/**
 * 마무리 섹션
 */
export const ClosingSection = ({ closing, couple }: ClosingSectionProps) => {
  return (
    <section id="closing" className="bg-[var(--bg-primary)] py-12 pb-8">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
        {/* 섹션 헤더 */}
        <div
          className="text-center"
          data-animate="fade-up"
          data-animate-start="90"
          data-animate-trigger="section"
        >
          <SectionHeader
            kicker={closing.section_title || 'THANK YOU'}
            kickerClassName="font-label text-[14px] text-[var(--accent-rose)]"
          />
        </div>

        {/* 마무리 인사 */}
        <div className="text-center" data-animate="fade-up" data-animate-start="90">
          <p className="whitespace-pre-line font-serif text-[14px] leading-[1.9] text-[var(--text-secondary)] break-keep">
            {closing.message}
          </p>
          <p className="flex justify-center items-center gap-3 mt-6 font-serif text-[18px] font-medium text-[var(--text-primary)]">
            {`${couple.groom.lastName}${couple.groom.firstName}`}
            <HeartIcon fill="#f87171" />
            {`${couple.bride.lastName}${couple.bride.firstName}`}
          </p>
        </div>

        {closing.copyright && (
          <div className="text-center pt-12" data-animate="fade" data-animate-start="90">
            <p className="text-[11px] text-[var(--text-tertiary)]">{closing.copyright}</p>
          </div>
        )}
      </div>
    </section>
  );
};
