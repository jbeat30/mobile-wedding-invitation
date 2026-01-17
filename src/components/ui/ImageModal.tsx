'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ModalShell } from '@/components/ui/ModalShell';

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
};

/**
 * 이미지 확대 모달 - 스크롤 위치 유지, 최상위 z-index
 * @param props ImageModalProps
 * @returns JSX.Element | null
 */
export const ImageModal = ({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) => {
  const scrollPosRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      scrollPosRef.current = window.scrollY;

      // body 스크롤 차단 (위치 유지)
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.width = '100%';
    } else {
      // 스크롤 복원
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // 이전 스크롤 위치로 복원
      window.scrollTo(0, scrollPosRef.current);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      className="z-[9999] bg-black/85 p-4 backdrop-blur-sm"
      style={{ touchAction: 'none' }}
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
        style={{ touchAction: 'none', maxHeight: '600px' }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={800}
          height={600}
          className="h-auto w-auto object-contain select-none"
          style={{ maxHeight: '600px', maxWidth: '90vw' }}
          unoptimized
          draggable={false}
        />
      </div>
    </ModalShell>
  );
};
