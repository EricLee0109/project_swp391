"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dashboard/components/appointment/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";
import { notify } from "@/lib/toastNotify";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";

export default function AppointmentListPage() {
  const [appointments, setAppointments] = useState<AppointmentListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/appointments", {
          credentials: "include",
        });
        const apiRes = await res.json();
        if (res.ok) {
          setAppointments(apiRes.appointments || apiRes.data || []);
        } else {
          setError(apiRes?.error || "Không thể tải danh sách cuộc hẹn.");
          notify("error", apiRes?.error || "Không thể tải danh sách cuộc hẹn.");
        }
      } catch {
        setError("Lỗi mạng. Vui lòng thử lại.");
        notify("error", "Lỗi mạng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  // Loading state (có thể custom skeleton)
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

  // Error state
  if (error) {
    return (
      <div className="py-5">
        <Card className="p-6">
          <p className="text-center text-destructive">{error}</p>
        </Card>
      </div>
    );
  }

  // Lấy user fullName nếu muốn (bằng context hoặc prop, tuỳ project)
  const fullName = ""; // TODO: Lấy fullName nếu cần

  return (
    <div>
      <Header
        title="Quản lý cuộc hẹn"
        href="/dashboard/appointment/view"
        currentPage="Theo dõi cuộc hẹn"
      />
      <div className="container mx-auto p-6">
        <div className="ml-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Theo dõi cuộc hẹn
            </h1>
            <p className="text-muted-foreground">
              Được giám sát bởi - {fullName || "Quản trị viên"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Các cuộc hẹn</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={appointments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
