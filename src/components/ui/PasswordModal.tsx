'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { isFourDigitPassword } from '@/utils/validation';

type PasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title?: string;
  error?: string;
};

/**
 * 비밀번호 확인 모달
 */
export const PasswordModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '비밀번호 확인',
  error,
}: PasswordModalProps) => {
  const [password, setPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isFourDigitPassword(password)) {
        onConfirm(password);
      }
    },
    [password, onConfirm]
  );

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-[320px] rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-card)]">
        <h3 className="mb-4 text-center text-[18px] font-medium text-[var(--text-primary)]">
          {title}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
              placeholder="● ● ● ●"
              className="w-full rounded-[12px] border border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 py-3 text-center text-[18px] tracking-[0.5em] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            />
            <p className="mt-2 text-center text-[12px] text-[var(--text-muted)]">
              4자리 숫자를 입력해주세요
            </p>
            {error && (
              <p className="mt-2 text-center text-[12px] text-[var(--accent-burgundy)]">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[var(--border-light)] bg-white py-3 text-[14px] text-[var(--text-secondary)] transition hover:bg-[var(--bg-secondary)]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isFourDigitPassword(password)}
              className="flex-1 rounded-full bg-[var(--accent-burgundy)] py-3 text-[14px] text-white transition hover:opacity-90 disabled:bg-[var(--bg-tertiary)] disabled:text-[var(--text-muted)]"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
