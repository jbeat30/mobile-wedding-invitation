'use client';

import { useState, useCallback } from 'react';
import { invitationMock } from '@/mock/invitation.mock';

/**
 * 오시는 길 섹션
 */
export const LocationSection = () => {
  const { location } = invitationMock;
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const copyAddress = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(location.address);
        showToast('주소가 복사되었습니다');
        return;
      }
      const textarea = document.createElement('textarea');
      textarea.value = location.address;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('주소가 복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다');
    }
  }, [location.address, showToast]);

  const openNavigation = useCallback((app: 'naver' | 'kakao' | 'tmap') => {
    const { lat, lng } = location.coordinates;
    const name = encodeURIComponent(location.placeName);
    const address = encodeURIComponent(location.address);

    const urls = {
      naver: {
        app: `nmap://place?lat=${lat}&lng=${lng}&name=${name}&appname=wedding`,
        web: `https://map.naver.com/v5/search/${address}`,
      },
      kakao: {
        app: `kakaomap://look?p=${lat},${lng}`,
        web: `https://map.kakao.com/link/map/${name},${lat},${lng}`,
      },
      tmap: {
        app: `tmap://route?goalname=${name}&goalx=${lng}&goaly=${lat}`,
        web: `https://tmap.life/route?goalname=${name}&goalx=${lng}&goaly=${lat}`,
      },
    };

    const { app: appUrl, web: webUrl } = urls[app];

    // 모바일에서 앱 딥링크 시도, 실패 시 웹으로 폴백
    const timeout = setTimeout(() => {
      window.location.href = webUrl;
    }, 1500);

    window.location.href = appUrl;

    // 앱이 열리면 타이머 클리어
    window.addEventListener('blur', () => clearTimeout(timeout), { once: true });
  }, [location.coordinates, location.placeName, location.address]);

  return (
    <section id="location" className="bg-[var(--bg-primary)] py-16">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-10 px-6">
        {/* 섹션 헤더 */}
        <div className="text-center" data-animate="fade-up">
          <span className="font-label text-[12px] text-[var(--accent-rose)]">LOCATION</span>
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

        {/* 내비게이션 버튼 */}
        <div className="grid grid-cols-2 gap-3" data-animate="stagger">
          <button
            type="button"
            onClick={() => openNavigation('naver')}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border border-[var(--card-border)] bg-white/70 px-4 py-4 shadow-[var(--shadow-soft)] transition hover:bg-white"
            data-animate-item
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="#03C75A"/>
              <path d="M13.5 12.5L10.2 8H8v8h2.5v-4.5l3.3 4.5H16V8h-2.5v4.5z" fill="white"/>
            </svg>
            <span className="text-[13px] text-[var(--text-primary)]">네이버 지도</span>
          </button>

          <button
            type="button"
            onClick={() => openNavigation('kakao')}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border border-[var(--card-border)] bg-white/70 px-4 py-4 shadow-[var(--shadow-soft)] transition hover:bg-white"
            data-animate-item
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="#FEE500"/>
              <path d="M12 6C8.13 6 5 8.46 5 11.5c0 1.93 1.27 3.62 3.18 4.57-.14.52-.52 1.88-.6 2.17-.1.35.13.34.27.25.11-.07 1.76-1.18 2.47-1.66.38.05.77.08 1.18.08 3.87 0 7-2.46 7-5.5S15.87 6 12 6z" fill="#3C1E1E"/>
            </svg>
            <span className="text-[13px] text-[var(--text-primary)]">카카오맵</span>
          </button>

          <button
            type="button"
            onClick={() => openNavigation('tmap')}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border border-[var(--card-border)] bg-white/70 px-4 py-4 shadow-[var(--shadow-soft)] transition hover:bg-white"
            data-animate-item
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="#EF4123"/>
              <path d="M7 8h10v2H13v6h-2v-6H7V8z" fill="white"/>
            </svg>
            <span className="text-[13px] text-[var(--text-primary)]">티맵</span>
          </button>

          <button
            type="button"
            onClick={copyAddress}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border border-[var(--card-border)] bg-white/70 px-4 py-4 shadow-[var(--shadow-soft)] transition hover:bg-white"
            data-animate-item
          >
            <svg className="h-6 w-6 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            <span className="text-[13px] text-[var(--text-primary)]">주소 복사</span>
          </button>
        </div>

        {/* 교통편 안내 */}
        <div
          className="rounded-[var(--radius-md)] border border-[var(--card-border)] bg-white/50"
          data-animate="fade-up"
        >
          <button
            type="button"
            onClick={() => setIsTransportOpen(!isTransportOpen)}
            className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left"
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

      {/* 토스트 메시지 */}
      {toast && (
        <div className="fixed inset-x-0 bottom-[calc(var(--safe-bottom)+16px)] z-50 flex justify-center px-6">
          <div className="rounded-full bg-[#2f2f2f] px-5 py-2.5 text-[13px] text-white shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
            {toast}
          </div>
        </div>
      )}
    </section>
  );
};
