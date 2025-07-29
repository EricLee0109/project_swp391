import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewCreatedCalendar } from "@/types/ViewCreatedCalendar/ViewCreatedCalendar";

let currentSearchQuery = "";

export function setSearchQueryForHighlight(query: string) {
  currentSearchQuery = query.trim().toLowerCase();
}

function highlight(text: string): string {
  if (!currentSearchQuery) return text;
  const regex = new RegExp(`(${currentSearchQuery})`, "gi");
  return text.replace(
    regex,
    `<span class="bg-yellow-200 font-semibold">$1</span>`
  );
}

export const columns = (): ColumnDef<ViewCreatedCalendar>[] => [
  {
    id: "stt",
    header: "STT",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { pageIndex: number; pageSize: number };
      const pageIndex = meta?.pageIndex ?? 0;
      const pageSize = meta?.pageSize ?? 10;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: "start_time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Bắt đầu <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = new Date(row.original.start_time).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return <div dangerouslySetInnerHTML={{ __html: highlight(value) }} />;
    },
  },
  {
    accessorKey: "end_time",
    header: "Kết thúc",
    cell: ({ row }) =>
      new Date(row.original.end_time).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  {
    accessorKey: "service.name",
    header: "Dịch vụ",
    cell: ({ row }) =>
      row.original.service?.name ? (
        <div dangerouslySetInnerHTML={{ __html: highlight(row.original.service.name) }} />
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "is_booked",
    header: "Trạng thái",
    cell: ({ row }) =>
      row.original.is_booked ? (
        <Badge className="text-red-600 bg-red-200 hover:bg-red-100">Đã đặt</Badge>
      ) : (
        <Badge className="text-green-600 bg-green-200 hover:bg-green-100">Còn trống</Badge>
      ),
  },
  {
    accessorKey: "max_appointments_per_day",
    header: "Tối đa/ngày",
    cell: ({ row }) => row.original.max_appointments_per_day,
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString("vi-VN"),
  },
  
];
