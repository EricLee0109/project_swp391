import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notify } from "@/lib/toastNotify";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { Row } from "@tanstack/react-table";
import { CheckCircle, MoreHorizontal, TestTube2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CellActions = ({ row }: { row: Row<AppointmentListType> }) => {
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

      notify("success", "Appointment verified successfully!");
      router.refresh();
    } catch (error) {
      console.error("Verification failed:", error);
      notify("error", (error as Error).message);
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
        <DropdownMenuContent align="end" className="bg-white">
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
