import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

/**
 * Select 트리거
 * @param props React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
 * @returns JSX.Element
 */
export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-9 w-full items-center justify-between rounded-md border border-[var(--border-light)] bg-white/70 px-3 text-[14px] text-[var(--text-primary)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-rose)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-[var(--bg-primary)]',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon className="text-[var(--text-muted)]">▾</SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

SelectTrigger.displayName = 'SelectTrigger';

/**
 * Select 콘텐츠
 * @param props React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
 * @returns JSX.Element
 */
export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white shadow-[var(--shadow-card)]',
        className
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-2" />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = 'SelectContent';

/**
 * Select 아이템
 * @param props React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
 * @returns JSX.Element
 */
export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-[8px] px-3 py-2 text-[14px] text-[var(--text-secondary)] outline-none focus:bg-[var(--bg-secondary)] focus:text-[var(--text-primary)] data-[state=checked]:font-semibold',
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

SelectItem.displayName = 'SelectItem';
