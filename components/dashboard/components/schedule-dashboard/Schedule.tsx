"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PaymentActionsDropdown } from "./action/PaymentActionsDropdown";

interface Schedule {
  schedule_id: string;
  start_time: string;
  end_time: string;
  service_id: string;
  created_at: string;
  updated_at: string;
}

const sampleSchedules: Schedule[] = [
  {
    schedule_id: "1",
    start_time: "2025-06-22T08:00:00.000Z",
    end_time: "2025-06-22T09:00:00.000Z",
    service_id: "svc001",
    created_at: "2025-06-20T10:00:00.000Z",
    updated_at: "2025-06-20T12:00:00.000Z",
  },
  {
    schedule_id: "2",
    start_time: "2025-06-23T10:00:00.000Z",
    end_time: "2025-06-23T11:00:00.000Z",
    service_id: "svc002",
    created_at: "2025-06-20T11:00:00.000Z",
    updated_at: "2025-06-20T13:00:00.000Z",
  },
];

export default function DashboardSchedules() {
  const [schedules, setSchedules] = useState<Schedule[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSchedules(sampleSchedules);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div >
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {`Hôm nay: ${format(new Date(), "EEEE, dd/MM/yyyy")}`}
            <span className="text-sm text-muted-foreground ml-2">
              {schedules ? `${schedules.length} lịch trống` : "Đang tải..."}
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

          {!loading && schedules?.length === 0 && (
            <p className="text-muted-foreground">Không có lịch trống nào.</p>
          )}

          {!loading &&
            schedules?.map((schedule) => (
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
                    Dịch vụ: <Badge>{schedule.service_id}</Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-zinc-500">
                    Cập nhật:{" "}
                    {format(new Date(schedule.updated_at), "dd/MM/yyyy")}
                  </div>
                
                    <PaymentActionsDropdown scheduleId={schedule.schedule_id} />
                 
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
