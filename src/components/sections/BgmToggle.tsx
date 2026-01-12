'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'wedding-bgm-enabled';

/**
 * BGM 토글 UI 구성 확인
 */
export const BgmToggle = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEnabled(stored === 'true');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[10px] tracking-[0.2em] text-[var(--text-secondary)] shadow-[0_10px_24px_rgba(41,32,26,0.12)] backdrop-blur-sm transition-all hover:bg-white"
      aria-pressed={enabled}
      onClick={() => setEnabled((prev) => !prev)}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${enabled ? 'bg-[var(--accent-strong)]' : 'bg-[var(--text-muted)]'}`}
        aria-hidden
      />
      BGM {enabled ? 'ON' : 'OFF'}
    </button>
  );
};
