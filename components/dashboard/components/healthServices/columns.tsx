"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ServicesListType } from "@/types/ServiceType/StaffRoleType";
import { Home, Hospital, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
import { notify } from "@/lib/toastNotify";

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
    header: "Tên dịch vụ",
    cell: ({ row }) => <div>{row.original.name || "Không có"}</div>,
  },
  {
    accessorKey: "description",
    header: "Mô tả dịch vụ",
    cell: ({ row }) => <div>{row.original.description || "Không có"}</div>,
  },
  {
    accessorKey: "price",
    header: "Giá dịch vụ",
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
    header: "Danh mục dịch vụ",
    cell: ({ row }) => <div>{row.original.category || "Không có"}</div>,
  },
  {
    accessorKey: "type",
    header: "Loại dịch vụ",
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
    header: "Số lượng tối đa mỗi ngày",
    cell: ({ row }) => <div>{row.original.daily_capacity ?? "Không có"}</div>,
  },
  {
    accessorKey: "available_modes",
    header: "Hình thức dịch vụ",
    size: 250,
    cell: ({ row }) => {
      const available_modes = Array.isArray(row.original.available_modes)
        ? row.original.available_modes
        : [];
      const hasHomeMode = available_modes.includes("AT_HOME");
      const hasClinicMode = available_modes.includes("AT_CLINIC");
      return (
        <div className="inline-flex gap-1 flex-nowrap items-center">
          {hasHomeMode && (
            <span className="flex items-center gap-1 px-1 py-0.5 bg-blue-100 rounded text-xs whitespace-nowrap">
              <Home size={12} /> Tại nhà
            </span>
          )}
          {hasClinicMode && (
            <span className="flex items-center gap-1 px-1 py-0.5 bg-blue-100 rounded text-xs whitespace-nowrap">
              <Hospital size={12} /> Tại phòng khám
            </span>
          )}
          {!hasHomeMode && !hasClinicMode && <span>Không có</span>}
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
              notify("success","Dịch vụ đã được xóa thành công!");
              const updated = table.options.data.filter(
                (s) => s.service_id !== service.service_id
              );
              meta?.onUpdateServices?.(updated);
            } else {
              // const errorData = await res.json();
              notify("error", "Không thể xóa dịch vụ.");
            }
          } catch {
            notify("error","Lỗi mạng. Vui lòng thử lại.");
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