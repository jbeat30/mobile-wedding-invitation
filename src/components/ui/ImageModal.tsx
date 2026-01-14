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
      // 스크롤 및 viewport 변경 완전 차단
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      style={{ touchAction: 'none' }}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[20px] font-bold text-[var(--text-primary)] shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition active:scale-95 hover:bg-white"
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
    </div>
  );
};
