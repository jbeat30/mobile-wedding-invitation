'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useActionState } from 'react';
import { Toast } from '@/components/ui/Toast';

type AdminFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

type AdminFormProps = {
  action: (formData: FormData) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
  children: ReactNode;
};

/**
 * 관리자 저장 폼 래퍼
 * @param props AdminFormProps
 * @returns JSX.Element
 */
export const AdminForm = ({
  action,
  successMessage = '저장 완료',
  errorMessage = '저장에 실패했습니다',
  className,
  children,
}: AdminFormProps) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const lastStatusRef = useRef<AdminFormState['status']>('idle');

  const [state, formAction] = useActionState<AdminFormState, FormData>(
    async (_prevState, formData) => {
      try {
        await action(formData);
        return { status: 'success' };
      } catch (error) {
        console.error('Admin form submit failed:', error);
        return { status: 'error' };
      }
    },
    { status: 'idle' }
  );

  useEffect(() => {
    if (state.status === 'idle' || state.status === lastStatusRef.current) {
      return;
    }
    const message = state.status === 'success' ? successMessage : errorMessage;
    setToastMessage(message);
    setToastOpen(true);
    const timer = window.setTimeout(() => setToastOpen(false), 2000);
    lastStatusRef.current = state.status;
    return () => window.clearTimeout(timer);
  }, [state.status, successMessage, errorMessage]);

  return (
    <>
      <form action={formAction} className={className}>
        {children}
      </form>
      <Toast
        isOpen={toastOpen}
        message={toastMessage}
        containerClassName="justify-end pr-6"
      />
    </>
  );
};
