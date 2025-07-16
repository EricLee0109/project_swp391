"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { notify } from "@/lib/toastNotify";
import { ClockIcon, CheckCircleIcon, DollarSignIcon, MapPinIcon, CalendarIcon, InfoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface AppointmentDetail {
  appointment: {
    appointment_id: string;
    user_id: string;
    consultant_id: string;
    type: "Consultation" | "Testing";
    start_time: string;
    end_time: string;
    status: string;
    location: string | null;
    payment_status: string;
    is_free_consultation: boolean;
    consultation_notes: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    service_id: string;
    schedule_id: string;
    related_appointment_id: string | null;
    free_consultation_valid_until: string | null;
    payment_refunded: boolean;
    sample_collected_date: string | null;
    mode: string | null;
    test_result: string | null;
    feedback: {
      feedback_id: string;
      rating: number;
      comment: string;
      is_public: boolean;
      is_anonymous: boolean;
      created_at: string;
      user: {
        full_name: string;
      };
    }[];
  };
  feedbacks: {
    feedback_id: string;
    rating: number;
    comment: string;
    is_public: boolean;
    is_anonymous: boolean;
    created_at: string;
    user: {
      full_name: string;
    };
  }[];
  appointmentStatusHistory: {
    status: string;
    notes: string;
    changed_at: string;
    changed_by_user: {
      full_name: string;
    };
  }[];
  message: string;
}

interface DetailOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
}

export default function DetailOrderDialog({ open, onOpenChange, appointmentId }: DetailOrderDialogProps) {
  const [detail, setDetail] = useState<AppointmentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'feedback'>('details');

  // Hàm ánh xạ trạng thái sang tiếng Việt
  const getVietnameseStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Đang chờ";
      case "completed":
        return "Hoàn thành";
      case "confirmed":
        return "Đã xác nhận";
      case "inprogress":
        return "Đang diễn ra";
      case "samplecollected":
        return "Đã lấy mẫu";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getVietnamesePaymentStatus = (paymentStatus: string) => {
    switch (paymentStatus.toLowerCase()) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Đang chờ";
      case "failed":
        return "Thất bại";
      default:
        return paymentStatus;
    }
  };

  // Hàm ánh xạ trạng thái sang variant hợp lệ của Badge
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "secondary"; // Thay "success" bằng "secondary"
      case "confirmed":
        return "default"; // Thay "primary" bằng "default"
      case "pending":
        return "outline"; // Thay "warning" bằng "outline"
      case "cancelled":
        return "destructive"; // Giữ nguyên
      default:
        return "default";
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "secondary"; // Thay "success" bằng "secondary"
      case "pending":
        return "outline"; // Thay "warning" bằng "outline"
      case "failed":
        return "destructive"; // Giữ nguyên
      default:
        return "default";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  useEffect(() => {
    async function fetchAppointmentDetail() {
      if (!open || !appointmentId) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/appointments/${appointmentId}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Lỗi backend: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        setDetail(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết lịch hẹn:", error);
        notify("error", (error as Error).message || "Lỗi server khi lấy chi tiết lịch hẹn.");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointmentDetail();
  }, [open, appointmentId, onOpenChange]);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-4 p-6">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6">
        {detail ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 border-b pb-3">
                Chi tiết lịch hẹn
              </DialogTitle>
              <div className="text-sm text-gray-600 mt-1">
                Mã lịch hẹn: {detail.appointment.appointment_id}
              </div>
            </DialogHeader>

            <div className="flex space-x-2 mb-4 mt-4">
              <button
                className={`px-4 py-2 font-semibold rounded-t-lg ${activeTab === 'details' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setActiveTab('details')}
              >
                Thông tin
              </button>
              <button
                className={`px-4 py-2 font-semibold rounded-t-lg ${activeTab === 'history' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setActiveTab('history')}
              >
                Lịch sử
              </button>
              <button
                className={`px-4 py-2 font-semibold rounded-t-lg ${activeTab === 'feedback' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setActiveTab('feedback')}
              >
                Phản hồi
              </button>
            </div>

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    icon={<CalendarIcon className="w-6 h-6 text-blue-600" />}
                    title="Thời gian"
                    content={
                      <>
                        <div className="flex items-center gap-2 text-gray-800">
                          <ClockIcon className="w-5 h-5" />
                          <span>{new Date(detail.appointment.start_time).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-800 mt-2">
                          <ClockIcon className="w-5 h-5" />
                          <span>{new Date(detail.appointment.end_time).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</span>
                        </div>
                      </>
                    }
                  />
                  <InfoCard
                    icon={<MapPinIcon className="w-6 h-6 text-blue-600" />}
                    title="Địa điểm"
                    content={<span className="text-gray-800">{detail.appointment.location || "Chưa cập nhật"}</span>}
                  />
                  <InfoCard
                    icon={<CheckCircleIcon className="w-6 h-6 text-blue-600" />}
                    title="Trạng thái"
                    content={
                      <Badge variant={getStatusBadgeVariant(detail.appointment.status)} className="text-sm">
                        {getVietnameseStatus(detail.appointment.status)}
                      </Badge>
                    }
                  />
                  <InfoCard
                    icon={<DollarSignIcon className="w-6 h-6 text-blue-600" />}
                    title="Thanh toán"
                    content={
                      <Badge variant={getPaymentBadgeVariant(detail.appointment.payment_status)} className="text-sm">
                        {getVietnamesePaymentStatus(detail.appointment.payment_status)}
                      </Badge>
                    }
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <InfoIcon className="w-5 h-5 text-blue-600" />
                    Thông tin bổ sung
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <InfoItem label="Dịch vụ" value={detail.appointment.service_id} />
                    <InfoItem label="Loại" value={detail.appointment.type === "Consultation" ? "Tư vấn" : "Xét nghiệm"} />
                    <InfoItem label="Tư vấn miễn phí" value={detail.appointment.is_free_consultation ? "Có" : "Không"} />
                    <InfoItem label="Ghi chú" value={detail.appointment.consultation_notes || "Không có"} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Lịch sử thay đổi trạng thái</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {detail.appointmentStatusHistory.length > 0 ? (
                    detail.appointmentStatusHistory.map((history, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <Badge variant={getStatusBadgeVariant(history.status)} className="text-sm">
                            {getVietnameseStatus(history.status)}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {new Date(history.changed_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-700">{history.notes}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Thay đổi bởi: {history.changed_by_user.full_name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Không có lịch sử thay đổi</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Đánh giá từ khách hàng</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {detail.feedbacks.length > 0 ? (
                    detail.feedbacks.map((feedback, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              {renderStars(feedback.rating)}
                              <span className="text-gray-700 font-medium">{feedback.rating}/5</span>
                            </div>
                            <p className="mt-2 text-gray-700">{feedback.comment}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-800 font-medium">{feedback.user.full_name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(feedback.created_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Chưa đánh giá</p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mt-4 bg-white hover:bg-gray-100 text-gray-800 border-gray-300 transition-colors duration-200"
              >
                Đóng
              </Button>
            </DialogFooter>
          </>
        ) : (
          <p className="text-center text-red-500 py-8">Không thể tải chi tiết lịch hẹn</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({ icon, title, content }: { icon: React.ReactNode; title: string; content: React.ReactNode }) {
  return (
    <div className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-medium text-gray-700">{title}</h4>
      </div>
      <div className="text-gray-800">{content}</div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || "Không có"}</p>
    </div>
  );
}