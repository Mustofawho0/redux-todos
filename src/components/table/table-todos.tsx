'use client';
import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { filterTodo, priorityTodo } from '@/features/todo/todo-slice';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

type rowSelectionState = Record<string, boolean>;

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<rowSelectionState>({});

  const filteredTodos = useSelector((state: any) => state.todos.filter);
  const dispatch = useDispatch();

  const handleFilter = (status: string) => {
    dispatch(
      filterTodo({
        status,
      })
    );
  };

  const handlePriority = (id: string[]) => {
    id.forEach((id) => {
      const todo = filteredTodos.find((todo: any) => todo.id === id);
      const isFavorite = todo?.priority;

      dispatch(priorityTodo({ id }));

      const status = isFavorite ? 'set not to be favorite' : 'favorite';

      toast(`Todo has been ${status}`);
    });
  };

  const table = useReactTable({
    data: filteredTodos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div>
      <div className='py-2 flex justify-between items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Input
            placeholder='Filter todos...'
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            className='mobile:w-[26vw] mobile:text-xs w-[15vw] mobile:h-8'
          />
          <Button
            variant={'outline'}
            className='flex items-center gap-1 text-gray-600 hover:bg-gray-800 hover:text-white mobile:text-xs mobile:h-8 px-3'
            onClick={() => {
              const selectedId = Object.keys(rowSelection)
                .filter((key) => rowSelection[key])
                .map((key) => filteredTodos[key].id);

              if (selectedId.length) {
                handlePriority(selectedId);
              }
            }}
          >
            <Sparkles className='h-4 w-4 mobile:h-3 mobile:w-3 hover:text-white' />
            Priority
          </Button>
        </div>
        <Select onValueChange={handleFilter}>
          <SelectTrigger className='w-[180px] mobile:w-[30vw] mobile:h-8'>
            <SelectValue placeholder='Filter status' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value='All'>All</SelectItem>
              <SelectItem value='In Progress'>In Progress</SelectItem>
              <SelectItem value='Done'>Done</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='font-bold tracking-wide text-black '
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className=''>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  <p>No Results.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm mobile:text-xs text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant={'outline'}
            size={'sm'}
            className='mobile:text-xs'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant={'outline'}
            size={'sm'}
            className='mobile:text-xs'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
