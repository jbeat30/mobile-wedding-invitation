import { invitationMock, type InvitationFamilyMember } from '@/mock/invitation.mock';

/**
 * 인사말 섹션
 */
export const GreetingSection = () => {
  const { greeting, couple } = invitationMock;

  const formatMembers = (members: InvitationFamilyMember[]) =>
    members.map((member) => member.name).join(' · ');

  const groomFamily = couple.familyLines?.find((line) => line.subject === 'groom');
  const brideFamily = couple.familyLines?.find((line) => line.subject === 'bride');

  return (
    <section id="greeting" className="bg-[var(--bg-primary)] py-16">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-12 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="font-label text-[11px] text-[var(--text-muted)]">INVITATION</span>
          <h2 className="mt-2 text-[24px] font-medium text-[var(--text-primary)]">
            초대합니다
          </h2>
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

        {/* 구분선 */}
        <div className="flex items-center justify-center gap-4" data-animate="fade">
          <div className="h-px w-12 bg-[var(--divider)]" />
          <span className="text-[var(--accent-rose)]">♥</span>
          <div className="h-px w-12 bg-[var(--divider)]" />
        </div>

        {/* 부모님 성함 */}
        <div className="flex flex-col gap-6 text-center" data-animate="fade-up">
          {groomFamily && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[13px] text-[var(--text-muted)]">
                {formatMembers(groomFamily.members)}의 {groomFamily.relationshipLabel}
              </p>
              <p className="text-[20px] font-medium text-[var(--text-primary)]">
                {couple.groom.displayName}
              </p>
            </div>
          )}

          {brideFamily && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[13px] text-[var(--text-muted)]">
                {formatMembers(brideFamily.members)}의 {brideFamily.relationshipLabel}
              </p>
              <p className="text-[20px] font-medium text-[var(--text-primary)]">
                {couple.bride.displayName}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
