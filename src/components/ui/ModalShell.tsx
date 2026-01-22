'use client';

import { useEffect, type CSSProperties, type ReactNode } from 'react';

type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
  closeOnBackdrop?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * 모달 기본 래퍼
 * @param props ModalShellProps
 * @returns JSX.Element | null
 */
export const ModalShell = ({
  isOpen,
  onClose,
  closeOnBackdrop = true,
  className = '',
  style,
  children,
}: ModalShellProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdrop) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className}`}
      onClick={handleBackdropClick}
      onContextMenu={(e) => e.preventDefault()}
      style={style}
    >
      {children}
    </div>
  );
};
