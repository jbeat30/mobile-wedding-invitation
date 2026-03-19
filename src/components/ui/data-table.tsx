import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  type RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number;
  pageSize: number;
  onPageChange: (nextPage: number) => void;
  emptyMessage?: string;
  enableRowSelection?: boolean;
  getRowId?: (row: TData) => string;
  onDeleteSelected?: (ids: string[]) => void;
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
  enableRowSelection = false,
  getRowId,
  onDeleteSelected,
}: DataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const paginationState = useMemo<PaginationState>(
    () => ({ pageIndex: Math.max(0, pageIndex - 1), pageSize }),
    [pageIndex, pageSize]
  );
  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));

  const selectionColumn: ColumnDef<TData, unknown> = useMemo(
    () => ({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="h-4 w-4 cursor-pointer accent-[var(--accent-burgundy)]"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="h-4 w-4 cursor-pointer accent-[var(--accent-burgundy)]"
        />
      ),
      size: 40,
    }),
    []
  );

  const effectiveColumns = useMemo(
    () => (enableRowSelection ? [selectionColumn, ...columns] : columns),
    [enableRowSelection, selectionColumn, columns]
  );

  const table = useReactTable({
    data,
    columns: effectiveColumns as ColumnDef<TData, TValue>[],
    state: { pagination: paginationState, rowSelection },
    onPaginationChange: (updater) => {
      const nextState = typeof updater === 'function' ? updater(paginationState) : updater;
      onPageChange(nextState.pageIndex + 1);
      setRowSelection({});
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection,
    getRowId,
  });

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
  const selectedCount = selectedIds.length;

  const handleDeleteSelected = () => {
    if (selectedCount === 0) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDeleteSelected?.(selectedIds);
    setRowSelection({});
    setShowDeleteConfirm(false);
  };

  return (
    <>
      {enableRowSelection && (
        <div className="mb-2 flex h-8 items-center justify-end">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            className={selectedCount > 0 ? 'visible' : 'invisible'}
            tabIndex={selectedCount > 0 ? 0 : -1}
          >
            선택 삭제 ({selectedCount}개)
          </Button>
        </div>
      )}
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
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={effectiveColumns.length}
                  className="py-6 text-center text-[14px] text-[var(--text-muted)]"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t border-[var(--border-light)] px-4 py-2 text-[14px] text-[var(--text-muted)]">
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

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>선택한 항목을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCount}개의 항목이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
