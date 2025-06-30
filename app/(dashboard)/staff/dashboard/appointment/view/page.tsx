"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/dashboard/components/appointment/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";
import { notify } from "@/lib/toastNotify";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AppointmentListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if session is loaded and user is authenticated
    if (status === "authenticated" && session?.accessToken) {
      async function fetchAppointments() {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
          // Send the access token in the Authorization header
          const res = await fetch("/api/appointments", {
            method: "GET", // Specify method for clarity
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.accessToken}`,
            },
            // You typically don't need credentials: "include" for your own API routes when using Authorization header
            // credentials: "include", // Can remove if not needed for other reasons
          });

          console.log(session?.accessToken, "res");
          const apiRes = await res.json();

          if (res.ok) {
            setAppointments(apiRes.appointments || apiRes.data || []);
          } else {
            setError(apiRes?.error || "Không thể tải danh sách cuộc hẹn.");
            notify(
              "error",
              apiRes?.error || "Không thể tải danh sách cuộc hẹn."
            );
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setError("Lỗi mạng. Vui lòng thử lại.");
          notify("error", "Lỗi mạng. Vui lòng thử lại.");
        } finally {
          setLoading(false);
        }
      }
      fetchAppointments();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("Bạn chưa đăng nhập hoặc phiên đã hết hạn.");
      notify("error", "Bạn chưa đăng nhập hoặc phiên đã hết hạn.");
      router.push("/login");
      // Optionally redirect to login page
      // router.push("/login");
    }
    // No need to fetch if status is "loading" - wait for it to be authenticated or unauthenticated
  }, [status, session?.accessToken, router]);

  // Callback xoá appointment khỏi state
  const handleDeleted = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.appointment_id !== id));
  };

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
              Được giám sát bởi - Quản trị viên
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Các cuộc hẹn</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns({ onDeleted: handleDeleted })}
                data={appointments}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
