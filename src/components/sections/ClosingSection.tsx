import type { InvitationClosing, InvitationCouple } from '@/mock/invitation.mock';
import { SectionHeader } from '@/components/ui/SectionHeader';

type ClosingSectionProps = {
  closing: InvitationClosing;
  couple: InvitationCouple;
};

/**
 * 마무리 섹션
 */
export const ClosingSection = ({ closing, couple }: ClosingSectionProps) => {
  return (
    <section id="closing" className="bg-[var(--bg-primary)] py-16 pb-24">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <SectionHeader
            kicker={closing.title || 'THANK YOU'}
            kickerClassName="font-label text-[14px] text-[var(--accent-rose)]"
          />
        </div>

        {/* 마무리 인사 */}
        <div className="text-center" data-animate="fade-up">
          <p className="whitespace-pre-line font-serif text-[14px] leading-[1.9] text-[var(--text-secondary)] break-keep">
            {closing.message}
          </p>
          <p className="flex justify-center items-center gap-3 mt-6 font-serif text-[18px] font-medium text-[var(--text-primary)]">
            {`${couple.groom.lastName}${couple.groom.firstName}`}
            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.88721 5.6442L5.23558 9.85513C5.50241 10.1135 5.92616 10.1135 6.19299 9.85513L10.5414 5.6442C11.1084 5.09504 11.4286 4.33939 11.4286 3.54999C11.4286 1.93996 10.1234 0.634766 8.51334 0.634766H8.37789C7.58576 0.634766 6.82469 0.942878 6.25565 1.49393L5.74766 1.98587C5.72906 2.00388 5.69951 2.00388 5.68091 1.98587L5.17292 1.49393C4.60388 0.942878 3.84281 0.634766 3.05068 0.634766H2.91523C1.30519 0.634766 0 1.93996 0 3.54999C0 4.33939 0.320132 5.09504 0.88721 5.6442Z" fill="#f87171"></path>
            </svg>
            {`${couple.bride.lastName}${couple.bride.firstName}`}
          </p>
        </div>

        {/* 저작권 - 최하단이라 애니메이션 트리거 안됨, 항상 표시 */}
        {closing.copyright && (
          <div className="text-center pt-12">
            <p className="text-[11px] text-[var(--text-tertiary)]">{closing.copyright}</p>
          </div>
        )}
      </div>
    </section>
  );
};
