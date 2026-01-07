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
      className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[11px] tracking-[0.2em] text-[#4d4d4d] backdrop-blur"
      aria-pressed={enabled}
      onClick={() => setEnabled((prev) => !prev)}
    >
      <span className="h-2 w-2 rounded-full bg-[#4d4d4d]" aria-hidden />
      BGM {enabled ? 'ON' : 'OFF'}
    </button>
  );
};
