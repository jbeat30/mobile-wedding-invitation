'use client';

import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/Button';

type AdminSubmitButtonProps = ComponentProps<typeof Button> & {
  pendingText?: string;
};

/**
 * 관리자 저장 버튼 (로딩 상태 표시)
 * @param props AdminSubmitButtonProps
 * @returns JSX.Element
 */
export const AdminSubmitButton = ({
  pendingText = '저장 중...',
  children,
  disabled,
  ...props
}: AdminSubmitButtonProps) => {
  const { pending } = useFormStatus();
  const isDisabled = Boolean(disabled) || pending;

  return (
    <Button {...props} type="submit" disabled={isDisabled}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 animate-spin rounded-full border border-white/70 border-t-transparent" />
          {pendingText}
        </span>
      ) : (
        children
      )}
    </Button>
  );
};
