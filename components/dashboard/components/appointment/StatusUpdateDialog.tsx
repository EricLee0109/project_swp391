import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppointmentListType } from "@/types/ServiceType/StaffRoleType";
import { useState } from "react";
import { notify } from "@/lib/toastNotify";
import { statusMap } from "./helpers";

interface UpdateStatusDialogProps {
  status: string;
  notes?: string;
}

export default function StatusUpdateDialog({
  appointment,
  open,
  setOpen,
  onSuccess,
}: {
  appointment: AppointmentListType;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: (updatedAppointment: AppointmentListType) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<keyof typeof statusMap>(
    appointment.status as keyof typeof statusMap
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const body: UpdateStatusDialogProps = { status: selectedStatus };
      if (selectedStatus === "Completed") {
        if (notes === "Positive") {
          body.notes = "Kết quả dương tính";
        } else if (notes === "Negative") {
          body.notes = "Kết quả âm tính";
        } else {
          body.notes = notes || "Không có ghi chú";
        }
      } else {
        body.notes = notes || "Không có ghi chú";
      }
      const res = await fetch(
        `/api/appointments/${appointment.appointment_id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      console.log(JSON.stringify(body, null, 2));
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "Cập nhật trạng thái thất bại");

      notify("success", "Cập nhật trạng thái thành công");
      setOpen(false);

      onSuccess?.(
        data.appointment || { ...appointment, status: selectedStatus }
      );
    } catch (err) {
      notify("error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thay đổi trạng thái cuộc hẹn</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          {(Object.keys(statusMap) as (keyof typeof statusMap)[]).map(
            (status) => (
              <label
                key={status}
                className="flex items-center gap-2 py-1 cursor-pointer"
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={() => setSelectedStatus(status)}
                />
                <span>{statusMap[status]}</span>
              </label>
            )
          )}
          {selectedStatus === "Completed" && (
            <>
              <div className="mt-2">
                {/* <label className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="radio"
                    name="notes"
                    value="Positive"
                    checked={notes === "Positive"}
                    onChange={() => setNotes("Positive")}
                  />
                  <span>Positive</span>
                </label> */}
                {/* <label className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="radio"
                    name="notes"
                    value="Negative"
                    checked={notes === "Negative"}
                    onChange={() => setNotes("Negative")}
                  />
                  <span>Negative</span>
                </label> */}
              </div>
              <textarea
                className="w-full mt-2 border rounded p-2"
                placeholder="Ghi chú (tuỳ chọn)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || selectedStatus === appointment.status}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}