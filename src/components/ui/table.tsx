import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * 테이블 래퍼
 * @param props React.HTMLAttributes<HTMLTableElement>
 * @returns JSX.Element
 */
export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto">
    <table className={cn('w-full caption-bottom text-[14px]', className)} {...props} />
  </div>
);

/**
 * 테이블 헤더
 * @param props React.HTMLAttributes<HTMLTableSectionElement>
 * @returns JSX.Element
 */
export const TableHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('border-b border-[var(--border-light)]', className)} {...props} />
);

/**
 * 테이블 바디
 * @param props React.HTMLAttributes<HTMLTableSectionElement>
 * @returns JSX.Element
 */
export const TableBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
);

/**
 * 테이블 로우
 * @param props React.HTMLAttributes<HTMLTableRowElement>
 * @returns JSX.Element
 */
export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn(
      'border-b border-[var(--border-light)] transition-colors hover:bg-[var(--bg-secondary)]',
      className
    )}
    {...props}
  />
);

/**
 * 테이블 헤더 셀
 * @param props React.ThHTMLAttributes<HTMLTableCellElement>
 * @returns JSX.Element
 */
export const TableHead = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      'h-10 px-4 text-left align-middle font-semibold text-[var(--text-secondary)]',
      className
    )}
    {...props}
  />
);

/**
 * 테이블 셀
 * @param props React.TdHTMLAttributes<HTMLTableCellElement>
 * @returns JSX.Element
 */
export const TableCell = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('p-4 align-middle text-[14px]', className)} {...props} />
);
