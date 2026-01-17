import type { ReactNode } from 'react';

type ToastProps = {
  isOpen: boolean; // 토스트 오픈 여부
  message: ReactNode; // 토스트 메시지
  containerClassName?: string; // 컨테이너 클래스 이름
  toastClassName?: string; // 토스트 클래스 이름
};

/**
 * 토스트 컴포넌트
 * @param param ToastProps
 * @returns JSX.Element | null
 * @constructor
 */
export const Toast = ({
  isOpen,
  message,
  containerClassName = '',
  toastClassName = '',
}: ToastProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-[calc(var(--safe-bottom)+16px)] z-50 flex justify-center px-6 ${containerClassName}`}
    >
      <div
        className={`rounded-full bg-[#2f2f2f] px-5 py-2.5 text-[13px] text-white shadow-[0_12px_30px_rgba(0,0,0,0.3)] ${toastClassName}`}
      >
        {message}
      </div>
    </div>
  );
};
