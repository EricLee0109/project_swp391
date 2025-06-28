// helpers.ts
import { StatusTypeEnums } from "@/types/enums/HealthServiceEnums";

export const statusMap: Record<StatusTypeEnums, string> = {
  Pending: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  SampleCollected: "Đã lấy mẫu",
  Completed: "Hoàn thành",
  Cancelled: "Đã huỷ",
};

export const getStatusBadgeVariant = (status: StatusTypeEnums) => {
  switch (status) {
    case "Confirmed":
      return "default";
    case "SampleCollected":
      return "secondary";
    case "Completed":
      return "secondary";
    case "Cancelled":
      return "destructive";
    case "Pending":
      return "outline";
    default:
      return "default";
  }
};

export const getTypeBadgeVariant = (type: "Consultation" | "Testing") => {
  switch (type) {
    case "Consultation":
      return "bg-blue-100 text-blue-800";
    case "Testing":
      return "bg-green-100 text-green-800";
    default:
      return "default";
  }
};
