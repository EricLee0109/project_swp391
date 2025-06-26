"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { ServicesListType } from "@/types/ServiceType/StaffRoleType";

interface HealthServicesTableProps {
  services: ServicesListType[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onUpdateServices: (services: ServicesListType[]) => void;
  setIsCreateDialogOpen: (open: boolean) => void;
  setServiceToEdit: (service: ServicesListType) => void;
}

export default function HealthServicesTable({
  services,
  totalPages,
  currentPage,
  onPageChange,
  onUpdateServices,
  setIsCreateDialogOpen,
  setServiceToEdit,
}: HealthServicesTableProps) {
  const table = useReactTable({
    data: services,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onUpdateServices,
      setIsCreateDialogOpen,
      setServiceToEdit,
    },
  });

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-left font-semibold text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  Không có dịch vụ trong trang này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Trước
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </>
  );
}
