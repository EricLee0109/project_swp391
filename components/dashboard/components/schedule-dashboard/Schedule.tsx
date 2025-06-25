"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PaymentActionsDropdown } from "./action/PaymentActionsDropdown";

interface Service {
  service_id: string;
  name: string;
}

interface ScheduleItem {
  schedule_id: string;
  start_time: string;
  end_time: string;
  service_id: string;
  created_at: string;
  updated_at: string;
  is_booked: boolean;
  service?: Service;
}

interface ScheduleProps {
  serverTime: string;
  serverAccessToken?: string;
  reloadFlag?: number;
  selectedDate: Date;
}

export default function Schedule({
  serverAccessToken,
  reloadFlag,
  selectedDate,
}: ScheduleProps) {
  const [schedules, setSchedules] = useState<ScheduleItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      if (!serverAccessToken) throw new Error("No access token found");

      const [schedulesRes, servicesRes] = await Promise.all([
        fetch("/api/schedules", {
          headers: {
            Authorization: `Bearer ${serverAccessToken}`,
          },
        }),
        fetch("/api/services"),
      ]);

      if (!schedulesRes.ok) {
        const errorData = await schedulesRes.json();
        throw new Error(errorData.message || "Failed to fetch schedules");
      }
      if (!servicesRes.ok) {
        const errorData = await servicesRes.json();
        throw new Error(errorData.message || "Failed to fetch services");
      }

      const schedulesData: ScheduleItem[] = await schedulesRes.json();
      const servicesData: Service[] = await servicesRes.json();

      const schedulesWithServiceName = schedulesData.map((schedule) => ({
        ...schedule,
        service: servicesData.find(
          (service) => service.service_id === schedule.service_id
        ) || { service_id: schedule.service_id, name: "Unknown Service" },
      }));

      setSchedules(schedulesWithServiceName);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error instanceof Error) {
        setError(error.message || "Error fetching data");
      } else {
        setError("Unknown error occurred");
      }
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverAccessToken, reloadFlag]);

  // useEffect(() => {
  //   setLoading(true);
  //   fetchSchedules();
  // }, [serverAccessToken, reloadFlag]);

  function isSameDay(dateStr: string, day: Date) {
    const date = new Date(dateStr);
    return (
      date.getFullYear() === day.getFullYear() &&
      date.getMonth() === day.getMonth() &&
      date.getDate() === day.getDate()
    );
  }

  const filteredSchedules =
    schedules?.filter((schedule) =>
      isSameDay(schedule.start_time, selectedDate)
    ) ?? [];

  const handleDeleted = () => {
    setLoading(true); // Show loading while re-fetching
    fetchSchedules();
  };

  const handleUpdated = () => {
    setLoading(true); // Show loading while re-fetching
    fetchSchedules();
  };

  return (
    <div>
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Lịch
            <span className="text-sm text-muted-foreground ml-2">
              {error
                ? error
                : schedules
                ? `${filteredSchedules.length} lịch`
                : "Đang tải..."}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          )}

          {!loading && filteredSchedules.length === 0 && !error && (
            <p className="text-muted-foreground">
              Không có lịch nào trong ngày này.
            </p>
          )}

          {!loading &&
            filteredSchedules.map((schedule) => (
              <div
                key={schedule.schedule_id}
                className="border p-4 rounded-xl shadow-sm flex justify-between items-start"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-base">
                    {format(new Date(schedule.start_time), "dd/MM/yyyy HH:mm")}{" "}
                    → {format(new Date(schedule.end_time), "HH:mm")}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Dịch vụ:{" "}
                    <Badge>{schedule.service?.name || "Unknown Service"}</Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm text-muted-foreground">
                    Trạng thái:{" "}
                    <Badge
                      variant={schedule.is_booked ? "destructive" : "secondary"}
                    >
                      {schedule.is_booked ? "Đã đặt" : "Còn trống"}
                    </Badge>
                  </div>
                  <PaymentActionsDropdown
                    scheduleId={schedule.schedule_id}
                    onDeleted={handleDeleted}
                    onUpdated={handleUpdated}
                    serverAccessToken={serverAccessToken}
                  />
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
