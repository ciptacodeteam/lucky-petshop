"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnMeta,
  type FilterFn,
  type GlobalFilterTableState,
  type RowData,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Loader2 } from "lucide-react";
import { Suspense, useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";

type TableLoadingProps = {
  columns: ColumnDef<any, any>[];
};

const TableLoading = ({ columns }: TableLoadingProps) => {
  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        <div className="mx-auto flex w-fit items-center gap-2">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </TableCell>
    </TableRow>
  );
};

type TableEmptyProps = {
  columns: ColumnDef<any, any>[];
};

const TableEmpty = ({ columns }: TableEmptyProps) => {
  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
};

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  loading?: boolean;
  withAddButton?: boolean;
  onAdd?: () => void;
}

export function DataTable<TData>({
  columns,
  data,
  loading,
  withAddButton = false,
  onAdd,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fuzzyFilter = useCallback<FilterFn<RowData>>(
    (row, columnId, value, addMeta) => {
      // Rank the item
      const itemRank = rankItem(row.getValue(columnId), value);

      // Store the itemRank info
      addMeta({ itemRank });

      // Return if the item should be filtered in/out
      return itemRank.passed;
    },
    [],
  );

  const handleSearchChange = useCallback((value: string) => {
    if (value) {
      table.setGlobalFilter(value);
    } else {
      table.setGlobalFilter(undefined);
    }
  }, []);

  const fallbackData = useMemo(() => data || [], [data]);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(fallbackData.length / pagination.pageSize),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "fuzzy" as GlobalFilterTableState["globalFilter"],
    enableMultiSort: false,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  return (
    <div>
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter || ""}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="max-w-60 text-sm"
          disabled={loading}
        />
        {withAddButton && (
          <Button onClick={onAdd} variant={"secondary"} disabled={loading}>
            <IconPlus className="size-5" />
            Buat Baru
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as ColumnMeta<
                    TData,
                    any
                  >;
                  return (
                    <TableHead
                      key={header.id}
                      className="hover:!bg-gray-100 dark:hover:!bg-gray-800"
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ width: meta?.width || "auto" }}
                    >
                      <div
                        className={cn(
                          "flex-between relative p-3 text-nowrap select-none",
                          header.column.getCanSort()
                            ? "cursor-pointer"
                            : "cursor-default",
                        )}
                        style={{ width: meta?.width || "auto" }}
                      >
                        <span className="mr-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </span>

                        {header.column.getCanSort() && (
                          <span
                            className={cn(
                              'absolute top-0 right-3 bottom-0 h-full w-3 before:absolute before:bottom-1/2 before:left-0 before:text-xs before:!leading-none before:text-gray-300 before:content-["▲"] after:absolute after:top-1/2 after:left-0 after:text-xs after:!leading-none after:text-gray-300 after:content-["▼"] dark:before:text-gray-500 dark:after:text-gray-500',
                              header.column.getIsSorted() === "asc" &&
                                "before:text-primary dark:before:text-primary",
                              header.column.getIsSorted() === "desc" &&
                                "after:text-primary dark:after:text-primary",
                            )}
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <Suspense fallback={<TableLoading columns={columns} />}>
              {loading ? (
                <TableLoading columns={columns} />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn("py-3 ps-5 whitespace-nowrap")}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableEmpty columns={columns} />
              )}
            </Suspense>
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Pagination>
          <PaginationContent className="ml-auto w-fit">
            <PaginationItem
              className={cn(
                "cursor-pointer",
                (!table.getCanPreviousPage() || loading) &&
                  "cursor-not-allowed opacity-50",
              )}
            >
              <PaginationPrevious
                onClick={() => table.previousPage()}
                isActive={table.getCanPreviousPage() && !loading}
              />
            </PaginationItem>
            <span className="flex items-center gap-1 px-2 text-sm font-medium">
              Page{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of <span className="font-medium">{table.getPageCount()}</span>
            </span>
            <PaginationItem
              className={cn(
                "cursor-pointer",
                (!table.getCanNextPage() || loading) &&
                  "cursor-not-allowed opacity-50",
              )}
            >
              <PaginationNext
                onClick={() => table.nextPage()}
                isActive={table.getCanNextPage() && !loading}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
