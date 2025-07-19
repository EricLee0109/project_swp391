import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import {
  getResultStatusBadgeColors,
  getStatusPaymentBadgeColors,
  getTypeBadgeVariant,
  statusMap,
  statusPaymentMap,
} from "./helpers";
import CellActions from "./CellActions";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Home, Hospital } from "lucide-react";
import { cn } from "@/lib/utils";

// Định nghĩa function columns nhận props
export function columns({
  onDeleted,
  onUpdated,
}: {
  onDeleted: (id: string) => void;
  onUpdated: (appointment: AppointmentListType) => void;
}): ColumnDef<AppointmentListType>[] {
  return [
    {
      accessorKey: "user.full_name",
      header: "Tên khách hàng",
    },
    {
      accessorKey: "service.name",
      header: "Dịch vụ",
    },
    {
      accessorKey: "start_time",
      header: "Thời gian hẹn",
      cell: ({ row }) =>
        format(new Date(row.original.start_time), "dd/MM/yyyy, HH:mm"),
    },
    {
      accessorKey: "type",
      header: "Loại hẹn",
      cell: ({ row }) => (
        <Badge className={getTypeBadgeVariant(row.original.type)}>
          {row.original.type === "Consultation" ? "Tư vấn" : "Xét nghiệm"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent"
          >
            Trạng thái
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const labelA = statusMap[rowA.original.status] || "";
        const labelB = statusMap[rowB.original.status] || "";
        return labelA.localeCompare(labelB, "vi");
      },
      cell: ({ row }) => (
        <Badge className={getResultStatusBadgeColors(row.original.status)}>
          {statusMap[row.original.status]}
        </Badge>
      ),
    },
    {
      accessorKey: "payment_status",
      header: "Thanh toán",
      cell: ({ row }) => (
        <Badge
          className={getStatusPaymentBadgeColors(row.original.payment_status)}
        >
          {statusPaymentMap[row.original.payment_status]}
        </Badge>
      ),
    },
    {
      accessorKey: "mode",
      header: "Hình thức",
      cell: ({ row }) => (
        <>
          <Badge
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
              row.original.mode.includes("AT_HOME")
                ? "bg-teal-50 text-teal-700 hover:bg-teal-100 hover:text-teal-800"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
            )}
          >
            {row.original.mode.includes("AT_HOME") ? (
              <>
                <Home size={14} />
                <span>Tại nhà</span>
              </>
            ) : (
              <>
                <Hospital size={14} />
                <span>Tại phòng khám</span>
              </>
            )}
          </Badge>
        </>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <CellActions
          appointment={row.original}
          onDeleted={onDeleted}
          onUpdated={onUpdated}
        />
      ),
    },
  ];
}
