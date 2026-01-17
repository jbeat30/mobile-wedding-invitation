import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type SurfaceCardProps<T extends ElementType = 'div'> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

export const SurfaceCard = <T extends ElementType = 'div'>(
  props: SurfaceCardProps<T>
) => {
  const { as, className = '', children, ...rest } = props;
  const Component = as || 'div';
  const baseClassName =
    'rounded-[var(--radius-md)] border border-[var(--card-border)] bg-white/70 shadow-[var(--shadow-soft)]';

  return (
    <Component className={`${baseClassName} ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
};
