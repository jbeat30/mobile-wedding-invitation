'use client';

import { ReactNode, forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

interface ModernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children?: ReactNode;
}

/**
 * 현대적인 버튼 컴포넌트
 */
export const ModernButton = forwardRef<HTMLButtonElement, ModernButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  const baseClasses = cn(
    'relative inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth && 'w-full'
  );

  const variantClasses = {
    primary: cn(
      'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm',
      'hover:from-rose-600 hover:to-pink-600 hover:shadow-md',
      'focus:ring-rose-400/50 active:from-rose-700 active:to-pink-700',
      'border border-transparent'
    ),
    secondary: cn(
      'bg-slate-100 text-slate-900 border border-slate-200 shadow-sm',
      'hover:bg-slate-200 hover:border-slate-300',
      'focus:ring-slate-400/50 active:bg-slate-300'
    ),
    outline: cn(
      'bg-transparent text-slate-700 border-2 border-slate-300',
      'hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900',
      'focus:ring-slate-400/50 active:bg-slate-100'
    ),
    ghost: cn(
      'bg-transparent text-slate-600 border border-transparent',
      'hover:bg-slate-100 hover:text-slate-900',
      'focus:ring-slate-400/50 active:bg-slate-200'
    ),
    danger: cn(
      'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm',
      'hover:from-red-600 hover:to-red-700 hover:shadow-md',
      'focus:ring-red-400/50 active:from-red-700 active:to-red-800',
      'border border-transparent'
    ),
    success: cn(
      'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm',
      'hover:from-green-600 hover:to-emerald-600 hover:shadow-md',
      'focus:ring-green-400/50 active:from-green-700 active:to-emerald-700',
      'border border-transparent'
    ),
    warning: cn(
      'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm',
      'hover:from-yellow-600 hover:to-orange-600 hover:shadow-md',
      'focus:ring-yellow-400/50 active:from-yellow-700 active:to-orange-700',
      'border border-transparent'
    )
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
    sm: 'px-3 py-2 text-sm rounded-md gap-2',
    md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
    lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
    xl: 'px-8 py-4 text-lg rounded-xl gap-3'
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* 로딩 오버레이 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-current/10 rounded-[inherit]">
          <Loader2Icon className={cn('animate-spin text-current', iconSizeClasses[size])} />
        </div>
      )}

      {/* 아이콘 (왼쪽) */}
      {icon && iconPosition === 'left' && !loading && (
        <span className={cn('flex-shrink-0', iconSizeClasses[size])}>
          {icon}
        </span>
      )}

      {/* 텍스트 */}
      <span className={cn('flex-1', loading && 'opacity-0')}>
        {children}
      </span>

      {/* 아이콘 (오른쪽) */}
      {icon && iconPosition === 'right' && !loading && (
        <span className={cn('flex-shrink-0', iconSizeClasses[size])}>
          {icon}
        </span>
      )}
    </button>
  );
});

ModernButton.displayName = 'ModernButton';

interface ModernButtonGroupProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * 버튼 그룹 컴포넌트
 */
export const ModernButtonGroup = ({
  children,
  className
}: ModernButtonGroupProps) => {
  return (
    <div className={cn('inline-flex rounded-lg shadow-sm', className)} role="group">
      {children}
    </div>
  );
};

interface ModernFloatingActionButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  className?: string;
}

/**
 * 플로팅 액션 버튼
 */
export const ModernFloatingActionButton = ({
  icon,
  onClick,
  position = 'bottom-right',
  variant = 'primary',
  size = 'md',
  tooltip,
  className
}: ModernFloatingActionButtonProps) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6', 
    lg: 'w-7 h-7'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
  };

  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        'rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-50',
        'hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400/50',
        'transform hover:scale-105 active:scale-95',
        positionClasses[position],
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <span className={iconSizeClasses[size]}>
        {icon}
      </span>
    </button>
  );
};

interface ModernToggleButtonProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: 'default' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

/**
 * 토글 버튼 컴포넌트
 */
export const ModernToggleButton = ({
  pressed = false,
  onPressedChange,
  variant = 'default',
  size = 'md',
  children,
  className
}: ModernToggleButtonProps) => {
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs rounded-md',
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg'
  };

  const variantClasses = {
    default: pressed
      ? 'bg-rose-500 text-white border border-rose-500 shadow-md'
      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    outline: pressed
      ? 'bg-rose-50 text-rose-700 border-2 border-rose-500'
      : 'bg-transparent text-slate-700 border-2 border-slate-300 hover:border-slate-400'
  };

  return (
    <button
      onClick={() => onPressedChange?.(!pressed)}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-rose-400/50',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </button>
  );
};