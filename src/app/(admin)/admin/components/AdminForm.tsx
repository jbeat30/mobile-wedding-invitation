'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useActionState } from 'react';
import { Toast } from '@/components/ui/Toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type AdminFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  submittedAt?: number;
};

type AdminFormProps = {
  action: (formData: FormData) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  confirmTitle?: string;
  confirmDescription?: string;
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
  confirmTitle = '저장하시겠어요?',
  confirmDescription = '확인 버튼을 누르면 즉시 반영됩니다.',
  className,
  children,
}: AdminFormProps) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const allowSubmitRef = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [state, formAction] = useActionState<AdminFormState, FormData>(
    async (_prevState, formData) => {
      try {
        await action(formData);
        return { status: 'success', submittedAt: Date.now() };
      } catch (error) {
        console.error('Admin form submit failed:', error);
        return { status: 'error', submittedAt: Date.now() };
      }
    },
    { status: 'idle' }
  );

  useEffect(() => {
    if (state.status === 'idle') {
      return;
    }
    const message = state.status === 'success' ? successMessage : errorMessage;
    setToastMessage(message);
    setToastOpen(true);
    const timer = window.setTimeout(() => setToastOpen(false), 2000);
    return () => window.clearTimeout(timer);
  }, [state.status, state.submittedAt, successMessage, errorMessage]);

  /**
   * 저장 전 확인 다이얼로그 열기
   * @param event React.FormEvent<HTMLFormElement>
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (allowSubmitRef.current) {
      allowSubmitRef.current = false;
      return;
    }
    event.preventDefault();
    setConfirmOpen(true);
  };

  /**
   * 확인 후 실제 저장 요청
   * @returns void
   */
  const handleConfirm = () => {
    allowSubmitRef.current = true;
    setConfirmOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <form ref={formRef} action={formAction} className={className} onSubmit={handleSubmit}>
        {children}
      </form>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toast
        isOpen={toastOpen}
        message={toastMessage}
        containerClassName="justify-end pr-6"
      />
    </>
  );
};
