'use client';

import { invitationMock } from '@/mock/invitation.mock';
import Image from 'next/image';

/**
 * 신랑신부 소개 섹션
 */
export const CoupleSection = () => {
  const { couple } = invitationMock;

  return (
    <section id="couple" className="bg-[var(--bg-primary)] py-24">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-16 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="text-[11px] tracking-[0.4em] text-[var(--text-muted)]">COUPLE</span>
          <h2 className="mt-3 text-[28px] font-semibold text-[var(--text-primary)]">
            두 사람을 소개합니다
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            마음을 모아 새로운 계절을 맞이합니다
          </p>
        </div>

        {/* 프로필 */}
        <div className="grid gap-16 sm:grid-cols-2" data-animate="stagger">
          {/* 신랑 */}
          <div className="flex flex-col items-center gap-6 text-center" data-animate-item>
            <div className="relative h-[200px] w-[200px] overflow-hidden rounded-full border-[6px] border-white shadow-[0_8px_32px_rgba(41,32,26,0.15)]">
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
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[12px] tracking-[0.35em] text-[var(--text-muted)]">
                  {couple.groom.role || '신랑'}
                </p>
                <h3 className="mt-2 text-[26px] font-bold text-[var(--text-primary)]">
                  {couple.groom.displayName}
                </h3>
              </div>
              {couple.groom.bio && (
                <p className="text-[14px] leading-[1.8] text-[var(--text-secondary)]">
                  {couple.groom.bio}
                </p>
              )}
            </div>
          </div>

          {/* 신부 */}
          <div className="flex flex-col items-center gap-6 text-center" data-animate-item>
            <div className="relative h-[200px] w-[200px] overflow-hidden rounded-full border-[6px] border-white shadow-[0_8px_32px_rgba(41,32,26,0.15)]">
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
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[12px] tracking-[0.35em] text-[var(--text-muted)]">
                  {couple.bride.role || '신부'}
                </p>
                <h3 className="mt-2 text-[26px] font-bold text-[var(--text-primary)]">
                  {couple.bride.displayName}
                </h3>
              </div>
              {couple.bride.bio && (
                <p className="text-[14px] leading-[1.8] text-[var(--text-secondary)]">
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
