"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Globe, Home, Hospital, MapPin, Star } from "lucide-react";
import { cn, formatCurrency, formatDateVN } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { shippingStatusMap, paymentStatusMap } from "./helper";
import { notify } from "@/lib/toastNotify";
import ResultTesting from "./ResultTesting";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EyeIcon } from "lucide-react";
import DetailOrderDialog from "./DetailOrderDialog";
import { getStatusPaymentBadgeColors } from "@/components/dashboard/components/appointment/helpers";

interface ApiAppointment {
  appointment_id: string;
  type: "Consultation" | "Testing";
  start_time: string;
  end_time: string;
  status:
  | "Pending"
  | "Completed"
  | "Confirmed"
  | "SampleCollected"
  | "Cancelled"
  | "InProgress";
  payment_status: "Paid" | "Pending" | "Failed";
  location: string | null;
  mode: "AT_HOME" | "AT_CLINIC" | "ONLINE";
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
  const itemsPerPage = 3;
  const [requestLoading, setRequestLoading] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [validateLoading, setValidateLoading] = useState<string | null>(null);
  const [validateResult, setValidateResult] = useState<{
    [key: string]: { valid: boolean; message: string };
  }>({});
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState<string | null>(
    null
  );
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<string | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState<string | null>(null);
  const [hasFeedback, setHasFeedback] = useState<{ [key: string]: boolean }>(
    {}
  );

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
      } catch {
        setError("Lỗi mạng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  useEffect(() => {
    appointments.forEach((appt) => {
      if (
        appt.type === "Consultation" &&
        appt.status === "Completed" &&
        hasFeedback[appt.appointment_id] === undefined
      ) {
        fetch(`/api/appointments/${appt.appointment_id}`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            setHasFeedback((prev) => ({
              ...prev,
              [appt.appointment_id]: data.feedbacks?.length > 0,
            }));
          })
          .catch(() => { });
      }
    });
  }, [appointments, hasFeedback]);

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

  async function requestReturnSample(appointmentId: string) {
    setRequestLoading(appointmentId);
    setRequestSuccess(null);
    try {
      const res = await fetch(
        `/api/shipping/appointments/${appointmentId}/return-request`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (res.ok) {
        setRequestSuccess(appointmentId);
        notify("success", "Yêu cầu trả mẫu đã được gửi thành công.");
      } else {
        notify("error", "Gửi yêu cầu thất bại.");
      }
    } catch {
      notify("error", "Lỗi mạng, vui lòng thử lại");
    } finally {
      setRequestLoading(null);
    }
  }

  async function validateTestCode(appointmentId: string, testCode: string) {
    setValidateLoading(appointmentId);
    try {
      const res = await fetch(
        `/api/appointments/validate-test-code/${testCode}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setValidateResult((prev) => ({ ...prev, [appointmentId]: data }));
      notify(data.valid ? "success" : "error", data.message);
    } catch {
      notify("error", "Lỗi mạng, vui lòng thử lại");
    } finally {
      setValidateLoading(null);
    }
  }

  async function submitFeedback(appointmentId: string) {
    if (feedbackRating < 1 || feedbackRating > 5) {
      notify("error", "Vui lòng chọn đánh giá từ 1 đến 5 sao.");
      return;
    }
    if (!feedbackComment.trim()) {
      notify("error", "Vui lòng nhập nhận xét.");
      return;
    }

    setFeedbackSubmitting(appointmentId);
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/feedback`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: feedbackRating,
          comment: feedbackComment,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Không thể gửi đánh giá.");
      }

      notify("success", "Gửi đánh giá thành công!");
      setFeedbackDialogOpen(null);
      setFeedbackRating(0);
      setFeedbackComment("");
      setHasFeedback((prev) => ({ ...prev, [appointmentId]: true }));
    } catch (error) {
      notify(
        "error",
        (error as Error).message || "Lỗi mạng, vui lòng thử lại."
      );
    } finally {
      setFeedbackSubmitting(null);
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

  const testResultStatusMap: Record<
    string,
    { label: string; color: string }
  > = {
    Pending: { label: "Đang chờ", color: "bg-yellow-100 text-yellow-800" },
    Processing: { label: "Đang xét nghiệm", color: "bg-orange-100 text-orange-800" },
    Completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
  };

  return (
    <div className="py-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Lịch sử đặt hẹn</CardTitle>
          <p className="text-sm text-muted-foreground">
            Danh sách các lịch hẹn của bạn
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {paginatedAppointments.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có lịch hẹn nào.</p>
          ) : (
            paginatedAppointments.map((appt) => {
              const canRequestReturn =
                appt.type === "Testing" &&
                appt.mode === "AT_HOME" &&
                appt.shipping_info?.shipping_status === "DeliveredToCustomer";
              const isRequesting = requestLoading === appt.appointment_id;
              const isRequested = requestSuccess === appt.appointment_id;
              const canValidate = appt.type === "Testing" && appt.test_code;
              const isValidating = validateLoading === appt.appointment_id;
              const validateRes = validateResult[appt.appointment_id];
              const canFeedback =
                appt.type === "Consultation" &&
                appt.status === "Completed" &&
                !hasFeedback[appt.appointment_id];
              console.log(appt, "Order History");
              return (
                <div
                  key={appt.appointment_id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Info
                        label="Mã hẹn"
                        value={appt.test_code || appt.appointment_id}
                      />
                      <Info label="Dịch vụ" value={appt.service.name} />
                      <Info
                        label="Ngày hẹn"
                        value={formatDateVN(appt.start_time)}
                        icon={
                          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        }
                      />
                      <Info
                        label="Thời gian"
                        value={`${new Date(appt.start_time).toLocaleTimeString(
                          "vi-VN",
                          {
                            timeZone: "Asia/Ho_Chi_Minh",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )} - ${new Date(appt.end_time).toLocaleTimeString(
                          "vi-VN",
                          {
                            timeZone: "Asia/Ho_Chi_Minh",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}`}
                      />
                      {appt.shipping_info && (
                        <Info
                          label="Địa chỉ giao hàng"
                          value={`${appt.shipping_info.shipping_address}, ${appt.shipping_info.ward}, ${appt.shipping_info.district}, ${appt.shipping_info.province}`}
                          icon={<MapPin size={15} />}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hình thức</p>
                      <div
                        className={cn(
                          "flex flex-between gap-1 px-2 py-1 rounded-full text-xs w-1/2",
                          appt.mode === "AT_HOME"
                            ? "bg-teal-50 text-teal-700"
                            : appt.mode === "ONLINE"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-indigo-50 text-indigo-700" // AT_CLINIC mặc định
                        )}
                      >
                        <Info
                          value={
                            appt.mode === "AT_HOME"
                              ? "Tại nhà"
                              : appt.mode === "ONLINE"
                                ? "Trực tuyến"
                                : "Tại phòng khám"
                          }
                          icon={
                            appt.mode === "AT_HOME" ? (
                              <Home size={14} className="w-4 h-4 text-teal-600" />
                            ) : appt.mode === "ONLINE" ? (
                              <Globe size={14} className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <Hospital size={14} className="w-4 h-4 text-indigo-600" />
                            )
                          }
                        />
                      </div>


                      <Info
                        label="Trạng thái"
                        value={
                          <Badge
                            variant={
                              appt.shipping_info
                                ? shippingStatusMap[
                                  appt.shipping_info.shipping_status
                                ]?.variant || "default"
                                : "outline"
                            }
                          >
                            {appt.shipping_info
                              ? shippingStatusMap[
                                appt.shipping_info.shipping_status
                              ]?.label || appt.shipping_info.shipping_status
                              : appt.status === "Pending"
                                ? "Đang chờ"
                                : appt.status === "Completed"
                                  ? "Hoàn thành"
                                  : appt.status === "Confirmed"
                                    ? "Đã xác nhận"
                                    : appt.status === "InProgress"
                                      ? "Đang diễn ra"
                                      : appt.status === "SampleCollected"
                                        ? "Đã lấy mẫu"
                                        : "Đã hủy"}
                          </Badge>
                        }
                      />
                      <Info
                        label="Thanh toán"
                        value={
                          <Badge
                            className={getStatusPaymentBadgeColors(
                              appt.payment_status
                            )}
                          >
                            {appt.payment_status
                              ? paymentStatusMap[appt.payment_status].label ||
                              appt.payment_status
                              : "Không xác định"}
                          </Badge>
                        }
                      />
                      {appt.consultant_name && (
                        <Info
                          label="Bác sĩ tư vấn"
                          value={appt.consultant_name}
                        />
                      )}
                      {appt.test_result_status && (
                        <Info
                          label="Kết quả xét nghiệm"
                          value={
                            <Badge
                              className={
                                testResultStatusMap[appt.test_result_status]?.color ||
                                "bg-gray-100 text-gray-800"
                              }
                            >
                              {testResultStatusMap[appt.test_result_status]?.label ||
                                appt.test_result_status}
                            </Badge>
                          }
                        />
                      )}
                      {appt.payments && (
                        <Info
                          label="Chi phí"
                          value={
                            <div className="text-lg font-semibold text-primary bg-red-200 px-2 rounded-sm">
                              {formatCurrency(appt.payments[0]?.amount) ||
                                "Chưa thanh toán"}
                            </div>
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      {canRequestReturn && (
                        <Button
                          variant={isRequested ? "default" : "outline"}
                          disabled={isRequesting || isRequested}
                          onClick={() =>
                            requestReturnSample(appt.appointment_id)
                          }
                        >
                          {isRequesting
                            ? "Đang gửi..."
                            : isRequested
                              ? "Đã gửi yêu cầu"
                              : "Yêu cầu trả mẫu"}
                        </Button>
                      )}
                      {canValidate && (
                        <Button
                          variant={validateRes ? "default" : "outline"}
                          disabled={isValidating || !!validateRes}
                          onClick={() =>
                            validateTestCode(
                              appt.appointment_id,
                              appt.test_code!
                            )
                          }
                        >
                          {isValidating
                            ? "Đang kiểm tra..."
                            : validateRes
                              ? validateRes.valid
                                ? "Hợp lệ"
                                : "Không hợp lệ"
                              : "Kiểm tra tư vấn miễn phí"}
                        </Button>
                      )}
                      {canFeedback && (
                        <Button
                          variant="outline"
                          disabled={feedbackSubmitting === appt.appointment_id}
                          onClick={() =>
                            setFeedbackDialogOpen(appt.appointment_id)
                          }
                        >
                          {feedbackSubmitting === appt.appointment_id
                            ? "Đang gửi..."
                            : "Đánh giá buổi tư vấn"}
                        </Button>
                      )}
                    </div>
                    {appt.type === "Consultation" && (
                      <div className="relative">
                        <EyeIcon
                          className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-primary"
                          onClick={() =>
                            setDetailDialogOpen(appt.appointment_id)
                          }
                          onMouseEnter={(e) => {
                            const tooltip = document.createElement("div");
                            tooltip.innerText = "Xem chi tiết lịch hẹn";
                            tooltip.style.position = "absolute";
                            tooltip.style.backgroundColor = "#333";
                            tooltip.style.color = "#fff";
                            tooltip.style.padding = "4px 8px";
                            tooltip.style.borderRadius = "4px";
                            tooltip.style.top = "-30px";
                            tooltip.style.right = "0";
                            tooltip.style.zIndex = "10";
                            e.currentTarget.appendChild(tooltip);
                          }}
                          onMouseLeave={(e) => {
                            const tooltip =
                              e.currentTarget.querySelector("div");
                            if (tooltip) tooltip.remove();
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {appt.type === "Testing" && (
                    <ResultTesting appointmentId={appt.appointment_id} />
                  )}

                  <Dialog
                    open={feedbackDialogOpen === appt.appointment_id}
                    onOpenChange={() => {
                      setFeedbackDialogOpen(null);
                      setFeedbackRating(0);
                      setFeedbackComment("");
                    }}
                  >
                    <DialogContent className="max-w-md bg-white">
                      <DialogHeader>
                        <DialogTitle>Đánh giá buổi tư vấn</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Đánh giá (1-5 sao)
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-6 h-6 cursor-pointer ${feedbackRating >= star
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                  }`}
                                onClick={() => setFeedbackRating(star)}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Nhận xét
                          </label>
                          <Input

                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            placeholder="Nhập nhận xét của bạn"
                            className="w-full"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setFeedbackDialogOpen(null)}
                          disabled={feedbackSubmitting === appt.appointment_id}
                        >
                          Hủy
                        </Button>
                        <Button
                          onClick={() => submitFeedback(appt.appointment_id)}
                          disabled={feedbackSubmitting === appt.appointment_id}
                        >
                          {feedbackSubmitting === appt.appointment_id
                            ? "Đang gửi..."
                            : "Gửi đánh giá"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              );
            })
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Trước
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Sau
              </Button>
            </div>
          )}
          <DetailOrderDialog
            open={!!detailDialogOpen}
            onOpenChange={(open) =>
              setDetailDialogOpen(open ? detailDialogOpen : null)
            }
            appointmentId={detailDialogOpen || ""}
          />
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
  label?: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium flex items-center gap-1">
        {icon}
        {value}
      </p>
    </div>
  );
}