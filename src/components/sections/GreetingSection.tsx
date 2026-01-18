import type { InvitationCouple, InvitationGreeting } from '@/mock/invitation.mock';
import { HeartLineDrawing } from '@/components/ui/HeartLineDrawing';
import { SectionHeader } from '@/components/ui/SectionHeader';

type GreetingSectionProps = {
  greeting: InvitationGreeting;
  couple: InvitationCouple;
  title: string;
};

/**
 * 인사말 섹션
 */
export const GreetingSection = ({ greeting, couple, title }: GreetingSectionProps) => {
  const getParentLines = (parents: { father?: string; mother?: string }) =>
    [
      parents.father ? `아버지 ${parents.father}` : null,
      parents.mother ? `어머니 ${parents.mother}` : null,
    ].filter(Boolean);

  const groomParentsLines = getParentLines(couple.parents.groom);
  const brideParentsLines = getParentLines(couple.parents.bride);

  return (
    <section id="greeting" className="bg-[var(--bg-primary)] py-16">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-12 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <SectionHeader
            kicker="INVITATION"
            title={title}
            kickerClassName="font-label text-[13px] text-[var(--accent-rose)]"
            titleClassName="mt-2 text-[24px] font-medium text-[var(--text-primary)]"
          />
        </div>

        {/* 인사말 */}
        <div className="flex flex-col gap-6 text-center" data-animate="fade-up">
          {/* 인사말 본문 */}
          <div className="flex flex-col gap-2 text-[15px] leading-[2] text-[var(--text-secondary)]">
            {greeting.message.map((line, index) =>
              line === '' ? (
                <div key={index} className="h-4" />
              ) : (
                <p key={index}>{line}</p>
              ),
            )}
          </div>

          {/* 시적 문구 */}
          {greeting.poeticNote && (
            <p className="mt-2 text-[14px] italic text-[var(--text-tertiary)]">
              &ldquo;{greeting.poeticNote}&rdquo;
            </p>
          )}
        </div>

        {/* SVG 하트 라인 드로잉 */}
        <div className="flex justify-center" data-animate="fade">
          <HeartLineDrawing
            width={240}
            height={60}
            strokeColor="#C4A092"
            strokeWidth={1.5}
            duration={2.5}
          />
        </div>

        {/* 부모님 성함 */}
        <div className="flex gap-6 justify-center text-center" data-animate="fade-up">
          {groomParentsLines.length ? (
            <div className="flex flex-col justify-between gap-1.5">
              <div className="flex flex-col gap-1 text-[13px] text-[var(--text-muted)]">
                {groomParentsLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className={'flex items-center gap-3'}>
                <p className="text-[13px] text-[var(--text-muted)]">아들</p>
                <p className="text-[20px] font-medium text-[var(--text-primary)]">
                  {`${couple.groom.lastName}${couple.groom.firstName}`}
                </p>
              </div>
            </div>
          ) : null}

          {brideParentsLines.length ? (
            <div className="flex flex-col justify-between gap-1.5">
              <div className="flex flex-col gap-1 text-[13px] text-[var(--text-muted)]">
                {brideParentsLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className={'flex items-center gap-3'}>
                <p className="text-[13px] text-[var(--text-muted)]">딸</p>
                <p className="text-[20px] font-medium text-[var(--text-primary)]">
                  {`${couple.bride.lastName}${couple.bride.firstName}`}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
