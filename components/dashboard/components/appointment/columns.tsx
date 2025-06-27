import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { getStatusBadgeVariant, getTypeBadgeVariant, statusMap } from "./helpers";
import CellActions from "./CellActions";

export const columns: ColumnDef<AppointmentListType>[] = [
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
    cell: ({ row }) => format(new Date(row.original.start_time), "dd/MM/yyyy, HH:mm"),
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
    header: "Trạng thái",
    cell: ({ row }) => (
      <Badge variant={getStatusBadgeVariant(row.original.status)}>
        {statusMap[row.original.status]}
      </Badge>
    ),
  },
  {
    accessorKey: "mode",
    header: "Hình thức",
    cell: ({ row }) => (
      <Badge variant={row.original.mode === "AT_HOME" ? "default" : "secondary"}>
        {row.original.mode === "AT_HOME" ? "Tại nhà" : "Tại phòng khám"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <CellActions appointment={row.original} />,
  },
];
