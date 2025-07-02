"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dashboard/components/shipping/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";
import { notify } from "@/lib/toastNotify";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";

export default function ShippingTrackingPage() {
  const [appointments, setAppointments] = useState<AppointmentListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateFlag, setUpdateFlag] = useState(0);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/appointments", {
        credentials: "include",
        cache: "no-store",
      });
      const apiRes = await res.json();
      if (res.ok) {
        setAppointments(apiRes.appointments || apiRes.data || []);
        setError(null);
      } else {
        setError(apiRes?.error || "Không thể tải danh sách cuộc hẹn.");
        notify("error", apiRes?.error || "Không thể tải danh sách cuộc hẹn.");
      }
    } catch {
      notify("error", "Lỗi mạng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments, updateFlag]);

  async function handleCreateShipping(appointmentId: string) {
    try {
      const res = await fetch(`/api/shipping/appointments/${appointmentId}`, {
        credentials: "include",
      });
      const apiRes = await res.json();
      if (res.ok) {
        notify("success", "Lấy thông tin vận chuyển thành công.");
      } else {
        notify("error", apiRes?.error || "Không thể lấy thông tin vận chuyển.");
      }
    } catch {
      notify("error", "Lỗi mạng. Vui lòng thử lại.");
    }
  }

  const handleShippingUpdated = () => {
    setUpdateFlag((prev) => prev + 1);
  };

  const cols = columns({
    onCreateShipping: handleCreateShipping,
    onShippingUpdated: handleShippingUpdated,
  });

  if (loading) {
    return (
      <div className="py-5">
        <Card className="p-6">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-5">
        <Card className="p-6">
          <p className="text-center text-destructive">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Quản lý đơn vận chuyển"
        href="/dashboard/shipping/view"
        currentPage="Theo dõi đơn vận chuyển"
      />
      <div className="container mx-auto p-6">
        <div className="ml-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Theo dõi đơn vận chuyển</h1>
            <p className="text-muted-foreground">Được giám sát bởi - Quản trị viên</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Các cuộc hẹn liên quan</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={cols} data={appointments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
