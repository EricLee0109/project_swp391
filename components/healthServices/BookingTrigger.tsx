"use client";

import { BookingModal } from "@/components/healthServices/BookingModal";
import { Button } from "@/components/ui/button";
import {
  Consultant,
  Schedule,
  Service,
} from "@/types/ServiceType/HealthServiceType";
import { useState } from "react";

// Props definition for the client component
interface BookingTriggerProps {
  service: Service;
  consultants: Consultant[];
  schedules: Schedule[];
}

// This is the client component wrapper
export function BookingTrigger({
  service,
  consultants,
  schedules,
}: BookingTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-300 shadow-lg"
      >
        Book Appointment
      </Button>
      {isModalOpen && (
        <BookingModal
          service={service}
          consultants={consultants}
          schedules={schedules}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
