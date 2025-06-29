import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import CellActions from "./CellActions";

export function columns({ onCreateShipping }: { onCreateShipping: (id: string) => void }): ColumnDef<AppointmentListType>[] {
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
      cell: ({ row }) => new Date(row.original.start_time).toLocaleString(),
    },
    {
      accessorKey: "type",
      header: "Loại hẹn",
      cell: ({ row }) => (
        <Badge className={row.original.type === "Testing" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
          {row.original.type === "Testing" ? "Xét nghiệm" : "Tư vấn"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "Pending" ? "outline" : "default"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => <CellActions appointment={row.original} onCreateShipping={onCreateShipping} />,
    },
  ];
}