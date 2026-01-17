import type { ComponentPropsWithoutRef } from 'react';

type SelectFieldProps = ComponentPropsWithoutRef<'select'>;

const baseClassName =
  'rounded-[12px] border border-[var(--border-light)] bg-white px-4 py-3 text-[14px] text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20';

/**
 * 셀렉트 필드 컴포넌트
 * @param param SelectFieldProps
 * @returns JSX.Element
 */
export const SelectField = ({ className, ...props }: SelectFieldProps) => {
  const merged = className ? `${baseClassName} ${className}` : baseClassName;
  return <select className={merged} {...props} />;
};
