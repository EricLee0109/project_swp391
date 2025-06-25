"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateShippingClient from "./CreateShippingClient";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";

// Assume you have a list of appointments being rendered
const YourAppointmentListComponent = ({
  appointments,
}: {
  appointments: AppointmentListType[];
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  const handleOpenDialog = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAppointmentId(null);
  };

  return (
    <div>
      {/* This is your list of appointments */}
      {appointments.map((app) => (
        <div
          key={app.appointment_id}
          className="flex items-center justify-between p-4 border-b"
        >
          <p>{app.user.full_name}</p>
          <Button onClick={() => handleOpenDialog(app.appointment_id)}>
            Create Shipping
          </Button>
        </div>
      ))}

      {/* The Dialog that contains your form component */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Create New Shipping</DialogTitle>
          </DialogHeader>
          {/* Conditionally render the client ONLY when an ID is selected.
            This ensures the component and its data fetching useEffect are
            mounted only when needed.
          */}
          {selectedAppointmentId && (
            <CreateShippingClient
              appointmentId={selectedAppointmentId}
              onClose={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YourAppointmentListComponent;
