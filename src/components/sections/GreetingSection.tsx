import { invitationMock, type InvitationFamilyMember } from '@/mock/invitation.mock';

/**
 * 인사말 섹션 - 레퍼런스 기반 신규 생성
 */
export const GreetingSection = () => {
  const { greeting, couple } = invitationMock;

  const formatMembers = (members: InvitationFamilyMember[]) =>
    members
      .map((member) => `${member.prefix ?? ''}${member.name}${member.suffix ? ` (${member.suffix})` : ''}`.trim())
      .join(' · ');

  const groomFamily = couple.familyLines?.find((line) => line.subject === 'groom');
  const brideFamily = couple.familyLines?.find((line) => line.subject === 'bride');

  return (
    <section id="greeting" className="bg-[var(--bg-secondary)] py-20">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-12 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="text-[10px] tracking-[0.4em] text-[var(--text-muted)]">INVITATION</span>
          <h2 className="mt-3 text-[28px] font-semibold text-[var(--text-primary)]">
            초대합니다
          </h2>
        </div>

        {/* 인사말 카드 */}
        <div
          className="rounded-[var(--radius-lg)] border border-white/70 bg-white/90 p-8 shadow-[var(--shadow-soft)] backdrop-blur"
          data-animate="fade-up"
        >
          <div className="flex flex-col gap-6 text-center">
            {/* 시적 문구 */}
            {greeting.poeticNote && (
              <p className="text-[14px] italic leading-relaxed text-[var(--text-tertiary)]">
                {greeting.poeticNote}
              </p>
            )}

            {/* 인사말 본문 */}
            <div className="flex flex-col gap-4 text-[15px] leading-[1.8] text-[var(--text-secondary)]">
              {greeting.message.map((line, index) => (
                line === '' ? (
                  <div key={index} className="h-2" />
                ) : (
                  <p key={index}>{line}</p>
                )
              ))}
            </div>
          </div>
        </div>

        {/* 부모님 성함 */}
        <div
          className="rounded-[var(--radius-lg)] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow-soft)]"
          data-animate="fade-up"
        >
          <div className="flex flex-col gap-6 text-center">
            {groomFamily && (
              <div className="flex flex-col gap-2">
                <p className="text-[13px] text-[var(--text-muted)]">
                  {formatMembers(groomFamily.members)} 의 {groomFamily.relationshipLabel}
                </p>
                <p className="text-[20px] font-semibold text-[var(--text-primary)]">
                  {couple.groom.displayName}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <span className="mx-3 text-[14px] text-[var(--accent)]">♥</span>
              <div className="h-px w-8 bg-[var(--accent)]" />
            </div>

            {brideFamily && (
              <div className="flex flex-col gap-2">
                <p className="text-[13px] text-[var(--text-muted)]">
                  {formatMembers(brideFamily.members)} 의 {brideFamily.relationshipLabel}
                </p>
                <p className="text-[20px] font-semibold text-[var(--text-primary)]">
                  {couple.bride.displayName}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
