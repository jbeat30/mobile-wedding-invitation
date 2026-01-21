import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-[14px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-rose)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-[var(--bg-primary)]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent-burgundy)] text-white hover:opacity-90',
        primary: 'bg-[var(--accent-burgundy)] text-white hover:opacity-90',
        outline:
          'border border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]',
        ghost:
          'border border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]',
        accent:
          'border border-[var(--accent)] text-[var(--accent-rose-dark)] hover:bg-[var(--accent-soft)]',
        danger:
          'border border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--accent-burgundy)] hover:text-[var(--accent-burgundy)]',
        destructive:
          'border border-[var(--border-light)] text-[var(--accent-burgundy)] hover:border-[var(--accent-burgundy)] hover:bg-[var(--accent-rose-light)]',
      },
      size: {
        default: 'h-9 px-4 py-2 text-[14px]',
        sm: 'h-8 rounded-md px-3 text-[14px]',
        md: 'px-4 py-2 text-[14px]',
        lg: 'h-10 rounded-md px-3 py-2 text-[14px]',
        pill: 'px-4 py-1.5 text-[14px]',
        full: 'w-full py-3 text-[14px]',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

/**
 * Shadcn 스타일 버튼
 * @param props ButtonProps
 * @returns JSX.Element
 */
export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  type = 'button',
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
};

export { buttonVariants };
