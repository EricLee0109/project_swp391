"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { notify } from "@/lib/toastNotify";

interface CreateReturnShippingDialogProps {
  appointmentId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateReturnShippingDialog({
  appointmentId,
  open,
  setOpen,
  onSuccess,
}: CreateReturnShippingDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleCreateReturn() {
    setLoading(true);
    try {
      const res = await fetch(`/api/shipping/appointments/${appointmentId}/order-ghn-return`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        notify("success", "Tạo đơn trả mẫu thành công");
        onSuccess();
        setOpen(false);
      } else {
        notify("error", data.error || "Tạo đơn trả mẫu thất bại");
      }
    } catch {
      notify("error", "Lỗi mạng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Tạo đơn trả mẫu</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Bạn có chắc muốn tạo đơn trả mẫu cho lịch hẹn này không?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleCreateReturn} disabled={loading}>
            {loading ? "Đang tạo..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
