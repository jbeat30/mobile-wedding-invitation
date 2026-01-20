import { forwardRef, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type InputProps = ComponentProps<'input'>;

/**
 * Shadcn 스타일 인풋
 * @param props InputProps
 * @returns JSX.Element
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-md border border-[var(--border-light)] bg-white/70 px-3 py-2 text-[13px] text-[var(--text-primary)] shadow-sm transition placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-rose)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-[var(--bg-primary)]',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
