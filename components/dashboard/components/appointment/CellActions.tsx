"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, TestTube2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusUpdateDialog from "./StatusUpdateDialog";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { notify } from "@/lib/toastNotify";

export default function CellActions({ appointment }: { appointment: AppointmentListType }) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const handleVerifyAppointment = async () => {
    if (!confirm("Bạn có chắc chắn muốn xác nhận cuộc hẹn này không?")) return;
    try {
      const res = await fetch(`/api/appointments/${appointment.appointment_id}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "Xác nhận lịch hẹn" }),
      });
      if (!res.ok) throw new Error("Xác nhận thất bại");
      notify("success", "Xác nhận thành công!");
      router.refresh();
    } catch (err) {
      notify("error", (err as Error).message);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          {appointment.type === "Testing" && appointment.status === "Pending" && (
            <Link href={`/dashboard/shipping/create/${appointment.appointment_id}`} passHref>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <TestTube2 className="mr-2 h-4 w-4" /> Tạo vận chuyển mẫu
              </DropdownMenuItem>
            </Link>
          )}
          {appointment.type === "Consultation" && appointment.status === "Pending" && (
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleVerifyAppointment(); }}>
              <CheckCircle className="mr-2 h-4 w-4" /> Xác nhận cuộc hẹn
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setOpenDialog(true); }}>
            Thay đổi trạng thái
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(appointment.appointment_id)}>
            Sao chép mã cuộc hẹn
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Xem thông tin khách hàng</DropdownMenuItem>
          <DropdownMenuItem>Xem chi tiết lịch hẹn</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StatusUpdateDialog
        appointment={appointment}
        open={openDialog}
        setOpen={setOpenDialog}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
