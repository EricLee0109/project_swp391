"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Home, Hospital, MapPin } from "lucide-react";
import { formatDateVN } from "@/lib/utils";

interface ApiAppointment {
  appointment_id: string;
  type: "Consultation" | "Testing";
  start_time: string;
  end_time: string;
  status: "Pending" | "Completed" | "Confirmed" | "SampleCollected" | "Cancelled";
  payment_status: "Paid" | "Pending" | "Failed";
  location: string | null;
  mode: "AT_HOME" | "AT_CLINIC";
  service: {
    service_id: string;
    name: string;
    category: string;
  };
  consultant_name: string | null;
  test_code: string | null;
  test_result_status: string | null;
  is_abnormal: boolean;
  shipping_info: {
    contact_name: string;
    contact_phone: string;
    shipping_address: string;
    province: string;
    district: string;
    ward: string;
  } | null;
  payments: {
    amount: string;
    payment_method: string;
    status: "Completed" | "Pending";
    created_at: string;
  }[];
}

export default function OrderHistory() {
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Số lịch hẹn mỗi trang

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/appointments/my-appointments", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setAppointments(data.appointments || []);
        } else {
          setError(data?.error || "Không thể tải lịch sử đặt hẹn.");
        }
      } catch (err) {
        console.error("Lỗi mạng khi tải lịch sử:", err);
        setError("Lỗi mạng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  // Tính toán phân trang
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="py-5">
        <Card className="p-6">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
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
    <div className="py-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Lịch sử đặt hẹn</CardTitle>
          <p className="text-sm text-muted-foreground">Danh sách các lịch hẹn của bạn</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {paginatedAppointments.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có lịch hẹn nào.</p>
          ) : (
            paginatedAppointments.map((appt) => (
              <div
                key={appt.appointment_id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Info label="Mã hẹn" value={appt.test_code || appt.appointment_id} />
                    <Info label="Dịch vụ" value={appt.service.name} />
                    <Info
                      label="Ngày hẹn"
                      value={formatDateVN(appt.start_time)}
                      icon={<CalendarIcon className="w-4 h-4 text-muted-foreground" />}
                    />
                    <Info
                      label="Thời gian"
                      value={`${new Date(appt.start_time).toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" })} - ${new Date(appt.end_time).toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" })}`}
                    />
                    {appt.shipping_info && (
                      <Info
                        label="Địa chỉ giao hàng"
                        value={`${appt.shipping_info.shipping_address}, ${appt.shipping_info.ward}, ${appt.shipping_info.district}, ${appt.shipping_info.province}`}
                        icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
                      />
                    )}
                  </div>
                  <div>
                    <Info
                      label="Hình thức"
                      value={appt.mode === "AT_HOME" ? "Tại nhà" : "Tại phòng khám"}
                      icon={
                        appt.mode === "AT_HOME" ? (
                          <Home className="w-4 h-4 text-teal-600" />
                        ) : (
                          <Hospital className="w-4 h-4 text-indigo-600" />
                        )
                      }
                    />
                    <Info
                      label="Trạng thái"
                      value={
                        appt.status === "Pending"
                          ? "Đang chờ"
                          : appt.status === "Completed"
                          ? "Hoàn thành"
                          : appt.status === "Confirmed"
                          ? "Đã xác nhận"
                          : appt.status === "SampleCollected"
                          ? "Đã lấy mẫu"
                          : "Đã hủy"
                      }
                    />
                    <Info
                      label="Thanh toán"
                      value={
                        appt.payment_status === "Pending"
                          ? "Chưa thanh toán"
                          : appt.payment_status === "Paid"
                          ? "Đã thanh toán"
                          : "Thất bại"
                      }
                    />
                    {appt.consultant_name && (
                      <Info label="Bác sĩ tư vấn" value={appt.consultant_name} />
                    )}
                    {appt.test_result_status && (
                      <Info
                        label="Kết quả xét nghiệm"
                        value={
                          appt.test_result_status === "Pending"
                            ? "Đang chờ"
                            : appt.test_result_status === "Completed"
                            ? "Hoàn thành"
                            : appt.test_result_status
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Trước
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium flex items-center gap-1">
        {value} {icon}
      </p>
    </div>
  );
}
