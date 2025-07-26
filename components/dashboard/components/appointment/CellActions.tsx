"use client";
import { useState } from "react";
import { MoreHorizontal, Trash2, CheckCircle } from "lucide-react";
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
import DeleteDialog from "@/components/dashboard/components/appointment/DeleteDialog";
import VerifyDialog from "@/components/dashboard/components/appointment/VerifyDialog";

export default function CellActions({
  appointment,
  onDeleted,
  onUpdated,
}: {
  appointment: AppointmentListType;
  onDeleted: (id: string) => void;
  onUpdated: (appointment: AppointmentListType) => void;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteOpenDialog, setDeleteOpenDialog] = useState<boolean>(false);
  const [verifyOpenDialog, setVerifyOpenDialog] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `/api/appointments/${appointment.appointment_id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Xoá lịch hẹn thất bại.");
      setDeleteOpenDialog(false);
      notify("success", "Xoá lịch hẹn thành công!");
      onDeleted(appointment.appointment_id); // Xoá khỏi UI
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      notify("error", err.message || "Xoá lịch hẹn thất bại.");
    }
  };

  const handleVerifySuccess = (updatedAppointment: AppointmentListType) => {
    notify("success", "Xác nhận lịch hẹn thành công!");
    onUpdated(updatedAppointment);
    setVerifyOpenDialog(false);
  };

  // Kiểm tra điều kiện hiển thị nút xác nhận
  const canVerify = appointment.type === "Consultation" && 
                   appointment.status === "Pending";

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
          
          {/* Hiển thị nút xác nhận cho Consultation và status Pending */}
          {canVerify && (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setVerifyOpenDialog(true);
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> 
              Xác nhận cuộc hẹn
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setOpenDialog(true);
            }}
          >
            Thay đổi trạng thái
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(appointment.appointment_id)
            }
          >
            Sao chép mã cuộc hẹn
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className="text-red-600 focus:bg-red-50"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteOpenDialog(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Xoá lịch hẹn</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Verify Dialog */}
      <VerifyDialog
        open={verifyOpenDialog}
        setOpenChange={setVerifyOpenDialog}
        appointment={appointment}
        onSuccess={handleVerifySuccess}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteOpenDialog}
        setOpenChange={setDeleteOpenDialog}
        handleDelete={handleDelete}
      />

      {/* Status Update Dialog */}
      <StatusUpdateDialog
        appointment={appointment}
        open={openDialog}
        setOpen={setOpenDialog}
        onSuccess={(updatedAppointment) => {
          if (updatedAppointment) {
            onUpdated(updatedAppointment);
          }
        }}
      />
    </>
  );
}