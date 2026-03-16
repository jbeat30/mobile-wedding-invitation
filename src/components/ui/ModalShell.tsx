'use client';

import { useEffect, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
  closeOnBackdrop?: boolean;
  className?: string;
  style?: CSSProperties;
  portalTarget?: Element | null;
  children: ReactNode;
} & Pick<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-modal'>;

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
  portalTarget,
  role,
  'aria-modal': ariaModal,
  children,
}: ModalShellProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  if (!mounted) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdrop) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const content = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className}`}
      onClick={handleBackdropClick}
      onContextMenu={(e) => e.preventDefault()}
      style={style}
      role={role}
      aria-modal={ariaModal}
    >
      {children}
    </div>
  );

  return createPortal(content, portalTarget ?? document.body);
};
