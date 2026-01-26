import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/Button';

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

/**
 * AlertDialog 오버레이
 * @param props React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
 * @returns JSX.Element
 */
export const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/40', className)}
    {...props}
  />
));

AlertDialogOverlay.displayName = 'AlertDialogOverlay';

/**
 * AlertDialog 콘텐츠
 * @param props React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
 * @returns JSX.Element
 */
export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 w-[90%] max-w-[420px] translate-x-[-50%] translate-y-[-50%] rounded-[16px] border border-[var(--border-light)] bg-white p-6 shadow-[var(--shadow-card)] font-sans admin-font-scope',
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
));

AlertDialogContent.displayName = 'AlertDialogContent';

/**
 * AlertDialog 헤더
 * @param props React.HTMLAttributes<HTMLDivElement>
 * @returns JSX.Element
 */
export const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-2', className)} {...props} />
);

/**
 * AlertDialog 푸터
 * @param props React.HTMLAttributes<HTMLDivElement>
 * @returns JSX.Element
 */
export const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-4 flex justify-end gap-2', className)} {...props} />
);

/**
 * AlertDialog 타이틀
 * @param props React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
 * @returns JSX.Element
 */
export const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-[14px] font-semibold text-[var(--text-primary)]', className)}
    {...props}
  />
));

AlertDialogTitle.displayName = 'AlertDialogTitle';

/**
 * AlertDialog 설명
 * @param props React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
 * @returns JSX.Element
 */
export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-[14px] text-[var(--text-secondary)]', className)}
    {...props}
  />
));

AlertDialogDescription.displayName = 'AlertDialogDescription';

/**
 * AlertDialog 취소 버튼
 * @param props React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
 * @returns JSX.Element
 */
export const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), className)}
    {...props}
  />
));

AlertDialogCancel.displayName = 'AlertDialogCancel';

/**
 * AlertDialog 확인 버튼
 * @param props React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
 * @returns JSX.Element
 */
export const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants({ variant: 'default', size: 'sm' }), className)}
    {...props}
  />
));

AlertDialogAction.displayName = 'AlertDialogAction';
