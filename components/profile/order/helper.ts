export type BadgeVariant = "outline" | "secondary" | "destructive" | "default";

export interface ShippingStatusInfo {
  label: string;
  variant: BadgeVariant;
}

export const shippingStatusMap: Record<string, ShippingStatusInfo> = {
  Pending: { label: "Chưa tạo đơn", variant: "outline" },
  Shipped: { label: "Đã gửi đơn", variant: "secondary" },
  DeliveredToCustomer: { label: "Đã giao khách", variant: "default" },
  PickupRequested: { label: "Yêu cầu lấy hàng", variant: "outline" },
  SampleInTransit: { label: "Mẫu đang gửi", variant: "secondary" },
  ReturnedToLab: { label: "Mẫu đã về lab", variant: "default" },
  Failed: { label: "Thất bại", variant: "destructive" },
};

export interface PaymentStatusInfo {
  label: string;
  variant: BadgeVariant;
}

export const paymentStatusMap: Record<string, PaymentStatusInfo> = {
  Pending: { label: "Chờ thanh toán", variant: "outline" },
  Paid: { label: "Đã thanh toán", variant: "secondary" },
  Failed: { label: "Thanh toán thất bại", variant: "destructive" },
};
