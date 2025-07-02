"use client";

import { useEffect, useState } from "react";
import { AppointmentDetailResponse } from "@/types/appointment/appointmentDetail"; // đường dẫn tương ứng file types/appointment.ts
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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

  async function getAppointmentDetail(id: string): Promise<AppointmentDetailResponse> {
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
        <Button variant="outline" size="sm" className="mt-4">
          Xem kết quả xét nghiệm
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kết quả xét nghiệm</DialogTitle>
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
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Mã lịch hẹn:</strong> {data.appointment.appointment_id}</p>
              <p><strong>Loại dịch vụ:</strong> {data.appointment.type}</p>
              <p><strong>Ngày giờ:</strong> {new Date(data.appointment.start_time).toLocaleString("vi-VN")}</p>
              <p><strong>Trạng thái:</strong> {statusVietnameseMap[data.appointment.status]}</p>
            </CardContent>

            {data.appointment.test_result ? (
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">Kết quả xét nghiệm</h3>
                <p><strong>Mã test:</strong> {data.appointment.test_result.test_code}</p>
                <p><strong>Trạng thái kết quả:</strong> {statusVietnameseMap[data.appointment.test_result.status]}</p>
                <p><strong>Kết quả:</strong> {data.appointment.test_result.result_data}</p>
                <p><strong>Ghi chú:</strong> {data.appointment.test_result.notes}</p>
              </CardContent>
            ) : (
              <CardContent>
                <p>Chưa có kết quả xét nghiệm.</p>
              </CardContent>
            )}

            <CardContent>
              <h3 className="font-semibold text-lg mb-2">Lịch sử trạng thái</h3>
              {data.appointmentStatusHistory.length === 0 ? (
                <p>Không có lịch sử trạng thái.</p>
              ) : (
               <ul className="list-disc list-inside space-y-1">
  {data.appointmentStatusHistory.map((item, idx) => (
    <li key={idx}>
      <strong>{statusVietnameseMap[item.status] || item.status}</strong> - {item.notes} <br />
      <small className="text-muted-foreground">
        {new Date(item.changed_at).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })} {new Date(item.changed_at).toLocaleDateString("vi-VN")} - {item.changed_by_user.full_name}
      </small>
    </li>
  ))}
</ul>

              )}
            </CardContent>
          </Card>
        )}

        <DialogClose asChild>
          <Button variant="outline" className="mt-4 w-full">Đóng</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
