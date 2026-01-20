import type { ReactNode } from 'react';

type FieldLabelProps = {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
};

/**
 * 폼 라벨 공통 스타일
 * @param props FieldLabelProps
 * @returns JSX.Element
 */
export const FieldLabel = ({ htmlFor, required, children }: FieldLabelProps) => {
  return (
    <label
      className="font-label text-[11px] text-[var(--text-muted)]"
      htmlFor={htmlFor}
    >
      {children}
      {required ? <span className="ml-1 text-[var(--accent-burgundy)]">*</span> : null}
    </label>
  );
};
