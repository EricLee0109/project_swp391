"use client";

import React, { useState, useEffect } from "react";
// Adjust import
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { CreateShippingForm } from "@/components/dashboard/shipping/CreateShippingForm";

interface CreateShippingPageProps {
  appointmentId: string;
  onClose: () => void; // Receives a function to close the dialog
}

// This is a placeholder for a client-side fetch function
async function getAppointmentDetailsOnClient(
  id: string
): Promise<AppointmentListType | null> {
  // In a real app, this would be: await fetch(`/api/appointments/${id}`)
  // For now, we simulate it.
  const allAppointments: AppointmentListType[] = [
    // ... Paste your mock appointment data here ...
  ];
  const appointment = allAppointments.find((app) => app.appointment_id === id);
  return appointment || null;
}

export default function CreateShippingClient({
  appointmentId,
  onClose,
}: CreateShippingPageProps) {
  const [appointment, setAppointment] = useState<AppointmentListType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getAppointmentDetailsOnClient(appointmentId);
      setAppointment(data);
      setIsLoading(false);
    }
    fetchData();
  }, [appointmentId]);

  return (
    <div className="py-4 ml-4 mr-4 mx-auto max-w-2xl">
      {isLoading ? (
        // Show a loading skeleton while fetching client name
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      ) : (
        // Display the fetched data
        <div className="mb-6">
          <p className="text-sm font-semibold">
            Client Name:{" "}
            <span className="font-normal">
              {appointment?.user.full_name ?? "N/A"}
            </span>
          </p>
          <p className="text-sm font-semibold">
            Appointment ID:{" "}
            <span className="font-normal">{appointment?.appointment_id}</span>
          </p>
        </div>
      )}

      {/* Render the form, passing the onClose function down to it */}
      <CreateShippingForm
        appointmentId={appointmentId}
        onFormSubmit={onClose} // When the form submits successfully, it will call the onClose function
      />
    </div>
  );
}
