import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { getStatusBadgeVariant, statusMap } from "./helpers";
import CellActions, { ShippingStatus } from "./CellActions";
import { useState, useEffect } from "react";

// Shipping Status Cell Component
function ShippingStatusCell({ appointmentId }: { appointmentId: string }) {
  const [shippingStatus, setShippingStatus] = useState<{
    outbound: ShippingStatus | null;
    return: ShippingStatus | null;
  }>({ outbound: null, return: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShippingStatus = async () => {
      try {
        const res = await fetch(`/api/shipping/appointments/${appointmentId}`, {
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setShippingStatus({
            outbound: data.outbound?.shipping_status || null,
            return: data.return?.shipping_status || null,
          });
        }
      } catch (error) {
        console.error("Error fetching shipping status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingStatus();
  }, [appointmentId]);

  const statusMap: Record<ShippingStatus, { label: string; color: string; icon: string }> = {
    Pending: { label: "Chưa tạo đơn GHN", color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
    Shipped: { label: "Đã gửi đơn GHN", color: "bg-blue-100 text-blue-800", icon: "🚚" },
    DeliveredToCustomer: { label: "Đã giao cho khách", color: "bg-green-100 text-green-800", icon: "✅" },
    PickupRequested: { label: "Yêu cầu trả mẫu", color: "bg-purple-100 text-purple-800", icon: "📦" },
    SampleInTransit: { label: "Mẫu đang gửi về lab", color: "bg-orange-100 text-orange-800", icon: "📤" },
    ReturnedToLab: { label: "Mẫu đã về lab", color: "bg-teal-100 text-teal-800", icon: "🏥" },
    Failed: { label: "Thất bại / hủy đơn", color: "bg-red-100 text-red-800", icon: "❌" },
  };

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        <span>Đang tải...</span>
      </div>
    );
  }

  if (!shippingStatus.outbound && !shippingStatus.return) {
    return (
      <div className="text-sm text-gray-500">
        <span>Chưa có đơn vận chuyển</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {shippingStatus.outbound && (
        <div className="flex items-center">
          <span className="text-xs text-gray-600 mr-2">Đi:</span>
          <Badge 
            className={`${statusMap[shippingStatus.outbound].color} text-xs px-2 py-1`}
            variant="secondary"
          >
            <span className="mr-1">{statusMap[shippingStatus.outbound].icon}</span>
            {statusMap[shippingStatus.outbound].label}
          </Badge>
        </div>
      )}
      {shippingStatus.return && (
        <div className="flex items-center">
          <span className="text-xs text-gray-600 mr-2">Về:</span>
          <Badge 
            className={`${statusMap[shippingStatus.return].color} text-xs px-2 py-1`}
            variant="secondary"
          >
            <span className="mr-1">{statusMap[shippingStatus.return].icon}</span>
            {statusMap[shippingStatus.return].label}
          </Badge>
        </div>
      )}
    </div>
  );
}

export function columns({
  onCreateShipping,
  onShippingUpdated,
}: {
  onCreateShipping: (id: string) => void;
  onShippingUpdated: () => void;
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
      cell: ({ row }) => format(new Date(row.original.start_time), "dd/MM/yyyy, HH:mm"),
    },
    {
      accessorKey: "type",
      header: "Loại hẹn",
      cell: () => (
        <Badge className="bg-green-100 text-green-800">
          Xét nghiệm
        </Badge>
      ),
      filterFn: (row, _id, filterValue) => {
        return row.original.type === "Testing" && (!filterValue || filterValue === "Testing");
      },
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
      id: "shipping_status",
      header: "Trạng thái vận chuyển",
      cell: ({ row }) => (
        <ShippingStatusCell appointmentId={row.original.appointment_id} />
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <CellActions
          appointment={row.original}
          onCreateShipping={onCreateShipping}
          onShippingUpdated={onShippingUpdated}
        />
      ),
    },
  ];
}