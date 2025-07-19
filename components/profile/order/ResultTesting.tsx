"use client";

import { useEffect, useState } from "react";
import { AppointmentDetailResponse } from "@/types/appointment/appointmentDetail"; // đường dẫn tương ứng file types/appointment.ts
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getResultStatusBadgeColors,
  getTypeBadgeVariant,
} from "@/components/dashboard/components/appointment/helpers";
import { StatusTypeEnums } from "@/types/enums/HealthServiceEnums";
import { FilePenIcon } from "lucide-react";

const statusVietnameseMap: Record<string, string> = {
  Pending: "Đang chờ",
  SampleCollected: "Đã lấy mẫu",
  Completed: "Hoàn thành",
  Confirmed: "Đã xác nhận",
  Cancelled: "Đã hủy",
  // Thêm nếu có trạng thái khác
};

interface ResultTestingProps {
  appointmentId: string;
}

export default function ResultTesting({ appointmentId }: ResultTestingProps) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<AppointmentDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getAppointmentDetail(
    id: string
  ): Promise<AppointmentDetailResponse> {
    const res = await fetch(`/api/appointments/${id}`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Không thể lấy chi tiết lịch hẹn");
    }
    return res.json();
  }

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setError(null);

    getAppointmentDetail(appointmentId)
      .then((res) => setData(res))
      .catch((err) => setError(err.message || "Lỗi khi lấy chi tiết lịch hẹn"))
      .finally(() => setLoading(false));
  }, [open, appointmentId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg hover:scale-105 hover:from-blue-500 hover:to-primary"
        >
          <span className="relative z-10">Xem kết quả xét nghiệm</span>
          <span className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity bg-white pointer-events-none" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl animate-modal-bg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-start gap-2 ">
            Kết quả xét nghiệm
            <span>
              <FilePenIcon className="animate-pulse text-teal-500" size={20} />
            </span>
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="p-4">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {error && <p className="text-red-600 p-4 text-center">{error}</p>}

        {!loading && !error && data?.appointment && (
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Left Side: General Info & Status History */}
              <div className="col-span-1 min-w-0">
                <CardHeader>
                  <CardTitle>Thông tin chung</CardTitle>
                </CardHeader>
                <CardContent className="animate-modal-content">
                  <div className="grid grid-cols-1 gap-2">
                    {/* ...general info fields... */}
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">
                        Mã lịch hẹn
                      </p>
                      <p className="font-medium">
                        {data.appointment.appointment_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">
                        Loại dịch vụ
                      </p>
                      <Badge
                        className={getTypeBadgeVariant(
                          data.appointment.type as "Testing" | "Consultation"
                        )}
                      >
                        {data.appointment.type}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">
                        Ngày giờ
                      </p>
                      <p className="font-medium">
                        {new Date(data.appointment.start_time).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">
                        Trạng thái
                      </p>
                      <Badge
                        className={getResultStatusBadgeColors(
                          data.appointment.status as StatusTypeEnums
                        )}
                      >
                        {statusVietnameseMap[data.appointment.status]}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="col-span-2">
                {data.appointment.test_result ? (
                  <CardContent>
                    <h3 className="animate-title">
                      <span className="inline-flex items-center gap-2">
                        <FilePenIcon
                          className="text-yellow-500 animate-bounce"
                          size={18}
                        />
                        Kết quả xét nghiệm
                      </span>
                    </h3>
                    <div className="mt-4 p-4 rounded-lg border bg-gray-50">
                      <div className="grid grid-cols gap-4">
                        <div>
                          <p className="text-muted-foreground text-sm mb-1">
                            Mã test
                          </p>
                          <p className="font-medium">
                            {data.appointment.test_result.test_code}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1">
                            Trạng thái kết quả
                          </p>
                          <Badge
                            className={getResultStatusBadgeColors(
                              data.appointment.test_result
                                .status as StatusTypeEnums
                            )}
                          >
                            {statusVietnameseMap[
                              data.appointment.test_result.status
                            ] || data.appointment.test_result.status}
                          </Badge>
                        </div>
                        <div className="w-3/6">
                          <p className="text-muted-foreground text-sm mb-1">
                            Kết quả
                          </p>
                          <p className="font-medium line-clamp-1">
                            {data.appointment.test_result.result_data ===
                            "Pending" ? (
                              <span>Đang chờ kết quả</span>
                            ) : (
                              <span className="break-words overflow-hidden">
                                {data.appointment.test_result.result_data}
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1">
                            Ghi chú
                          </p>
                          <p className="font-medium">
                            {data.appointment.test_result.notes ||
                              "Không có ghi chú"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <CardContent>
                    <p className="text-muted-foreground">
                      Chưa có kết quả xét nghiệm.
                    </p>
                  </CardContent>
                )}
              </div>

              <div className="col-span-3 min-w-0 max-h-[400px] overflow-y-auto">
                <CardContent>
                  <h3 className="animate-title font-semibold text-lg mb-2 flex items-center gap-2">
                    <FilePenIcon
                      className="text-blue-500 animate-pulse"
                      size={18}
                    />
                    Lịch sử trạng thái
                  </h3>
                  {data.appointmentStatusHistory.length === 0 ? (
                    <p className="text-muted-foreground">
                      Không có lịch sử trạng thái.
                    </p>
                  ) : (
                    <div className="mt-2 p-4 rounded-lg border bg-gray-50">
                      <ul className="list-disc list-inside space-y-2">
                        {data.appointmentStatusHistory.map((item, idx) => (
                          <ul key={idx}>
                            <Badge
                              className={getResultStatusBadgeColors(
                                item.status as StatusTypeEnums
                              )}
                            >
                              {statusVietnameseMap[item.status] || item.status}
                            </Badge>{" "}
                            -{" "}
                            <span className="font-medium">
                              {item.notes || "Không có ghi chú"}
                            </span>
                            <br />
                            <small className="text-muted-foreground">
                              {new Date(item.changed_at).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}{" "}
                              {new Date(item.changed_at).toLocaleDateString(
                                "vi-VN"
                              )}{" "}
                              - {item.changed_by_user.full_name}
                            </small>
                          </ul>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </div>
            </div>
          </Card>
        )}

        <DialogClose asChild>
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="bg-primary text-white-100 hover:bg-primary-500 hover:text-black-100 transition-colors mt-2 w-1/4"
            >
              Đóng
            </Button>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
