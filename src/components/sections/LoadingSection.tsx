'use client';

import { useEffect, useState } from 'react';

type LoadingSectionProps = {
  message: string;
  isVisible: boolean;
};

/**
 * 로딩 섹션 - 벚꽃 스피너 애니메이션
 */
export const LoadingSection = ({ message, isVisible }: LoadingSectionProps) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isVisible && shouldRender) {
      // 페이드아웃 시작
      setFadeOut(true);
      // 페이드아웃 완료 후 unmount
      const timer = window.setTimeout(() => {
        setShouldRender(false);
      }, 500); // 애니메이션 duration과 동일

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [isVisible, shouldRender]);

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
        background: 'linear-gradient(135deg, #f8f4ef 0%, #efe5db 100%)',
      }}
      role="status"
      aria-live="polite"
    >
      {/* 벚꽃 스피너 */}
      <div className="relative mb-8 h-24 w-24">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-cherry-spin rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,228,236,0.9), rgba(236,180,192,0.8))',
              animationDelay: `${i * 0.2}s`,
              transform: `rotate(${i * 72}deg) translateY(-36px)`,
            }}
          />
        ))}
      </div>

      {/* 메시지 */}
      <p
        className="animate-fade-in text-center text-[18px] font-medium tracking-[0.3em]"
        style={{
          color: 'var(--text-secondary)',
        }}
        aria-live="polite"
      >
        {message}
      </p>

      <style jsx>{`
        @keyframes cherry-spin {
          0%, 100% {
            opacity: 0.4;
            transform: rotate(var(--rotation)) translateY(-36px) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: rotate(var(--rotation)) translateY(-36px) scale(1.2);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-cherry-spin {
          animation: cherry-spin 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};
