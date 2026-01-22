'use client';

import type { InvitationCouple } from '@/mock/invitation.mock';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';

type CoupleSectionProps = {
  couple: InvitationCouple;
  title: string;
};

/**
 * 신랑신부 소개 섹션
 */
export const CoupleSection = ({ couple, title }: CoupleSectionProps) => {
  return (
    <section
      id="couple"
      className="bg-[var(--bg-primary)] py-16"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}
    >
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-14 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up" data-animate-start="80">
          <SectionHeader
            kicker="COUPLE"
            title={title}
            kickerClassName="font-label text-[14px] text-[var(--accent-rose)]"
            titleClassName="mt-2 text-[24px] font-medium text-[var(--text-primary)]"
          />
        </div>

        {/* 프로필 */}
        <div
          className="grid gap-18 sm:grid-cols-1"
          data-animate="stagger"
          data-animate-start="80"
          data-animate-stagger="0.45"
        >
          {/* 신랑 */}
          <div className="flex items-start gap-8 text-left" data-animate-item>
            <div className="relative h-[200px] w-[200px] shrink-0 overflow-hidden bg-white shadow-[var(--shadow-card)]">
              {couple.groom.profileImage && (
                <Image
                  src={couple.groom.profileImage}
                  alt={`${couple.groom.lastName}${couple.groom.firstName} 프로필`}
                  fill
                  sizes="200px"
                  className="object-cover pointer-events-none select-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-label text-[16px] text-[var(--text-muted)]">신랑</p>
              <h3 className="text-[26px] font-medium text-[var(--text-primary)]">
                {`${couple.groom.lastName}${couple.groom.firstName}`}
              </h3>
              {couple.groom.bio && (
                <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-tertiary)]">
                  {couple.groom.bio}
                </p>
              )}
            </div>
          </div>

          {/* 신부 */}
          <div className="flex flex-row-reverse items-start gap-8 text-right justify-self-end" data-animate-item>
            <div className="relative h-[200px] w-[200px] shrink-0 overflow-hidden bg-white shadow-[var(--shadow-card)]">
              {couple.bride.profileImage && (
                <Image
                  src={couple.bride.profileImage}
                  alt={`${couple.bride.lastName}${couple.bride.firstName} 프로필`}
                  fill
                  sizes="200px"
                  className="object-cover pointer-events-none select-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-label text-[16px] text-[var(--text-muted)]">신부</p>
              <h3 className="text-[26px] font-medium text-[var(--text-primary)]">
                {`${couple.bride.lastName}${couple.bride.firstName}`}
              </h3>
              {couple.bride.bio && (
                <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-tertiary)]">
                  {couple.bride.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
