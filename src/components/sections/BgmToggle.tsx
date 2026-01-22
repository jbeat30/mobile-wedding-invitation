'use client';

type BgmToggleProps = {
  enabled: boolean;
  playing?: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

/**
 * BGM 토글 UI 구성 확인
 * @param props BgmToggleProps
 * @returns JSX.Element
 */
export const BgmToggle = ({ enabled, playing, onToggle, disabled = false }: BgmToggleProps) => {
  const isAnimating = playing ?? enabled;
  const isActive = playing ?? enabled;
  return (
    <button
      type="button"
      className={`flex h-7 w-7 items-center justify-center rounded-full border bg-white/85 text-[var(--text-secondary)] shadow-[0_8px_18px_rgba(41,32,26,0.12)] backdrop-blur-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-rose-dark)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] ${
        isActive ? 'border-[var(--accent-rose-dark)] text-[var(--accent-rose-dark)]' : 'border-white/70'
      } ${
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-white'
      }`}
      aria-label={`BGM ${enabled ? '켜짐' : '꺼짐'}`}
      aria-pressed={enabled}
      onClick={onToggle}
      disabled={disabled}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 18 18"
        className="block"
        aria-hidden
      >
        {[
          {
            x: 3,
            h: 8,
            d: '0s',
            dur: '3.15s',
            height: '6;12;7;11;5;13;6',
            y: '12;6;11;7;13;5;12',
          },
          {
            x: 6.5,
            h: 11,
            d: '0.08s',
            dur: '3.57s',
            height: '7;10;6;12;8;11;7',
            y: '11;8;12;6;10;7;11',
          },
          {
            x: 10,
            h: 9,
            d: '0.36s',
            dur: '2.9s',
            height: '6;13;8;10;7;12;6',
            y: '12;5;10;8;11;6;12',
          },
          {
            x: 13.5,
            h: 10,
            d: '0.22s',
            dur: '3.36s',
            height: '7;11;6;13;8;9;7',
            y: '11;7;12;5;10;9;11',
          },
        ].map((bar, index) => (
          <rect
            key={index}
            x={bar.x}
            y={18 - bar.h}
            width="2"
            height={bar.h}
            rx="1"
            fill={isActive ? 'var(--accent-strong)' : 'var(--text-muted)'}
          >
            {isAnimating ? (
              <>
                <animate
                  attributeName="height"
                  values={bar.height}
                  dur={bar.dur}
                  begin={bar.d}
                  keyTimes="0;0.12;0.27;0.43;0.68;0.84;1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  values={bar.y}
                  dur={bar.dur}
                  begin={bar.d}
                  keyTimes="0;0.12;0.27;0.43;0.68;0.84;1"
                  repeatCount="indefinite"
                />
              </>
            ) : null}
          </rect>
        ))}
      </svg>
    </button>
  );
};
