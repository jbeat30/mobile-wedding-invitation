'use client';

import { invitationMock, type InvitationFamilyMember } from '@/mock/invitation.mock';
import Image from 'next/image';

/**
 * 신랑신부 소개 섹션
 */
export const CoupleSection = () => {
  const { couple } = invitationMock;
  const formatMembers = (members: InvitationFamilyMember[]) =>
    members
      .map((member) => `${member.prefix ?? ''}${member.name}${member.suffix ? ` (${member.suffix})` : ''}`.trim())
      .join(' · ');

  return (
    <section
      id="couple"
      className="bg-[var(--bg-secondary)] py-16"
    >
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="text-[10px] tracking-[0.4em] text-[var(--muted)]">COUPLE</span>
          <h2 className="mt-3 text-[26px] font-semibold text-[var(--text-primary)]">
            두 사람을 소개합니다
          </h2>
          <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
            마음을 모아 새로운 계절을 맞이합니다
          </p>
        </div>

        {/* 프로필 카드 그리드 */}
        <div className="grid gap-8 sm:grid-cols-2" data-animate="stagger">
          {/* 신랑 카드 */}
          <div
            className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-white/70 bg-white/85 p-6 text-center shadow-[var(--shadow-soft)] backdrop-blur"
            data-animate-item
          >
            <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full border-4 border-white/80 shadow-md">
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
              <p className="text-[10px] tracking-[0.35em] text-[var(--muted)]">
                {couple.groom.role || '신랑'}
              </p>
              <h3 className="mt-1 text-[22px] font-semibold text-[var(--text-primary)]">
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
                <div key={line.subject} className="mt-1 text-center">
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {formatMembers(line.members)} 의 {line.relationshipLabel}
                  </p>
                </div>
              ))}
          </div>

          {/* 신부 카드 */}
          <div
            className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-white/70 bg-white/85 p-6 text-center shadow-[var(--shadow-soft)] backdrop-blur"
            data-animate-item
          >
            <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full border-4 border-white/80 shadow-md">
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
              <p className="text-[10px] tracking-[0.35em] text-[var(--muted)]">
                {couple.bride.role || '신부'}
              </p>
              <h3 className="mt-1 text-[22px] font-semibold text-[var(--text-primary)]">
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
                <div key={line.subject} className="mt-1 text-center">
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {formatMembers(line.members)} 의 {line.relationshipLabel}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
