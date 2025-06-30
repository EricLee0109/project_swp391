"use client";
import React, { useState, useCallback } from "react";
import CreateSchedule from "@/components/dashboard/components/schedule-dashboard/CreateSchedule";
import Schedule from "@/components/dashboard/components/schedule-dashboard/Schedule";
import CalendarPicker from "@/components/dashboard/components/schedule-dashboard/Calendar";
import Header from "@/components/dashboard/header";

interface SchuldesPageClientProps {
  accessToken: string;
  serverTime: string;
}

export default function SchuldesPageClient({ accessToken, serverTime }: SchuldesPageClientProps) {
  const [reloadFlag, setReloadFlag] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleScheduleCreated = useCallback(() => {
    setReloadFlag((v) => v + 1);
  }, []);

  return (
    <div>
      <Header title="Đặt lịch" href="/dashboard/schedule" currentPage="Đặt lịch tư vấn có khách hàng" />
      <div className="container mx-auto p-6">
        <div className="flex justify-end">
          <CreateSchedule serverAccessToken={accessToken} onScheduleCreated={handleScheduleCreated} />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Schedule
              serverTime={serverTime}
              serverAccessToken={accessToken}
              reloadFlag={reloadFlag}
              selectedDate={selectedDate}
            />
          </div>
          <div className="w-full md:w-[300px] shrink-0">
            <CalendarPicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
}
