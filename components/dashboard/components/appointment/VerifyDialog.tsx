import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";

// Import enum nếu chưa có
enum AvailableModeEnums {
  AT_HOME = "AT_HOME",
  AT_CLINIC = "AT_CLINIC", 
  ONLINE = "ONLINE"
}

interface VerifyDialogProps {
  open: boolean;
  setOpenChange: (open: boolean) => void;
  appointment: AppointmentListType;
  onSuccess: (updatedAppointment: AppointmentListType) => void;
}

export default function VerifyDialog({
  open,
  setOpenChange,
  appointment,
  onSuccess,
}: VerifyDialogProps) {
  const [notes, setNotes] = useState("Xác nhận bởi staff");
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const body: { notes: string; meeting_link?: string } = { notes };
      
      // Chỉ thêm meeting_link nếu mode là ONLINE và có giá trị
      if (appointment.mode === AvailableModeEnums.ONLINE && meetingLink.trim()) {
        body.meeting_link = meetingLink.trim();
      }

      const res = await fetch(`/api/appointments/${appointment.appointment_id}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.error || "Xác nhận thất bại");
      }

      // Cập nhật appointment với dữ liệu mới
      const updatedAppointment = {
        ...appointment,
        status: "Confirmed", 
        ...data.data,
      };

      onSuccess(updatedAppointment);
      setOpenChange(false);
      
      // Reset form
      setNotes("Xác nhận bởi staff");
      setMeetingLink("");
      
    } catch (err) {
      console.error("Lỗi xác nhận:", err);
      // Có thể thêm toast notification ở đây
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpenChange(false);
    // Reset form khi đóng
    setNotes("Xác nhận bởi staff");
    setMeetingLink("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpenChange}>
      <DialogContent className="max-w-md">
        <AlertDialogHeader>
          <DialogTitle>Xác nhận lịch hẹn tư vấn</DialogTitle>
          <DialogDescription>
            Xác nhận lịch hẹn tư vấn cho khách hàng{" "}
            <strong>{appointment.user?.full_name}</strong>
          </DialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú xác nhận..."
              className="min-h-[80px]"
            />
          </div>

          {/* Meeting Link Input - chỉ hiển thị khi mode là ONLINE */}
          {appointment.mode === AvailableModeEnums.ONLINE && (
            <div className="space-y-2">
              <Label htmlFor="meetingLink">
                Link Google Meet <span className="text-gray-500">(tùy chọn)</span>
              </Label>
              <Input
                id="meetingLink"
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
              />
              <p className="text-xs text-gray-500">
                Để trống nếu sẽ tạo link meeting sau
              </p>
            </div>
          )}

          {/* Thông tin appointment */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
            <p><strong>Dịch vụ:</strong> {appointment.service?.name}</p>
            <p>
              <strong>Hình thức:</strong>{" "}
              {appointment.mode === AvailableModeEnums.AT_CLINIC 
                ? "Tại phòng khám" 
                : appointment.mode === AvailableModeEnums.ONLINE 
                ? "Trực tuyến" 
                : "Tại nhà"}
            </p>
            <p>
              <strong>Thời gian:</strong>{" "}
              {new Date(appointment.start_time).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleClose} variant="outline" disabled={loading}>
              Hủy
            </Button>
          </DialogClose>
          <Button onClick={handleVerify} disabled={loading}>
            {loading ? "Đang xác nhận..." : "Xác nhận lịch hẹn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}