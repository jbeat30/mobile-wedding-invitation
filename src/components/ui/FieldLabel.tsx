import type { ReactNode } from 'react';

type FieldLabelProps = {
  htmlFor?: string; // 연결된 폼 필드 ID
  required?: boolean; // 필수 여부
  children: ReactNode; // 라벨 내용
};

/**
 * 폼 필드 라벨 컴포넌트
 * @param param FieldLabelProps
 * @returns JSX.Element
 */
export const FieldLabel = ({ htmlFor, required, children }: FieldLabelProps) => {
  return (
    <label
      className="font-label text-[10px] text-[var(--text-muted)]"
      htmlFor={htmlFor}
    >
      {children}
      {required ? <span className="ml-1 text-[var(--accent-burgundy)]">*</span> : null}
    </label>
  );
};
