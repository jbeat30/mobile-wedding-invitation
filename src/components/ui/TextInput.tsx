import type { ComponentPropsWithoutRef } from 'react';

type TextInputProps = ComponentPropsWithoutRef<'input'>;

type TextAreaProps = ComponentPropsWithoutRef<'textarea'>;

const baseClassName =
  'rounded-[12px] border border-[var(--border-light)] bg-white px-4 py-3 text-[14px] text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20';

const mergeClassName = (className?: string) => {
  return className ? `${baseClassName} ${className}` : baseClassName;
};

/**
 * 기본 입력 필드 공통화
 * @param props TextInputProps
 * @returns JSX.Element
 */
export const TextInput = ({ className, ...props }: TextInputProps) => {
  return <input className={mergeClassName(className)} {...props} />;
};

/**
 * 텍스트 영역 공통화
 * @param props TextAreaProps
 * @returns JSX.Element
 */
export const TextArea = ({ className, ...props }: TextAreaProps) => {
  return <textarea className={mergeClassName(className)} {...props} />;
};
