'use client';

import { useEffect, useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ModalShell } from '@/components/ui/ModalShell';

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: { id: string; src: string; alt: string; width?: number; height?: number }[];
  initialIndex: number;
  onIndexChange?: (index: number) => void;
};

/**
 * 이미지 확대 모달 - 스크롤 위치 유지, 최상위 z-index
 * @param props ImageModalProps
 * @returns JSX.Element | null
 */
export const ImageModal = ({
  isOpen,
  onClose,
  images,
  initialIndex,
  onIndexChange,
}: ImageModalProps) => {
  const scrollPosRef = useRef(0);
  const scrollBehaviorRef = useRef<string | null>(null);
  const hasOpenedRef = useRef(false);
  const historyEntryActiveRef = useRef(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [measuredSizes, setMeasuredSizes] = useState<Record<string, { width: number; height: number }>>({});
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);

    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
    }
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const html = document.documentElement;

    if (isOpen) {
      // 현재 스크롤 위치 저장
      scrollPosRef.current = window.scrollY;
      hasOpenedRef.current = true;

      if (scrollBehaviorRef.current === null) {
        scrollBehaviorRef.current = html.style.scrollBehavior;
      }
      html.style.scrollBehavior = 'auto';

      // body 스크롤 차단 (위치 유지)
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.width = '100%';

      const nextState = { ...(window.history.state ?? {}), imageModalOpen: true };
      window.history.pushState(nextState, '');
      historyEntryActiveRef.current = true;
    } else if (hasOpenedRef.current) {
      if (scrollBehaviorRef.current === null) {
        scrollBehaviorRef.current = html.style.scrollBehavior;
      }
      html.style.scrollBehavior = 'auto';

      // 스크롤 복원
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // 이전 스크롤 위치로 복원
      window.scrollTo(0, scrollPosRef.current);
      html.style.scrollBehavior = scrollBehaviorRef.current || '';
      scrollBehaviorRef.current = null;

      if (historyEntryActiveRef.current) {
        historyEntryActiveRef.current = false;
        window.history.back();
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      if (scrollBehaviorRef.current !== null) {
        html.style.scrollBehavior = scrollBehaviorRef.current;
        scrollBehaviorRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      historyEntryActiveRef.current = false;
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, onClose]);

  if (!isOpen || images.length === 0) {
    return null;
  }

  const currentImage = images[activeIndex] ?? images[initialIndex] ?? images[0];
  const currentSize = measuredSizes[currentImage.id] ?? (
    currentImage.width && currentImage.height
      ? { width: currentImage.width, height: currentImage.height }
      : null
  );

  const maxModalWidth = Math.min(viewportSize.width * 0.9 || 520, 520);
  const maxModalHeight = Math.min(viewportSize.height * 0.72 || 600, 600);
  const aspectRatio = currentSize ? currentSize.width / currentSize.height : 1;

  const slideFrame =
    aspectRatio >= maxModalWidth / maxModalHeight
      ? { width: maxModalWidth, height: maxModalWidth / aspectRatio }
      : { width: maxModalHeight * aspectRatio, height: maxModalHeight };

  const handleImageLoad =
    (id: string) => (event: SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      const nextSize = { width: image.naturalWidth, height: image.naturalHeight };

      if (!nextSize.width || !nextSize.height) return;

      setMeasuredSizes((prev) => {
        const prevSize = prev[id];
        if (prevSize?.width === nextSize.width && prevSize.height === nextSize.height) {
          return prev;
        }
        return { ...prev, [id]: nextSize };
      });
    };

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
    onIndexChange?.(index);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdrop={false}
      className="z-[9999] bg-black/85 p-4 backdrop-blur-sm"
      style={{ touchAction: 'pan-y' }}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[20px] font-bold text-[var(--text-primary)] shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition active:scale-95 hover:bg-white"
        onClick={onClose}
        aria-label="닫기"
        style={{ touchAction: 'manipulation' }}
      >
        ×
      </button>
      <div
        data-testid="image-modal-stage"
        className="relative flex max-w-[90vw] flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        style={{ touchAction: 'pan-y', width: `${Math.max(slideFrame.width, 240)}px` }}
      >
        <div className="pointer-events-none flex items-center justify-center" aria-hidden="true">
          <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white/85 backdrop-blur">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
            <span>좌우로 슬라이드</span>
          </span>
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          initialSlide={initialIndex}
          onSlideChange={(swiper) => handleSlideChange(swiper.realIndex)}
          className="w-full [&_img]:pointer-events-none [&_img]:select-none"
          style={{ height: `${Math.max(slideFrame.height, 180)}px` }}
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={image.id}
              className="!flex !items-center !justify-center"
              onContextMenu={(e) => e.preventDefault()}
            >
              <div
                className="relative h-full w-full"
                onContextMenu={(e) => e.preventDefault()}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 520px) 100vw, 520px"
                  className="object-contain select-none pointer-events-none"
                  priority={index === initialIndex}
                  loading={index === initialIndex ? 'eager' : 'lazy'}
                  draggable={false}
                  onLoad={handleImageLoad(image.id)}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ pointerEvents: 'none' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </ModalShell>
  );
};
