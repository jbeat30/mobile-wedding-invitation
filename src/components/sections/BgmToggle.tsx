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
      className={`flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[11px] tracking-[0.2em] text-[var(--text-secondary)] shadow-[0_10px_24px_rgba(41,32,26,0.12)] backdrop-blur-sm transition-all ${
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-white'
      }`}
      aria-pressed={enabled}
      onClick={onToggle}
      disabled={disabled}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${enabled ? 'bg-[var(--accent-strong)]' : 'bg-[var(--text-muted)]'}`}
        aria-hidden
      />
      BGM {enabled ? 'ON' : 'OFF'}
    </button>
  );
};
