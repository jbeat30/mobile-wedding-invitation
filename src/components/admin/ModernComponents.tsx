'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { 
  InfoIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  XCircleIcon,
  LightbulbIcon
} from 'lucide-react';

interface ModernCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * 현대적인 카드 컴포넌트
 */
export const ModernCard = ({ 
  children, 
  title, 
  subtitle, 
  icon, 
  className, 
  variant = 'default',
  padding = 'md'
}: ModernCardProps) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const variantClasses = {
    default: 'bg-white border border-slate-200 shadow-sm',
    gradient: 'bg-gradient-to-br from-white via-slate-50 to-white border border-slate-200 shadow-lg',
    bordered: 'bg-white border-2 border-slate-300 shadow-sm',
    glass: 'bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg'
  };

  return (
    <div className={cn(
      'rounded-xl transition-all duration-200 hover:shadow-md',
      variantClasses[variant],
      paddingClasses[padding],
      className
    )}>
      {(title || subtitle || icon) && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-slate-500 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

interface ModernAlertProps {
  children: ReactNode;
  type: 'info' | 'success' | 'warning' | 'error' | 'tip';
  title?: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * 현대적인 알림 컴포넌트
 */
export const ModernAlert = ({ 
  children, 
  type, 
  title, 
  className,
  dismissible = false,
  onDismiss
}: ModernAlertProps) => {
  const typeConfig = {
    info: {
      icon: InfoIcon,
      bgClass: 'bg-blue-50 border-blue-200',
      iconClass: 'text-blue-500',
      titleClass: 'text-blue-800',
      textClass: 'text-blue-700'
    },
    success: {
      icon: CheckCircle2Icon,
      bgClass: 'bg-green-50 border-green-200',
      iconClass: 'text-green-500',
      titleClass: 'text-green-800',
      textClass: 'text-green-700'
    },
    warning: {
      icon: AlertTriangleIcon,
      bgClass: 'bg-yellow-50 border-yellow-200',
      iconClass: 'text-yellow-500',
      titleClass: 'text-yellow-800',
      textClass: 'text-yellow-700'
    },
    error: {
      icon: XCircleIcon,
      bgClass: 'bg-red-50 border-red-200',
      iconClass: 'text-red-500',
      titleClass: 'text-red-800',
      textClass: 'text-red-700'
    },
    tip: {
      icon: LightbulbIcon,
      bgClass: 'bg-purple-50 border-purple-200',
      iconClass: 'text-purple-500',
      titleClass: 'text-purple-800',
      textClass: 'text-purple-700'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'border rounded-lg p-4 flex items-start space-x-3',
      config.bgClass,
      className
    )}>
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClass)} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={cn('text-sm font-medium mb-1', config.titleClass)}>
            {title}
          </h4>
        )}
        <div className={cn('text-sm', config.textClass)}>
          {children}
        </div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors',
            config.iconClass
          )}
        >
          <XCircleIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

interface ModernBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 현대적인 배지 컴포넌트
 */
export const ModernBadge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: ModernBadgeProps) => {
  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={cn(
      'inline-flex items-center font-medium border rounded-full',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
};

interface ModernStatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

/**
 * 현대적인 통계 카드 컴포넌트
 */
export const ModernStatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  className 
}: ModernStatsCardProps) => {
  const changeTypeClasses = {
    increase: 'text-green-600 bg-green-50',
    decrease: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-50'
  };

  return (
    <ModernCard className={cn('p-6', className)} variant="gradient">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {change && (
            <p className={cn(
              'text-sm font-medium mt-2 px-2 py-1 rounded-md inline-block',
              changeTypeClasses[changeType]
            )}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </ModernCard>
  );
};