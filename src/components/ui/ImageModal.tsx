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
};

/**
 * 이미지 확대 모달 - 스크롤 위치 유지, 최상위 z-index
 * @param props ImageModalProps
 * @returns JSX.Element | null
 */
export const ImageModal = ({ isOpen, onClose, images, initialIndex }: ImageModalProps) => {
  const scrollPosRef = useRef(0);
  const scrollBehaviorRef = useRef<string | null>(null);
  const hasOpenedRef = useRef(false);

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
        className="relative max-h-[80dvh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'pan-y', maxHeight: '600px' }}
      >
        <Swiper
          key={initialIndex}
          slidesPerView={1}
          spaceBetween={0}
          initialSlide={initialIndex}
          className="h-[80dvh] max-h-[600px] w-[90vw] max-w-[520px]"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id} className="!flex !items-center !justify-center">
              <div className="relative h-full w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 520px) 100vw, 520px"
                  className="object-contain select-none"
                  priority={index === initialIndex}
                  loading={index === initialIndex ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </ModalShell>
  );
};
