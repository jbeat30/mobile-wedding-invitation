'use client';

type BgmToggleProps = {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

/**
 * BGM 토글 UI 구성 확인
 * @param props BgmToggleProps
 * @returns JSX.Element
 */
export const BgmToggle = ({ enabled, onToggle, disabled = false }: BgmToggleProps) => {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 rounded-full border bg-white/75 px-2.5 py-1 text-[10px] tracking-[0.18em] text-[var(--text-secondary)] shadow-[0_8px_18px_rgba(41,32,26,0.12)] backdrop-blur-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-rose-dark)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] ${
        enabled ? 'border-[var(--accent-rose-dark)] text-[var(--accent-rose-dark)]' : 'border-white/70'
      } ${
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-white'
      }`}
      aria-pressed={enabled}
      onClick={onToggle}
      disabled={disabled}
    >
      <span className="relative flex h-2 w-2 items-center justify-center" aria-hidden>
        <span
          className={`absolute inline-flex h-full w-full rounded-full border border-[var(--accent-rose-dark)] opacity-0 ${
            enabled ? 'motion-safe:animate-ping opacity-60' : ''
          }`}
        />
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            enabled ? 'bg-[var(--accent-strong)]' : 'bg-[var(--text-muted)]'
          }`}
        />
      </span>
      BGM {enabled ? 'ON' : 'OFF'}
    </button>
  );
};
