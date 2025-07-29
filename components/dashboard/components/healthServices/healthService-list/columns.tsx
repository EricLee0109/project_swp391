"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ServicesListType } from "@/types/ServiceType/StaffRoleType";
import { Home, Hospital, Trash2, Edit, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
import { notify } from "@/lib/toastNotify";

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

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "Consultation":
      return "bg-blue-100 text-blue-800";
    case "Testing":
      return "bg-green-100 text-green-800";
    default:
      return "default";
  }
};

export const columns: ColumnDef<ServicesListType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Tên dịch vụ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{highlight(row.original.name)}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Mô tả dịch vụ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.description || "Không có"}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Giá dịch vụ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {row.original.price
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(parseInt(row.original.price, 10))
          : "Không có"}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Danh mục dịch vụ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{highlight(row.original.category) || "Không có"}</div>
    ),
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
      const type = row.original.type || "Không xác định";
      return (
        <Badge className={getTypeBadgeVariant(type)}>
          {type === "Consultation"
            ? "Tư vấn"
            : type === "Testing"
            ? "Xét nghiệm"
            : type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "daily_capacity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Số lượng tối đa mỗi ngày
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.daily_capacity ?? "Không có"}</div>,
  },
  {
    accessorKey: "available_modes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Hình thức dịch vụ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 250,
    cell: ({ row }) => {
      const available_modes = Array.isArray(row.original.available_modes)
        ? row.original.available_modes
        : [];
      const hasHomeMode = available_modes.includes("AT_HOME");
      const hasClinicMode = available_modes.includes("AT_CLINIC");
      const hasOnlineMode = available_modes.includes("ONLINE");
      return (
        <div className="inline-flex gap-1 flex-nowrap items-center">
          {hasHomeMode && (
            // <span className="flex items-center gap-1 px-1 py-0.5 bg-blue-100 rounded text-xs whitespace-nowrap">
            //   <Home size={12} /> Tại nhà
            // </span>

            <div className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2 py-1 rounded-full text-xs">
              <Home size={14} />
              <span>Tại nhà</span>
            </div>
          )}
          {hasClinicMode && (
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
              <Hospital size={14} />
              <span>Tại phòng khám</span>
            </div>
          )}
          {hasOnlineMode && (
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
              <Hospital size={14} />
              <span>Trực tuyến</span>
            </div>
          )}
          {!hasHomeMode && !hasClinicMode && !hasOnlineMode &&<span>Không có</span>}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row, table }) => {
      const service = row.original;
      const meta = table.options.meta as {
        setIsCreateDialogOpen: (open: boolean) => void;
        setServiceToEdit: (service: ServicesListType) => void;
        onUpdateServices: (services: ServicesListType[]) => void;
      };

      const handleDelete = async () => {
        if (confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
          try {
            const res = await fetch(`/api/services/${service.service_id}`, {
              method: "DELETE",
              credentials: "include",
            });
            if (res.ok) {
              notify("success", "Dịch vụ đã được xóa thành công!");
              const updated = table.options.data.filter(
                (s) => s.service_id !== service.service_id
              );
              meta?.onUpdateServices?.(updated);
            } else {
              notify("error", "Không thể xóa dịch vụ.");
            }
          } catch {
            notify("error", "Lỗi mạng. Vui lòng thử lại.");
          }
        }
      };

      const handleEdit = () => {
        meta?.setServiceToEdit(service);
        meta?.setIsCreateDialogOpen(true);
      };

      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
