'use client';

import { useEffect, useState } from 'react';

type LoadingSectionProps = {
  message: string;
  isVisible: boolean;
};

/**
 * 로딩 섹션
 */
export const LoadingSection = ({ message, isVisible }: LoadingSectionProps) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [fadeOut, setFadeOut] = useState(false);

  // useEffect(() => {
  //   if (!isVisible && shouldRender) {
  //     // 페이드아웃 시작
  //     setFadeOut(true);
  //     // 페이드아웃 완료 후 unmount
  //     const timer = window.setTimeout(() => {
  //       setShouldRender(false);
  //     }, 500); // 애니메이션 duration과 동일
  //
  //     return () => {
  //       window.clearTimeout(timer);
  //     };
  //   }
  // }, [isVisible, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      data-testid="loading-section"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #f7f2ec 0%, #efe3d7 100%)',
      }}
      role="status"
      aria-live="polite"
    >
      <div className="loading-splash">
        <div className="loading-bg">
          <img
            src="/mock/main-image.png"
            alt=""
            className="loading-bg-image loading-bg-image--back"
          />
          <div className="loading-overlay" />
          <div className="loading-overlay-soft" />
        </div>

        <div className="loading-handwrite loading-handwrite--top" aria-hidden="true">
          <svg viewBox="0 0 600 180" width="100%" height="100%">
            <path
              className="loading-handwrite-path"
              d="M40 110 C90 60, 160 60, 210 105 C245 138, 290 140, 330 110 C370 80, 420 70, 470 92 C515 112, 545 132, 560 150"
            />
          </svg>
        </div>

        <div className="loading-copy">
          <p className="loading-eyebrow">WEDDING INVITATION</p>
          <p className="loading-title font-display">
            {message}
          </p>
          <div className="loading-divider" />
        </div>

      </div>
    </div>
  );
};
