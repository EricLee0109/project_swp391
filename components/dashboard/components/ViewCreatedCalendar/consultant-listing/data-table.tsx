"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PaginationDashboard } from "@/components/dashboard/PaginationDashboard";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];       // Cấu hình các cột
  data: TData[];                             // Dữ liệu từng trang
  pageIndex: number;                         // Index trang hiện tại (tính từ 0)
  pageSize: number;                          // Số item/trang
  total: number;                             // Tổng số item
  onPageChange: (page: number) => void;      // Hàm đổi trang (1-based)
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  pageSize,
  total,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      pageIndex,
      pageSize,
    },
    manualPagination: true, // sử dụng phân trang bên ngoài
    pageCount: Math.ceil(total / pageSize),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Không có dữ liệu.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-4">
        <PaginationDashboard
          page={pageIndex + 1} // đổi sang 1-based cho UI
          total={total}
          limit={pageSize}
          onPageChange={(page) => onPageChange(page)}
        />
      </div>
    </div>
  );
}
