'use client';

import { invitationMock } from '@/mock/invitation.mock';
import Image from 'next/image';

/**
 * 신랑신부 소개 섹션 - 레퍼런스 기반 재디자인
 */
export const CoupleSection = () => {
  const { couple } = invitationMock;

  return (
    <section id="couple" className="bg-[var(--bg-tertiary)] py-20">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-12 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="text-[10px] tracking-[0.4em] text-[var(--text-muted)]">COUPLE</span>
          <h2 className="mt-3 text-[28px] font-semibold text-[var(--text-primary)]">
            두 사람을 소개합니다
          </h2>
          <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
            마음을 모아 새로운 계절을 맞이합니다
          </p>
        </div>

        {/* 프로필 카드 그리드 */}
        <div className="grid gap-10 sm:grid-cols-2" data-animate="stagger">
          {/* 신랑 카드 */}
          <div
            className="flex flex-col items-center gap-5 rounded-[var(--radius-lg)] border border-white/70 bg-white/90 p-8 text-center shadow-[var(--shadow-soft)] backdrop-blur"
            data-animate-item
          >
            <div className="relative h-[180px] w-[180px] overflow-hidden rounded-full border-[5px] border-white shadow-lg">
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
            <div className="flex flex-col gap-3 text-center">
              <div>
                <p className="text-[11px] tracking-[0.35em] text-[var(--text-muted)]">
                  {couple.groom.role || '신랑'}
                </p>
                <h3 className="mt-2 text-[24px] font-bold text-[var(--text-primary)]">
                  {couple.groom.displayName}
                </h3>
              </div>
              {couple.groom.bio && (
                <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                  {couple.groom.bio}
                </p>
              )}
            </div>
          </div>

          {/* 신부 카드 */}
          <div
            className="flex flex-col items-center gap-5 rounded-[var(--radius-lg)] border border-white/70 bg-white/90 p-8 text-center shadow-[var(--shadow-soft)] backdrop-blur"
            data-animate-item
          >
            <div className="relative h-[180px] w-[180px] overflow-hidden rounded-full border-[5px] border-white shadow-lg">
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
            <div className="flex flex-col gap-3 text-center">
              <div>
                <p className="text-[11px] tracking-[0.35em] text-[var(--text-muted)]">
                  {couple.bride.role || '신부'}
                </p>
                <h3 className="mt-2 text-[24px] font-bold text-[var(--text-primary)]">
                  {couple.bride.displayName}
                </h3>
              </div>
              {couple.bride.bio && (
                <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
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
