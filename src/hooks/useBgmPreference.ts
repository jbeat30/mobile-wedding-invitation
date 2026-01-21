'use client';

import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

const STORAGE_KEY = 'wedding-bgm-enabled';

type UseBgmPreferenceResult = {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
};

/**
 * BGM on/off 상태를 localStorage에 저장한다.
 * @param initialEnabled 초기 활성화 값
 * @returns UseBgmPreferenceResult
 */
export const useBgmPreference = (initialEnabled: boolean): UseBgmPreferenceResult => {
  const [enabled, setEnabled] = useState(initialEnabled);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setEnabled(stored === 'true');
      return;
    }
    setEnabled(initialEnabled);
  }, [initialEnabled]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  return { enabled, setEnabled };
};
