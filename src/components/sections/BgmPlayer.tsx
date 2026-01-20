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
      const tryPlay = () => {
        void audio.play().catch(() => {
          // 자동 재생 제한 시 첫 상호작용에서 다시 시도한다.
        });
      };

      const handleInteraction = () => {
        tryPlay();
      };

      tryPlay();
      window.addEventListener('pointerdown', handleInteraction, { once: true });
      window.addEventListener('keydown', handleInteraction, { once: true });
      window.addEventListener('touchstart', handleInteraction, { once: true });
      window.addEventListener('wheel', handleInteraction, { once: true });
      window.addEventListener('scroll', handleInteraction, { once: true });

      return () => {
        window.removeEventListener('pointerdown', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
        window.removeEventListener('wheel', handleInteraction);
        window.removeEventListener('scroll', handleInteraction);
      };
    }
    audio.pause();
  }, [enabled, audioUrl]);

  if (!audioUrl) return null;

  return <audio ref={audioRef} src={audioUrl} preload="none" />;
};
