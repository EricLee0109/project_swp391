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

interface UpdateReturnShippingDialogProps {
  shippingInfo: ShippingInfoType | null;
  appointmentId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdateSuccess: () => void;
}

export function UpdateReturnShippingDialog({
  shippingInfo,
  appointmentId,
  open,
  setOpen,
  onUpdateSuccess,
}: UpdateReturnShippingDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<ShippingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      console.log("Dialog opened, resetting selectedStatus to null");
      setSelectedStatus(null);
    }
  }, [open]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ShippingStatus;
    console.log("User selected status:", newStatus);
    setSelectedStatus(newStatus);
  };

  const handleUpdate = async () => {
    if (!shippingInfo?.id || !selectedStatus) {
      notify("error", "Vui lòng chọn trạng thái mới.");
      return;
    }

    if (selectedStatus === shippingInfo.shipping_status) {
      notify("info", "Trạng thái không thay đổi.");
      return;
    }

    setIsLoading(true);

    console.log("=== BEFORE API CALL ===");
    console.log("Selected Status:", selectedStatus);
    console.log("Original Status:", shippingInfo.shipping_status);
    console.log("Shipping ID:", shippingInfo.id);

    try {
      const requestBody = { status: selectedStatus };
      console.log("Request Body:", requestBody);

      const response = await fetch(`/api/shipping/return/${shippingInfo.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      const data = await response.json();
      console.log("=== API RESPONSE ===");
      console.log("Response Data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Cập nhật thất bại.");
      }

      // Verify actual status
      const verifyRes = await fetch(`/api/shipping/appointments/${appointmentId}`, {
        credentials: "include",
        cache: "no-store",
      });
      const verifyData = await verifyRes.json();
      const actualStatus = verifyData.return?.shipping_status;

      console.log("=== VERIFIED STATUS ===");
      console.log("Actual Status:", actualStatus);

      if (actualStatus !== selectedStatus) {
        notify("error", `Trạng thái không đúng: Nhận ${actualStatus || "undefined"} thay vì ${selectedStatus}.`);
      } else {
        notify("success", "Cập nhật trạng thái đơn trả mẫu thành công.");
        setOpen(false);
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Update error:", error);
      notify("error", (error as Error).message || "Lỗi mạng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStatus(null);
  };

  const getAvailableOptions = () => {
    const options = [];

    if (
      shippingInfo?.shipping_status === "PickupRequested" ||
      shippingInfo?.shipping_status === "SampleInTransit"
    ) {
      options.push({ value: "ReturnedToLab", label: "Mẫu đã về lab" });
    }

    options.push({ value: "Failed", label: "Thất bại / hủy đơn" });

    return options;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn trả mẫu (Chiều về)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Trạng thái hiện tại: <strong>{shippingInfo?.shipping_status}</strong>
            </label>
            <select
              value={selectedStatus || ""}
              onChange={handleStatusChange}
              className="w-full p-2 border rounded"
              disabled={isLoading}
            >
              <option value="" disabled>
                Chọn trạng thái mới
              </option>
              {getAvailableOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {selectedStatus && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              Sẽ cập nhật thành: <strong>{selectedStatus}</strong>
            </div>
          )}
          {shippingInfo?.shipping_status === "Pending" && (
            <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
              Đơn đang ở trạng thái Pending. Vui lòng đợi chuyển sang PickupRequested hoặc SampleInTransit trước khi cập nhật thành Mẫu đã về lab.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isLoading || !selectedStatus}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}