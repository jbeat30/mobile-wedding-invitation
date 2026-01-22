'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ModalShell } from '@/components/ui/ModalShell';

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: { id: string; src: string; alt: string }[];
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

  /**
   * 모달 내 슬라이드 변경 처리
   * @param index 현재 슬라이드 인덱스
   */
  const handleSlideChange = (index: number) => {
    onIndexChange?.(index);
  };

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

  if (!isOpen || images.length === 0) {
    return null;
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      className="z-[9999] bg-black/85 p-4 backdrop-blur-sm"
      style={{ touchAction: 'pan-y' }}
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
        className="relative flex max-h-[80dvh] max-w-[90vw] flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        style={{ touchAction: 'pan-y', maxHeight: '600px' }}
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
          key={initialIndex}
          slidesPerView={1}
          spaceBetween={0}
          initialSlide={initialIndex}
          onSlideChange={(swiper) => handleSlideChange(swiper.realIndex)}
          className="h-[80dvh] max-h-[600px] w-[90vw] max-w-[520px] [&_img]:pointer-events-none [&_img]:select-none"
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
                  onContextMenu={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
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
