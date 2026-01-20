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

      const interactionOptions: AddEventListenerOptions = {
        once: true,
        passive: true,
        capture: true,
      };

      tryPlay();
      window.addEventListener('pointerdown', handleInteraction, interactionOptions);
      window.addEventListener('pointerup', handleInteraction, interactionOptions);
      window.addEventListener('mousedown', handleInteraction, interactionOptions);
      window.addEventListener('mouseup', handleInteraction, interactionOptions);
      window.addEventListener('click', handleInteraction, interactionOptions);
      window.addEventListener('touchstart', handleInteraction, interactionOptions);
      window.addEventListener('touchend', handleInteraction, interactionOptions);
      window.addEventListener('keydown', handleInteraction, interactionOptions);
      window.addEventListener('wheel', handleInteraction, interactionOptions);
      window.addEventListener('scroll', handleInteraction, interactionOptions);
      window.addEventListener('pageshow', handleInteraction, interactionOptions);

      return () => {
        window.removeEventListener('pointerdown', handleInteraction);
        window.removeEventListener('pointerup', handleInteraction);
        window.removeEventListener('mousedown', handleInteraction);
        window.removeEventListener('mouseup', handleInteraction);
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
        window.removeEventListener('touchend', handleInteraction);
        window.removeEventListener('wheel', handleInteraction);
        window.removeEventListener('scroll', handleInteraction);
        window.removeEventListener('pageshow', handleInteraction);
      };
    }
    audio.pause();
  }, [enabled, audioUrl]);

  if (!audioUrl) return null;

  return <audio ref={audioRef} src={audioUrl} preload="auto" />;
};
