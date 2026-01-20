'use client';

import { useRef, useState, type FormEvent } from 'react';
import { logoutAction } from '@/app/(admin)/admin/actions/auth';
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
import { Button } from '@/components/ui/Button';

/**
 * 관리자 로그아웃 버튼
 * @returns JSX.Element
 */
export const AdminLogoutButton = () => {
  const [open, setOpen] = useState(false);
  const allowSubmitRef = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  /**
   * 로그아웃 확인창 열기
   * @param event React.FormEvent<HTMLFormElement>
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (allowSubmitRef.current) {
      allowSubmitRef.current = false;
      return;
    }
    event.preventDefault();
    setOpen(true);
  };

  /**
   * 로그아웃 확정 처리
   * @returns void
   */
  const handleConfirm = () => {
    allowSubmitRef.current = true;
    setOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <form ref={formRef} action={logoutAction} onSubmit={handleSubmit}>
        <Button type="submit" variant="ghost" size="sm" className="bg-white">
          로그아웃
        </Button>
      </form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그아웃할까요?</AlertDialogTitle>
            <AlertDialogDescription>진행 중인 작업이 있다면 저장 후 로그아웃해 주세요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
