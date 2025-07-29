"use client";

import { BookingModal } from "@/components/healthServices/BookingModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  CustomService,
  Consultant,
  Schedule,
} from "@/types/ServiceType/CustomServiceType";
import { notify } from "@/lib/toastNotify";

interface BookingTriggerProps {
  accessToken?: string | null;
  service: CustomService;
  consultants: Consultant[];
  schedules: Schedule[];
}

export function BookingTrigger({
  accessToken,
  service,
  consultants,
  schedules,
}: BookingTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleBooking = () => {
    if (!accessToken) {
      notify("error", "Vui lòng đăng nhập để đặt lịch hẹn.");
      return;
    } else {
      setIsModalOpen(true);
    }
  };
  return (
    <>
      <Button
        onClick={handleBooking}
        className="w-full bg-primary text-white font-bold rounded-sm hover:bg-primary-100 hover:text-primary-500 transition-colors duration-300 shadow-lg"
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
