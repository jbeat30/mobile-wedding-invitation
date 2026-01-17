import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'accent' | 'danger';

type ButtonSize = 'sm' | 'md' | 'lg' | 'pill' | 'full';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseClassName =
  'rounded-full transition disabled:cursor-not-allowed disabled:opacity-40';

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--accent-burgundy)] text-white hover:opacity-90',
  outline:
    'border border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-secondary)]',
  ghost:
    'border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]',
  accent:
    'border border-[var(--accent)] text-[var(--accent-rose-dark)] hover:bg-[var(--accent-soft)]',
  danger:
    'border border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--accent-burgundy)] hover:text-[var(--accent-burgundy)]',
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-[11px]',
  md: 'px-4 py-2 text-[12px]',
  lg: 'py-3 text-[14px]',
  pill: 'px-4 py-1.5 text-[12px]',
  full: 'w-full py-3 text-[14px]',
};

/**
 * 버튼 컴포넌트
 * @param props ButtonProps
 * @returns JSX.Element
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => {
  const variantClassName = variantClassMap[variant];
  const sizeClassName = sizeClassMap[size];
  const mergedClassName = `${baseClassName} ${variantClassName} ${sizeClassName} ${className}`.trim();

  return <button type={type} className={mergedClassName} {...props} />;
};
