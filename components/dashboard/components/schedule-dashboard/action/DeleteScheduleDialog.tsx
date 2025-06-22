"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { notify } from "@/lib/toastNotify";

interface DeleteScheduleDialogProps {
  trigger: React.ReactNode;
  scheduleId: string;
  onDeleted?: () => void;
}

export function DeleteScheduleDialog({
  trigger,
  scheduleId,
  onDeleted,
}: DeleteScheduleDialogProps) {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/schedules/${scheduleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json(); // Lấy JSON từ response
        throw new Error(errorData.message || "Xóa lịch thất bại"); // Sử dụng message từ backend
      }

      notify("success", "Đã xóa lịch thành công");
      onDeleted?.();
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa lịch";
      notify("error", errorMessage);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa lịch</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa lịch tư
            vấn này không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Xác nhận xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}