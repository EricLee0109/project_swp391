"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Home, Hospital, MapPin } from "lucide-react";
import { formatDateVN } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { shippingStatusMap, paymentStatusMap } from "./helper";

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
    id: string;
    appointment_id: string;
    provider: string;
    provider_order_code?: string | null;
    shipping_status: string;
    contact_name: string;
    contact_phone: string;
    shipping_address: string;
    province: string;
    district: string;
    ward: string;
    expected_delivery_time?: string | null;
    label_url?: string | null;
    created_at: string;
    updated_at?: string | null;
  } | null;
  payments: {
    amount: string;
    payment_method: string;
    status: "Completed" | "Pending" | "Cancelled";
    created_at: string;
  }[];
}

export default function OrderHistory() {
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // số lịch hẹn trên 1 trang
  const [requestLoading, setRequestLoading] = useState<string | null>(null); // appointmentId đang gửi request
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/appointments/my-appointments", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setAppointments(data.appointments || []);
          setError(null);
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

  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setRequestSuccess(null);
    }
  };

  // Gọi API tạo yêu cầu trả mẫu
  async function requestReturnSample(appointmentId: string) {
    setRequestLoading(appointmentId);
    setRequestSuccess(null);
    try {
      const res = await fetch(`/api/shipping/appointments/${appointmentId}/return-request`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setRequestSuccess(appointmentId);
        alert("Yêu cầu trả mẫu đã được gửi thành công.");
        // Có thể reload data hoặc cập nhật trạng thái ở đây nếu cần
      } else {
        alert(data.error || "Gửi yêu cầu thất bại.");
      }
    } catch {
      alert("Lỗi mạng, vui lòng thử lại.");
    } finally {
      setRequestLoading(null);
    }
  }

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
            paginatedAppointments.map((appt) => {
              // Điều kiện hiển thị nút yêu cầu trả mẫu
              const canRequestReturn =
                appt.type === "Testing" &&
                appt.mode === "AT_HOME" &&
                appt.shipping_info?.shipping_status === "DeliveredToCustomer";

              const isRequesting = requestLoading === appt.appointment_id;
              const isRequested = requestSuccess === appt.appointment_id;

              return (
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
                        value={`${new Date(appt.start_time).toLocaleTimeString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - ${new Date(appt.end_time).toLocaleTimeString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
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
                          <Badge
                            variant={
                              appt.shipping_info
                                ? shippingStatusMap[appt.shipping_info.shipping_status]?.variant || "default"
                                : "outline"
                            }
                          >
                            {appt.shipping_info
                              ? shippingStatusMap[appt.shipping_info.shipping_status]?.label || appt.shipping_info.shipping_status
                              : (appt.status === "Pending"
                                ? "Đang chờ"
                                : appt.status === "Completed"
                                  ? "Hoàn thành"
                                  : appt.status === "Confirmed"
                                    ? "Đã xác nhận"
                                    : appt.status === "SampleCollected"
                                      ? "Đã lấy mẫu"
                                      : "Đã hủy")}
                          </Badge>
                        }
                      />
                      <Info
                        label="Thanh toán"
                        value={
                          <Badge
                            variant={
                              appt.payment_status
                                ? paymentStatusMap[appt.payment_status]?.variant || "default"
                                : "outline"
                            }
                          >
                            {appt.payment_status
                              ? paymentStatusMap[appt.payment_status]?.label || appt.payment_status
                              : "Không xác định"}
                          </Badge>
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

                  {/* Nút yêu cầu trả mẫu */}
                  {canRequestReturn && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant={isRequested ? "default" : "outline"}
                        disabled={isRequesting || isRequested}
                        onClick={() => requestReturnSample(appt.appointment_id)}
                      >
                        {isRequesting ? "Đang gửi..." : isRequested ? "Đã gửi yêu cầu" : "Yêu cầu trả mẫu"}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
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
  value: React.ReactNode;
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
