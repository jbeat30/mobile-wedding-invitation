import { type ComponentProps } from 'react';
import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type CalendarProps = ComponentProps<typeof DayPicker>;

/**
 * Shadcn 스타일 캘린더
 * @param props CalendarProps
 * @returns JSX.Element
 */
export const Calendar = ({ className, classNames, ...props }: CalendarProps) => {
  return (
    <DayPicker
      locale={ko}
      className={cn('p-3 font-sans', className)}
      classNames={{
        root: 'relative',
        months: 'flex flex-col gap-3',
        month: 'space-y-2',
        month_caption: 'relative flex items-center justify-center',
        caption_label: 'text-[14px] font-semibold text-[var(--text-primary)]',
        nav: 'absolute right-0 top-0 flex items-center gap-1 z-[9999]',
        button_previous:
          'flex items-center justify-center h-7 w-7 rounded-md border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]',
        button_next:
          'flex items-center justify-center h-7 w-7 rounded-md border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]',
        chevron: 'h-4 w-4',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'w-9 text-center text-[14px] text-[var(--text-muted)]',
        weeks: 'mt-1 flex flex-col gap-1',
        week: 'flex w-full',
        day: 'relative h-9 w-9 text-center text-[14px]',
        day_button:
          'h-9 w-9 rounded-md font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-rose)] focus-visible:ring-offset-2',
        selected:
          'bg-[var(--accent-burgundy)] text-white [&>button]:text-white [&>button]:hover:bg-[var(--accent-burgundy)]',
        today: 'border border-[var(--accent-rose)]',
        outside: 'text-[var(--text-muted)] opacity-50',
        disabled: 'text-[var(--text-muted)] opacity-40',
        ...classNames,
      }}
      {...props}
    />
  );
};
