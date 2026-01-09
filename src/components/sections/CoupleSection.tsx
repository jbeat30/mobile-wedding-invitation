'use client';

import { invitationMock } from '@/mock/invitation.mock';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import Image from 'next/image';

/**
 * 신랑신부 소개 섹션
 */
export const CoupleSection = () => {
  const { couple } = invitationMock;
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="couple"
      ref={ref}
      className="bg-[var(--bg-secondary)] py-16"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center">
          <span className="text-[11px] tracking-[0.35em] text-[var(--muted)]">COUPLE</span>
          <h2 className="font-gowun mt-3 text-[24px] font-semibold text-[var(--text-primary)]">
            두 사람을 소개합니다
          </h2>
        </div>

        {/* 프로필 카드 그리드 */}
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-6">
          {/* 신랑 카드 */}
          <div className="flex flex-1 flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow-soft)]">
            <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full border-4 border-white shadow-md">
              {couple.groom.profileImage && (
                <Image
                  src={couple.groom.profileImage}
                  alt={`${couple.groom.displayName} 프로필`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <div className="text-center">
              <p className="text-[10px] tracking-[0.3em] text-[var(--muted)]">
                {couple.groom.role || 'GROOM'}
              </p>
              <h3 className="mt-1 text-[20px] font-semibold text-[var(--text-primary)]">
                {couple.groom.displayName}
              </h3>
              {couple.groom.bio && (
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  {couple.groom.bio}
                </p>
              )}
            </div>
            {/* 가족 정보 */}
            {couple.familyLines
              ?.filter((line) => line.subject === 'groom')
              .map((line) => (
                <div key={line.subject} className="mt-2 text-center">
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {line.members.map((member) => (
                      <span key={member.name}>
                        {member.prefix}
                        {member.name}
                        {member.suffix ? ` (${member.suffix})` : ''}
                        {' · '}
                      </span>
                    ))}
                    의 {line.relationshipLabel}
                  </p>
                </div>
              ))}
          </div>

          {/* 신부 카드 */}
          <div className="flex flex-1 flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow-soft)]">
            <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full border-4 border-white shadow-md">
              {couple.bride.profileImage && (
                <Image
                  src={couple.bride.profileImage}
                  alt={`${couple.bride.displayName} 프로필`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <div className="text-center">
              <p className="text-[10px] tracking-[0.3em] text-[var(--muted)]">
                {couple.bride.role || 'BRIDE'}
              </p>
              <h3 className="mt-1 text-[20px] font-semibold text-[var(--text-primary)]">
                {couple.bride.displayName}
              </h3>
              {couple.bride.bio && (
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  {couple.bride.bio}
                </p>
              )}
            </div>
            {/* 가족 정보 */}
            {couple.familyLines
              ?.filter((line) => line.subject === 'bride')
              .map((line) => (
                <div key={line.subject} className="mt-2 text-center">
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {line.members.map((member) => (
                      <span key={member.name}>
                        {member.prefix}
                        {member.name}
                        {member.suffix ? ` (${member.suffix})` : ''}
                        {' · '}
                      </span>
                    ))}
                    의 {line.relationshipLabel}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
