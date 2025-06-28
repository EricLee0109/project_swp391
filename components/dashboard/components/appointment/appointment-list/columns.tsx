import { CellActions } from "@/components/dashboard/components/appointment/appointment-list/CellActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusTypeEnums } from "@/types/enums/HealthServiceEnums";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Home, Hospital } from "lucide-react";

// 🔸 Lưu trữ query tìm kiếm để highlight
let currentSearchQuery = "";

export function setSearchQueryForHighlight(query: string) {
  currentSearchQuery = query.trim().toLowerCase();
}

function highlight(text: string): React.ReactNode {
  if (!currentSearchQuery) return text;
  const regex = new RegExp(`(${currentSearchQuery})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-yellow-200 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
}

// Helper function for status badges
const getStatusBadgeVariant = (status: StatusTypeEnums) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-200 text-green-500 hover:bg-green-500 hover:text-white";
    case "SampleCollected":
      return "bg-purple-200 text-purple-600 hover:bg-purple-600 hover:text-white";
    case "Completed":
      return "bg-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white";
    case "Cancelled":
      return "bg-red-200 text-red-600 hover:bg-red-600 hover:text-white";
    case "Pending":
      return "bg-yellow-200 text-yellow-700 hover:bg-yellow-400 hover:text-white";
    default:
      return "default";
  }
};

const getTypeBadgeVariant = (type: "Consultation" | "Testing") => {
  switch (type) {
    case "Consultation":
      return "bg-blue-100 text-blue-800 hover:bg-blue-500 hover:text-white";
    case "Testing":
      return "bg-orange-100 text-orange-800 hover:bg-orange-500 hover:text-white";
    default:
      return "default";
  }
};

export const columns: ColumnDef<AppointmentListType>[] = [
  {
    id: "stt",
    header: "STT",
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        pageIndex: number;
        pageSize: number;
      };
      const pageIndex = meta?.pageIndex ?? 0;
      const pageSize = meta?.pageSize ?? 10;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: "user.full_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Tên khách hàng
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{highlight(row.original.user.full_name)}</div>,
  },
  {
    accessorKey: "service.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Dịch vụ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{highlight(row.original.service.name)}</div>,
  },
  {
    accessorKey: "start_time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Thời gian cuộc hẹn
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      `${row.original.start_time.split("T")[0]} -  ${row.original.start_time
        .split("T")[1]
        .split("Z")[0]
        .slice(0, 5)}`,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Loại dịch vụ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <Badge className={getTypeBadgeVariant(row.original.type)}>
          {row.original.type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Trạng thái
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <Badge className={getStatusBadgeVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "mode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Tại...
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const mode = row.original.mode;
      return (
        <Badge
          className={
            mode === "AT_HOME"
              ? "bg-teal-100 text-teal-800 hover:bg-teal-500 hover:text-white"
              : "bg-indigo-100 text-indigo-800 hover:bg-indigo-500 hover:text-white"
          }
        >
          {mode === "AT_HOME" ? (
            <span className="flex flex-between gap-1">
              <Home size={12} />
              Nhà
            </span>
          ) : (
            <span className="flex flex-between gap-1">
              <Hospital size={12} />
              Phòng khám
            </span>
          )}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <CellActions row={row} />,
  },
];
