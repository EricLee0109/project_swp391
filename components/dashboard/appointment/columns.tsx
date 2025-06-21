"use client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { CheckCircle, MoreHorizontal, TestTube2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Adjust this import path to where you have defined your types
import { StatusTypeEnums } from "@/types/enums/HealthServiceEnums";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { useRouter } from "next/navigation";
import { Dialog } from "@radix-ui/react-dialog";
import { useState } from "react";
import Link from "next/link";

// Helper function for status badges
const getStatusBadgeVariant = (status: StatusTypeEnums) => {
  switch (status) {
    case "Confirmed":
      return "default";
    case "SampleCollected":
      return "secondary";
    case "Completed":
      return "secondary";
    case "Cancelled":
      return "destructive";
    case "Pending":
      return "outline";
    default:
      return "default";
  }
};

const getTypeBadgeVariant = (type: "Consultation" | "Testing") => {
  switch (type) {
    case "Consultation":
      return "bg-blue-100 text-blue-800";
    case "Testing":
      return "bg-green-100 text-green-800";
    default:
      return "default";
  }
};

const CellActions = ({ row }: { row: Row<AppointmentListType> }) => {
  const appointment = row.original;
  const router = useRouter();

  // State to control shipping dialog
  const [isShippingDialogOpen, setShippingDialogOpen] = useState(false);

  const handleVerifyAppointment = async () => {
    if (!confirm("Are you sure you want to verify this appointment?")) {
      return;
    }

    try {
      // TODO: Replace this URL with your actual API endpoint.
      const response = await fetch(
        `/api/appointments/${appointment.appointment_id}/confirm`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: "Xác nhận lịch hẹn xét nghiệm" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to verify the appointment."
        );
      }

      alert("Appointment verified successfully!");
      router.refresh();
    } catch (error) {
      console.error("Verification failed:", error);
      alert((error as Error).message);
    }
  };

  return (
    <Dialog open={isShippingDialogOpen} onOpenChange={setShippingDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* --- "Create Shipping" OPTION --- */}
          {appointment.type === "Testing" &&
            appointment.status === "Pending" && (
              <Link
                href={`/dashboard/shipping/create/${appointment.appointment_id}`}
                passHref
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <TestTube2 className="mr-2 h-4 w-4" />
                  <span>Create Shipping</span>
                </DropdownMenuItem>
              </Link>
            )}
          {/* Consultation confirm */}
          {appointment.type === "Consultation" &&
            appointment.status === "Pending" && (
              <DropdownMenuItem
                className="text-green-600 focus:text-green-700 focus:bg-green-50"
                onSelect={(e) => {
                  e.preventDefault();
                  handleVerifyAppointment();
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Verify Appointment</span>
              </DropdownMenuItem>
            )}

          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(appointment.appointment_id)
            }
          >
            Copy Appointment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View Client Details</DropdownMenuItem>
          <DropdownMenuItem>View Appointment Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* {/* The Dialog Content */}
      {/* <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Shipping Info</DialogTitle>
          <p className="text-sm text-muted-foreground">
            For Appointment ID: {appointment.appointment_id}
          </p>
        </DialogHeader>
        <div className="py-4">
          <CreateShippingForm
            appointmentId={appointment.appointment_id}
            onFormSubmit={() => setShippingDialogOpen(false)}
          />
        </div>
      </DialogContent> */}
    </Dialog>
  );
};
// 2. The exported columns definition is now cleaner
export const columns: ColumnDef<AppointmentListType>[] = [
  {
    accessorKey: "user.full_name",
    header: "Client Name",
    cell: ({ row }) => <div>{row.original.user.full_name}</div>,
  },
  {
    accessorKey: "service.name",
    header: "Service",
  },
  {
    accessorKey: "start_time",
    header: "Appointment Time",
    cell: ({ row }) =>
      format(new Date(row.original.start_time), "dd/MM/yyyy, hh:mm a"),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return <Badge className={getTypeBadgeVariant(type)}>{type}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "mode",
    header: "Mode",
    cell: ({ row }) => {
      const mode = row.original.mode;
      return (
        <Badge variant={mode === "AT_HOME" ? "default" : "secondary"}>
          {mode}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    // 3. The cell now just renders our new CellActions component
    cell: ({ row }) => <CellActions row={row} />,
  },
];
