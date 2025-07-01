"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShippingInfoType, ShippingStatus } from "./CellActions";
// import { notify } from "@/lib/toastNotify";

interface UpdateReturnShippingDialogProps {
  shippingInfo: ShippingInfoType | null;
  appointmentId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdateSuccess: (status: ShippingStatus) => void;
}

export function UpdateReturnShippingDialog({
  shippingInfo,
  open,
  setOpen,
  onUpdateSuccess,
}: UpdateReturnShippingDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<ShippingStatus | null>(null);

  useEffect(() => {
    if (shippingInfo) {
      setSelectedStatus(shippingInfo.shipping_status);
    }
  }, [shippingInfo]);

  const handleUpdate = () => {
    if (!selectedStatus) return;
    onUpdateSuccess(selectedStatus);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn trả mẫu (Chiều về)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <select
            value={selectedStatus || ""}
            onChange={(e) => setSelectedStatus(e.target.value as ShippingStatus)}
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Chọn trạng thái
            </option>
            <option value={ShippingStatus.ReturnedToLab}>Mẫu đã về lab</option>
            <option value={ShippingStatus.Failed}>Thất bại / hủy đơn</option>
          </select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleUpdate}>Cập nhật</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
