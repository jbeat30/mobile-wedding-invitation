import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

/**
 * Shadcn 스타일 라벨
 * @param props React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
 * @returns JSX.Element
 */
export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn('text-[14px] font-medium text-[var(--text-secondary)]', className)}
    {...props}
  />
));

Label.displayName = 'Label';
