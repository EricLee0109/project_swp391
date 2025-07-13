"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
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
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// const filterConfigs = [
//   //Appointments Table
//   {
//     columnKey: "user_full_name",
//     placeholder: "Filter by customer name...",
//   },
//   //Shippings Table
//   {
//     columnKey: "user_name",
//     placeholder: "Filter by customer name...",
//   },
//   //Health Services Table
//   {
//     columnKey: "name",
//     placeholder: "Filter by service name...",
//   },
//   //Blog Table
//   {
//     columnKey: "title",
//     placeholder: "Filter by title name...",
//   },
// ];

//Reusable DataTable component that can be used in various parts of the application
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    meta: {},
  });

  // //filter search name
  // const filterFound = React.useMemo(() => {
  //   //prevent re-render, memmorize result
  //   const findFilterSearch = filterConfigs.filter((column) =>
  //     table?.getColumn(column?.columnKey)
  //   );
  //   console.log(findFilterSearch[0], "filter search");
  //   return findFilterSearch[0];
  // }, [table]);

  // const columnFound = table.getColumn(filterFound?.columnKey);

  return (
    <div className="ml-4 mr-4 mt-4">
      {/* {filterFound && (
        <div className="flex items-center py-4">
          <Input
            key={filterFound.columnKey}
            placeholder={filterFound.placeholder}
            value={(columnFound?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              columnFound?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )} */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
