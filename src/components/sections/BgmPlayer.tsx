'use client';

import { useEffect, useRef } from 'react';

type BgmPlayerProps = {
  audioUrl?: string;
  enabled: boolean;
  loop: boolean;
  onPlaybackChange?: (playing: boolean) => void;
};

/**
 * BGM 오디오 컨트롤러
 * @param props BgmPlayerProps
 * @returns JSX.Element | null
 */
export const BgmPlayer = ({ audioUrl, enabled, loop, onPlaybackChange }: BgmPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = loop;
  }, [loop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      onPlaybackChange?.(true);
    };
    const handlePause = () => {
      onPlaybackChange?.(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
    };
  }, [onPlaybackChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    audio.preload = 'auto';
    audio.load();
  }, [audioUrl]);

  useEffect(() => {
    if (!audioUrl) return;
    const controller = new AbortController();

    const warmCache = async () => {
      try {
        await fetch(audioUrl, { signal: controller.signal, cache: 'force-cache' });
      } catch {
        // 캐시 워밍 실패 시에도 재생 시도는 유지한다.
      }
    };

    void warmCache();
    return () => {
      controller.abort();
    };
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (enabled) {
      let isPlaying = false;

      const removeListeners = () => {
        window.removeEventListener('pointerdown', handleInteraction);
        window.removeEventListener('pointerup', handleInteraction);
        window.removeEventListener('mousedown', handleInteraction);
        window.removeEventListener('mouseup', handleInteraction);
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
        window.removeEventListener('touchmove', handleInteraction);
        window.removeEventListener('touchend', handleInteraction);
        window.removeEventListener('wheel', handleInteraction);
        window.removeEventListener('scroll', handleInteraction);
        window.removeEventListener('pageshow', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('touchmove', handleInteraction);
        document.body?.removeEventListener('touchstart', handleInteraction);
        document.body?.removeEventListener('touchmove', handleInteraction);
        document.body?.removeEventListener('wheel', handleInteraction);
      };

      const handleInteraction = () => {
        if (isPlaying) return;
        void audio
          .play()
          .then(() => {
            isPlaying = true;
            removeListeners();
          })
          .catch(() => {
            // 자동 재생 제한 시 다음 상호작용에서 다시 시도한다.
          });
      };

      const interactionOptions: AddEventListenerOptions = {
        passive: false,
        capture: true,
      };

      handleInteraction();
      window.addEventListener('pointerdown', handleInteraction, interactionOptions);
      window.addEventListener('pointerup', handleInteraction, interactionOptions);
      window.addEventListener('mousedown', handleInteraction, interactionOptions);
      window.addEventListener('mouseup', handleInteraction, interactionOptions);
      window.addEventListener('click', handleInteraction, interactionOptions);
      window.addEventListener('touchstart', handleInteraction, interactionOptions);
      window.addEventListener('touchmove', handleInteraction, interactionOptions);
      window.addEventListener('touchend', handleInteraction, interactionOptions);
      window.addEventListener('keydown', handleInteraction, interactionOptions);
      window.addEventListener('wheel', handleInteraction, interactionOptions);
      window.addEventListener('scroll', handleInteraction, interactionOptions);
      window.addEventListener('pageshow', handleInteraction, interactionOptions);
      document.addEventListener('scroll', handleInteraction, interactionOptions);
      document.addEventListener('touchstart', handleInteraction, interactionOptions);
      document.addEventListener('touchmove', handleInteraction, interactionOptions);
      document.body?.addEventListener('touchstart', handleInteraction, interactionOptions);
      document.body?.addEventListener('touchmove', handleInteraction, interactionOptions);
      document.body?.addEventListener('wheel', handleInteraction, interactionOptions);

      return removeListeners;
    }
    audio.pause();
    onPlaybackChange?.(false);
  }, [enabled, audioUrl, onPlaybackChange]);

  if (!audioUrl) return null;

  return <audio ref={audioRef} src={audioUrl} preload="auto" />;
};
