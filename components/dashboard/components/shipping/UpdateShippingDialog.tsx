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
import { notify } from "@/lib/toastNotify";

interface UpdateShippingDialogProps {
  shippingInfo: ShippingInfoType | null;
  appointmentId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdateSuccess: () => void;
}

export function UpdateShippingDialog({
  shippingInfo,
  open,
  setOpen,
  onUpdateSuccess,
}: UpdateShippingDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<ShippingStatus | null>(
    null
  );

  useEffect(() => {
    if (shippingInfo) {
      setSelectedStatus(shippingInfo.shipping_status);
    }
  }, [shippingInfo]);

  const handleUpdate = async () => {
    if (!shippingInfo?.id || !selectedStatus) return;

    try {
      const response = await fetch(`/api/shipping/${shippingInfo.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
        credentials: "include",
      });

      if (response.ok) {
        notify("success", "Cập nhật trạng thái thành công.");
        onUpdateSuccess();
      } else {
        const error = await response.json();
        notify("error", error.error || "Cập nhật thất bại.");
      }
    } catch {
      notify("error", "Lỗi mạng. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <select
            value={selectedStatus || ""}
            onChange={(e) =>
              setSelectedStatus(e.target.value as ShippingStatus)
            }
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Chọn trạng thái
            </option>
            <option value="DeliveredToCustomer">Đã giao cho khách</option>
            {/* <option value="Shipped">Đang giao</option> */}
            <option value="Failed">Thất bại / hủy đơn</option>
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
