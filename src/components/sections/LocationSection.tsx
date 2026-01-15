'use client';

import { useState } from 'react';
import { invitationMock } from '@/mock/invitation.mock';

/**
 * 위치/교통편 섹션
 */
export const LocationSection = () => {
  const { location } = invitationMock;
  const [isTransportOpen, setIsTransportOpen] = useState(false);

  return (
    <section id="location" className="bg-[var(--bg-primary)] py-24">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-14 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="text-[11px] tracking-[0.4em] text-[var(--text-muted)]">LOCATION</span>
          <h2 className="mt-3 text-[28px] font-semibold text-[var(--text-primary)]">
            오시는 길
          </h2>
        </div>

        {/* 지도 */}
        <div
          className="overflow-hidden rounded-[var(--radius-lg)] shadow-[0_4px_24px_rgba(41,32,26,0.08)]"
          data-animate="scale"
        >
          <div className="relative h-[280px] bg-gradient-to-br from-[#f3ede6] via-[#efe4d9] to-[#f9f5f0]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[48px]">📍</div>
                <p className="mt-2 text-[14px] text-[var(--text-muted)]">
                  지도 영역 (카카오맵 연동 예정)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 주소 정보 */}
        <div className="flex flex-col gap-4 text-center" data-animate="fade-up">
          <p className="text-[22px] font-semibold text-[var(--text-primary)]">
            {location.venue}
          </p>
          <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {location.address}
          </p>
        </div>

        {/* 교통편 안내 */}
        <div data-animate="fade-up">
          <button
            type="button"
            onClick={() => setIsTransportOpen(!isTransportOpen)}
            className="flex w-full items-center justify-between border-b border-[var(--border-light)] pb-4 text-left transition-colors"
            aria-expanded={isTransportOpen}
            aria-controls="transport-content"
          >
            <span className="text-[16px] font-semibold text-[var(--text-primary)]">
              교통편 안내
            </span>
            <svg
              className={`h-5 w-5 text-[var(--text-muted)] transition-transform duration-300 ${
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
            <div id="transport-content" className="pt-6">
              <div className="flex flex-col gap-5 text-[14px] leading-[1.8] text-[var(--text-secondary)]">
                {location.transportation.subway && location.transportation.subway.length > 0 && (
                  <div>
                    <p className="mb-2 text-[15px] font-semibold text-[var(--text-primary)]">
                      🚇 지하철
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      {location.transportation.subway.map((line, index) => (
                        <li key={index} className={'text-[15px]'}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {location.transportation.bus && location.transportation.bus.length > 0 && (
                  <div>
                    <p className="mb-2 text-[15px] font-semibold text-[var(--text-primary)]">
                      🚌 버스
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      {location.transportation.bus.map((line, index) => (
                        <li key={index} className={'text-[15px]'}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {location.transportation.parking && (
                  <div>
                    <p className="mb-2 text-[15px] font-semibold text-[var(--text-primary)]">
                      🅿️ 주차
                    </p>
                    <p className={'text-[15px]'}>{location.transportation.parking}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 안내사항 */}
        {location.notices && location.notices.length > 0 && (
          <div data-animate="fade-up">
            <p className="mb-4 text-[11px] tracking-[0.35em] text-[var(--text-muted)]">NOTICE</p>
            <ul className="flex flex-col gap-2 pl-4 text-[16px] leading-[1.8] text-[var(--text-secondary)] list-disc">
              {location.notices.map((notice, index) => (
                <li key={index}>{notice}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
