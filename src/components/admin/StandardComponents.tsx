'use client';

import type { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface StandardCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

/**
 * 표준 카드 컴포넌트
 */
export const StandardCard = ({ title, children, className, actions }: StandardCardProps) => {
  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}>
      {title && (
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {actions}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

interface StandardInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onChange?: (value: string) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time';
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  id?: string;
  name?: string;
}

/**
 * 표준 입력 컴포넌트
 */
export const StandardInput = forwardRef<HTMLInputElement, StandardInputProps>(
  (
    {
      label,
      placeholder,
      value,
      onClick,
      onKeyDown,
      onChange,
      type = 'text',
      required = false,
      disabled = false,
      readOnly = false,
      error,
      className,
      icon,
      iconPosition = 'right',
      id,
      name,
      ...props
    },
    ref
  ) => {
    const hasIcon = Boolean(icon);
    const iconPaddingClass = hasIcon ? (iconPosition === 'left' ? 'pl-9' : 'pr-9') : '';
    return (
      <div className={cn('mb-4', className)}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className={cn('relative', hasIcon && 'text-gray-900')}>
          <input
            ref={ref}
            id={id}
            type={type}
            name={name}
            value={value}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className={cn(
              'w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm',
              'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
              'disabled:bg-gray-50 disabled:text-gray-500',
              iconPaddingClass,
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
            )}
            {...props}
          />
          {hasIcon ? (
            <span
              className={cn(
                'pointer-events-none absolute inset-y-0 flex items-center',
                iconPosition === 'left' ? 'left-3' : 'right-3'
              )}
            >
              {icon}
            </span>
          ) : null}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

StandardInput.displayName = 'StandardInput';

interface StandardButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

/**
 * 표준 버튼 컴포넌트
 */
export const StandardButton = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
}: StandardButtonProps) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-md transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
    >
      {loading && (
        <svg className="mr-2 -ml-1 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
