"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CircleCheckIcon } from "lucide-react";
import { ShippingStatusEnums } from "@/types/enums/HealthServiceEnums";
import { ShippingInfoType } from "@/types/ServiceType/ShippingType";
import { useState } from "react";
import { CreateShippingForm } from "@/components/dashboard/components/shipping/CreateShippingForm";

const getStatusBadgeVariant = (status: ShippingStatusEnums) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Shipped":
      return "bg-blue-100 text-blue-800";
    case "DeliveredToCustomer":
      return "bg-green-100 text-green-800";
    case "PickupRequested":
      return "bg-purple-100 text-purple-800";
    case "SampleInTransit":
      return "bg-orange-100 text-orange-800";
    case "SampleCollected":
      return "bg-teal-100 text-teal-800";
    case "ReturnedToLab":
      return "bg-gray-100 text-gray-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

function ActionCell({ row }: { row: Row<ShippingInfoType> }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const shipping = row.original;

  const handleCreateShipping = () => {
    setIsDialogOpen(true);
  };

  const handleFormSubmit = () => {
    console.log("Shipping form submitted successfully");
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCreateShipping}>
        <CircleCheckIcon className="h-4 w-4 mr-2" />
        Tạo đơn
      </Button>

      <CreateShippingForm
        appointment={shipping}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onFormSubmit={handleFormSubmit}
      />
    </div>
  );
}

export const columns: ColumnDef<ShippingInfoType>[] = [
  {
    accessorKey: "tracking_number",
    header: "Tracking #",
  },
  {
    accessorKey: "appointment_id",
    header: "Appointment ID",
  },
  {
    accessorKey: "user_name",
    header: "Client",
    cell: ({ row }) => <div>{row.original.user_name}</div>,
  },
  {
    accessorKey: "shipping_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.shipping_status;
      return <Badge className={getStatusBadgeVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => format(new Date(row.original.created_at), "dd MMM yyyy"),
  },
  {
    accessorKey: "shipping_address",
    header: "Address",
  },

  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
