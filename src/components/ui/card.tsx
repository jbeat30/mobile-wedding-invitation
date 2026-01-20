import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Shadcn 스타일 카드
 * @param props React.HTMLAttributes<HTMLDivElement>
 * @returns JSX.Element
 */
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-[16px] border border-[var(--border-light)] bg-white/80 shadow-[var(--shadow-card)]',
      className
    )}
    {...props}
  />
);

/**
 * 카드 헤더
 * @param props React.HTMLAttributes<HTMLDivElement>
 * @returns JSX.Element
 */
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1 border-b border-[var(--border-light)] p-4', className)} {...props} />
);

/**
 * 카드 제목
 * @param props React.HTMLAttributes<HTMLHeadingElement>
 * @returns JSX.Element
 */
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-[16px] font-semibold text-[var(--text-primary)]', className)} {...props} />
);

/**
 * 카드 본문
 * @param props React.HTMLAttributes<HTMLDivElement>
 * @returns JSX.Element
 */
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-4', className)} {...props} />
);
