'use client';

import { useState } from 'react';
import { invitationMock } from '@/mock/invitation.mock';

/**
 * 오시는 길 섹션
 */
export const LocationSection = () => {
  const { location } = invitationMock;
  const [isTransportOpen, setIsTransportOpen] = useState(false);

  return (
    <section id="location" className="bg-[var(--bg-primary)] py-16">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="font-label text-[11px] text-[var(--accent-rose)]">LOCATION</span>
          <h2 className="mt-2 text-[24px] font-medium text-[var(--text-primary)]">
            오시는 길
          </h2>
        </div>

        {/* 지도 플레이스홀더 */}
        <div
          className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--card-border)] shadow-[var(--shadow-soft)]"
          data-animate="scale"
        >
          <div className="relative h-[220px] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[36px]">📍</div>
                <p className="mt-2 text-[13px] text-[var(--text-muted)]">
                  지도 영역
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 주소 정보 */}
        <div className="flex flex-col gap-2 text-center" data-animate="fade-up">
          <p className="text-[20px] font-medium text-[var(--text-primary)]">
            {location.venue}
          </p>
          <p className="text-[14px] text-[var(--text-secondary)]">
            {location.address}
          </p>
        </div>

        {/* 교통편 안내 */}
        <div
          className="rounded-[var(--radius-md)] border border-[var(--card-border)] bg-white/50"
          data-animate="fade-up"
        >
          <button
            type="button"
            onClick={() => setIsTransportOpen(!isTransportOpen)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
            aria-expanded={isTransportOpen}
            aria-controls="transport-content"
          >
            <span className="text-[15px] font-medium text-[var(--text-primary)]">
              교통편 안내
            </span>
            <svg
              className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-300 ${
                isTransportOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isTransportOpen && (
            <div id="transport-content" className="border-t border-[var(--border-light)] px-5 py-5">
              <div className="flex flex-col gap-5">
                {location.transportation.subway && location.transportation.subway.length > 0 && (
                  <div>
                    <p className="mb-2 text-[14px] font-medium text-[var(--text-primary)]">
                      🚇 지하철
                    </p>
                    <ul className="space-y-1 text-[14px] text-[var(--text-secondary)]">
                      {location.transportation.subway.map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {location.transportation.bus && location.transportation.bus.length > 0 && (
                  <div>
                    <p className="mb-2 text-[14px] font-medium text-[var(--text-primary)]">
                      🚌 버스
                    </p>
                    <ul className="space-y-1 text-[14px] text-[var(--text-secondary)]">
                      {location.transportation.bus.map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {location.transportation.parking && (
                  <div>
                    <p className="mb-2 text-[14px] font-medium text-[var(--text-primary)]">
                      🅿️ 주차
                    </p>
                    <p className="text-[14px] text-[var(--text-secondary)]">
                      {location.transportation.parking}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 안내사항 */}
        {location.notices && location.notices.length > 0 && (
          <div
            className="rounded-[var(--radius-md)] bg-[var(--accent-soft)]/30 px-5 py-4"
            data-animate="fade-up"
          >
            <ul className="flex flex-col gap-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              {location.notices.map((notice, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-[var(--accent-rose)]">•</span>
                  {notice}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
