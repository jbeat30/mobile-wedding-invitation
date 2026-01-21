import { forwardRef, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type TextareaProps = ComponentProps<'textarea'>;

/**
 * Shadcn 스타일 텍스트 영역
 * @param props TextareaProps
 * @returns JSX.Element
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[96px] w-full rounded-md border border-[var(--border-light)] bg-white/70 px-3 py-2 text-[14px] text-[var(--text-primary)] shadow-sm transition placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-rose)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-[var(--bg-primary)]',
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
