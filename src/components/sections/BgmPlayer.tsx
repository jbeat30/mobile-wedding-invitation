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
        // no-cors: R2 CORS 설정 없이도 cross-origin 오디오 캐시 워밍 가능 (opaque 응답)
        await fetch(audioUrl, { signal: controller.signal, cache: 'force-cache', mode: 'no-cors' });
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
      const interactionOptions: AddEventListenerOptions = { capture: true };
      const passiveInteractionOptions: AddEventListenerOptions = { capture: true, passive: true };

      const removeListeners = () => {
        window.removeEventListener('pointerdown', handleInteraction, interactionOptions);
        window.removeEventListener('click', handleInteraction, interactionOptions);
        window.removeEventListener('keydown', handleInteraction, interactionOptions);
        window.removeEventListener('touchend', handleInteraction, passiveInteractionOptions);
        window.removeEventListener('pageshow', handleInteraction, interactionOptions);
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

      handleInteraction();
      window.addEventListener('pointerdown', handleInteraction, interactionOptions);
      window.addEventListener('click', handleInteraction, interactionOptions);
      window.addEventListener('keydown', handleInteraction, interactionOptions);
      window.addEventListener('pageshow', handleInteraction, interactionOptions);
      window.addEventListener('touchend', handleInteraction, passiveInteractionOptions);

      return removeListeners;
    }
    audio.pause();
    onPlaybackChange?.(false);
  }, [enabled, audioUrl, onPlaybackChange]);

  if (!audioUrl) return null;

  return <audio ref={audioRef} src={audioUrl} preload="auto" />;
};
