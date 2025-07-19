"use client";

import { BookingModal } from "@/components/healthServices/BookingModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  CustomService,
  Consultant,
  Schedule,
} from "@/types/ServiceType/CustomServiceType";

interface BookingTriggerProps {
  service: CustomService;
  consultants: Consultant[];
  schedules: Schedule[];
}

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
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 hover:text-red-100 transition-colors duration-300 shadow-lg"
        suppressHydrationWarning
      >
        Đặt lịch hẹn
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
