'use client';

import { useEffect } from 'react';
import Image from 'next/image';

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
};

/**
 * 이미지 확대 모달
 */
export const ImageModal = ({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) => {
  useEffect(() => {
    if (isOpen) {
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[20px] font-bold text-[var(--text-primary)] shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition hover:bg-white"
        onClick={onClose}
        aria-label="닫기"
      >
        ×
      </button>
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={800}
          height={600}
          className="h-auto max-h-[90vh] w-auto object-contain"
          unoptimized
        />
      </div>
    </div>
  );
};
