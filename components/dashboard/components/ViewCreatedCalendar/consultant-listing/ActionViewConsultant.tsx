import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ViewCreatedCalendar } from "@/types/ViewCreatedCalendar/ViewCreatedCalendar";

interface ActionScheduleProps {
  user: ViewCreatedCalendar;
}

export function ActionViewSchedule({ user }: ActionScheduleProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(user.schedule_id);
              toast.success("Đã sao chép ID lịch.");
            }}
          >
            Sao chép ID lịch
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowDetail(true)}>
            Xem chi tiết lịch
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết lịch</DialogTitle>
          </DialogHeader>

          <div className="text-sm space-y-2">
            <p><strong>ID lịch:</strong> {user.schedule_id}</p>
            <p><strong>Consultant:</strong> {user.consultant_id}</p>
            <p><strong>Dịch vụ:</strong> {user.service?.name}</p>
            <p><strong>Bắt đầu:</strong> {new Date(user.start_time).toLocaleString("vi-VN")}</p>
            <p><strong>Kết thúc:</strong> {new Date(user.end_time).toLocaleString("vi-VN")}</p>
            <p><strong>Trạng thái:</strong> {user.is_booked ? "Đã đặt" : "Còn trống"}</p>
            <p><strong>Max/ngày:</strong> {user.max_appointments_per_day}</p>
            <p><strong>Ngày tạo:</strong> {new Date(user.created_at).toLocaleString("vi-VN")}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
