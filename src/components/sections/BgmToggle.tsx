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
      className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white/50 px-3 py-1.5 text-[10px] tracking-[0.15em] text-[#6a6a6a] backdrop-blur-sm transition-all hover:bg-white/70 hover:border-black/10"
      aria-pressed={enabled}
      onClick={() => setEnabled((prev) => !prev)}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#6a6a6a]" aria-hidden />
      BGM {enabled ? 'ON' : 'OFF'}
    </button>
  );
};
