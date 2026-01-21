import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

/**
 * Accordion 아이템
 * @param props React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
 * @returns JSX.Element
 */
export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'rounded-[18px] border border-[var(--border-light)] bg-[var(--card-bg)] shadow-[var(--shadow-soft)]',
      className
    )}
    {...props}
  />
));

AccordionItem.displayName = 'AccordionItem';

/**
 * Accordion 트리거
 * @param props React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
 * @returns JSX.Element
 */
export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-[16px] font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent-rose-dark)]',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span className="flex h-6 w-6 items-center justify-center text-[var(--text-tertiary)] transition-transform duration-200 data-[state=open]:rotate-180">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = 'AccordionTrigger';

/**
 * Accordion 콘텐츠
 * @param props React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
 * @returns JSX.Element
 */
export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn('overflow-hidden px-5 pb-5 text-[14px]', className)}
    {...props}
  >
    <div className="pt-1">{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = 'AccordionContent';
