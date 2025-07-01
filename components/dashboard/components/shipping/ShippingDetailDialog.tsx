"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShippingInfoType, ShippingStatus } from "./CellActions";

interface ShippingDetailDialogProps {
  shippingInfo: ShippingInfoType | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ShippingDetailDialog({
  shippingInfo,
  open,
  setOpen,
}: ShippingDetailDialogProps) {
  if (!shippingInfo) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-lg shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Chi tiết đơn vận chuyển
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-32 text-destructive">
            <p className="text-center font-semibold">Chưa tạo đơn vận chuyển!</p>
          </div>
          <DialogFooter className="justify-end">
            <Button
              variant="outline"
              className="hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const statusMap: Record<
    ShippingStatus,
    { label: string; color: string; icon: string }
  > = {
    [ShippingStatus.Pending]: {
      label: "Chưa tạo đơn GHN",
      color: "bg-yellow-100 text-yellow-800",
      icon: "⏳",
    },
    [ShippingStatus.Shipped]: {
      label: "Đã gửi đơn GHN",
      color: "bg-blue-100 text-blue-800",
      icon: "🚚",
    },
    [ShippingStatus.DeliveredToCustomer]: {
      label: "Đã giao cho khách",
      color: "bg-green-100 text-green-800",
      icon: "✅",
    },
    [ShippingStatus.PickupRequested]: {
      label: "Yêu cầu trả mẫu",
      color: "bg-purple-100 text-purple-800",
      icon: "📦",
    },
    [ShippingStatus.SampleInTransit]: {
      label: "Mẫu đang gửi về lab",
      color: "bg-orange-100 text-orange-800",
      icon: "📤",
    },
    [ShippingStatus.ReturnedToLab]: {
      label: "Mẫu đã về lab",
      color: "bg-teal-100 text-teal-800",
      icon: "🏥",
    },
    [ShippingStatus.Failed]: {
      label: "Thất bại / hủy đơn",
      color: "bg-red-100 text-red-800",
      icon: "❌",
    },
  };

  const statusData =
    statusMap[shippingInfo.shipping_status] || {
      label: "Không xác định",
      color: "bg-gray-100 text-gray-800",
      icon: "❓",
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 border-b pb-2">
            Chi tiết đơn vận chuyển
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
          <div className="col-span-2">
            <p className="font-medium">Đơn vị vận chuyển:</p>
            <p className="ml-2">{shippingInfo.provider}</p>
          </div>
          <div>
            <p className="font-medium">Người nhận:</p>
            <p className="ml-2">{shippingInfo.contact_name}</p>
          </div>
          <div>
            <p className="font-medium">Điện thoại:</p>
            <p className="ml-2">{shippingInfo.contact_phone}</p>
          </div>
          <div className="col-span-2">
            <p className="font-medium">Địa chỉ:</p>
            <p className="ml-2">
              {shippingInfo.shipping_address}, {shippingInfo.ward},{" "}
              {shippingInfo.district}, {shippingInfo.province}
            </p>
          </div>
          <div>
            <p className="font-medium">Mã đơn hàng:</p>
            <p className="ml-2">
              {shippingInfo.provider_order_code || "Chưa có"}
            </p>
          </div>
          <div>
            <p className="font-medium">Thời gian dự kiến:</p>
            <p className="ml-2">
              {shippingInfo.expected_delivery_time
                ? new Date(shippingInfo.expected_delivery_time).toLocaleString()
                : "Chưa có"}
            </p>
          </div>
          <div className="col-span-2">
            <p className="font-medium">Trạng thái:</p>
            <span
              className={`ml-2 px-2 py-1 rounded-full ${statusData.color} inline-flex items-center`}
            >
              <span className="mr-1">{statusData.icon}</span>
              {statusData.label}
            </span>
          </div>
          <div>
            <p className="font-medium">Ngày tạo:</p>
            <p className="ml-2">
              {new Date(shippingInfo.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="font-medium">Cập nhật cuối:</p>
            <p className="ml-2">
              {shippingInfo.updated_at
                ? new Date(shippingInfo.updated_at).toLocaleString()
                : "Chưa cập nhật"}
            </p>
          </div>
        </div>
        <DialogFooter className="mt-4 justify-end">
          <Button
            variant="outline"
            className="hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
