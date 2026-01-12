'use client';

/**
 * 스크롤 다운 인디케이터
 */
export const ScrollIndicator = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[11px] tracking-[0.3em] text-[var(--text-muted)] opacity-70">
        SCROLL
      </p>
      <div className="flex flex-col gap-1">
        <div
          className="h-1 w-1 rounded-full bg-[var(--accent)] animate-scroll-bounce"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="h-1 w-1 rounded-full bg-[var(--accent)] animate-scroll-bounce"
          style={{ animationDelay: '0.2s' }}
        />
        <div
          className="h-1 w-1 rounded-full bg-[var(--accent)] animate-scroll-bounce"
          style={{ animationDelay: '0.4s' }}
        />
      </div>

      <style jsx>{`
        @keyframes scroll-bounce {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(4px);
          }
        }

        .animate-scroll-bounce {
          animation: scroll-bounce 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
