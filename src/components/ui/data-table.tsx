import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number;
  pageSize: number;
  onPageChange: (nextPage: number) => void;
  emptyMessage?: string;
};

/**
 * Shadcn 스타일 데이터 테이블
 * @param props DataTableProps
 * @returns JSX.Element
 */
export const DataTable = <TData, TValue>({
  columns,
  data,
  pageIndex,
  pageSize,
  onPageChange,
  emptyMessage = '데이터가 없습니다',
}: DataTableProps<TData, TValue>) => {
  const paginationState = useMemo<PaginationState>(
    () => ({ pageIndex: Math.max(0, pageIndex - 1), pageSize }),
    [pageIndex, pageSize]
  );
  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));

  const table = useReactTable({
    data,
    columns,
    state: { pagination: paginationState },
    onPaginationChange: (updater) => {
      const nextState =
        typeof updater === 'function' ? updater(paginationState) : updater;
      onPageChange(nextState.pageIndex + 1);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/70">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-6 text-center text-[12px] text-[var(--text-muted)]">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t border-[var(--border-light)] px-4 py-2 text-[12px] text-[var(--text-muted)]">
        <span>총 {data.length}건</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, pageIndex - 1))}
            disabled={pageIndex <= 1}
          >
            이전
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pageCount, pageIndex + 1))}
            disabled={pageIndex >= pageCount}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};
