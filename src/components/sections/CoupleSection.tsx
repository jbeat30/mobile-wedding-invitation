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
    <section id="couple" className="bg-[var(--bg-primary)] py-16">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-12 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <SectionHeader
            kicker="COUPLE"
            title={title}
            kickerClassName="font-label text-[13px] text-[var(--accent-rose)]"
            titleClassName="mt-2 text-[24px] font-medium text-[var(--text-primary)]"
          />
        </div>

        {/* 프로필 */}
        <div className="grid gap-10 sm:grid-cols-2" data-animate="stagger">
          {/* 신랑 */}
          <div className="flex flex-col items-center gap-5 text-center" data-animate-item>
            <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full border-4 border-white bg-white shadow-[var(--shadow-card)]">
              {couple.groom.profileImage && (
                <Image
                  src={couple.groom.profileImage}
                  alt={`${couple.groom.lastName}${couple.groom.firstName} 프로필`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-label text-[12px] text-[var(--text-muted)]">신랑</p>
              <h3 className="text-[22px] font-medium text-[var(--text-primary)]">
                {`${couple.groom.lastName}${couple.groom.firstName}`}
              </h3>
              {couple.groom.bio && (
                <p className="mt-1 text-[14px] leading-relaxed text-[var(--text-tertiary)]">
                  {couple.groom.bio}
                </p>
              )}
            </div>
          </div>

          {/* 신부 */}
          <div className="flex flex-col items-center gap-5 text-center" data-animate-item>
            <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full border-4 border-white bg-white shadow-[var(--shadow-card)]">
              {couple.bride.profileImage && (
                <Image
                  src={couple.bride.profileImage}
                  alt={`${couple.bride.lastName}${couple.bride.firstName} 프로필`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-label text-[12px] text-[var(--text-muted)]">신부</p>
              <h3 className="text-[22px] font-medium text-[var(--text-primary)]">
                {`${couple.bride.lastName}${couple.bride.firstName}`}
              </h3>
              {couple.bride.bio && (
                <p className="mt-1 text-[14px] leading-relaxed text-[var(--text-tertiary)]">
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
