'use client';

import { useEffect, useRef } from 'react';

type BgmPlayerProps = {
  audioUrl?: string;
  enabled: boolean;
  loop: boolean;
};

/**
 * BGM 오디오 컨트롤러
 * @param props BgmPlayerProps
 * @returns JSX.Element | null
 */
export const BgmPlayer = ({ audioUrl, enabled, loop }: BgmPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = loop;
  }, [loop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (enabled) {
      void audio.play().catch(() => {
        // 자동 재생 제한 시 사용자 토글로 재시도하게 둔다.
      });
      return;
    }
    audio.pause();
  }, [enabled, audioUrl]);

  if (!audioUrl) return null;

  return <audio ref={audioRef} src={audioUrl} preload="none" />;
};
