// helpers.ts

import {
  StatusTypeEnums,
  PaymentStatusEnums,
} from "@/types/enums/HealthServiceEnums";

export const statusMap: Record<StatusTypeEnums, string> = {
  Pending: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  SampleCollected: "Đã lấy mẫu",
  Completed: "Hoàn thành",
  Cancelled: "Đã huỷ",
};

export const statusPaymentMap: Record<PaymentStatusEnums, string> = {
  Pending: "Chờ thanh toán",
  Paid: "Đã thanh toán",
  Failed: "Hủy",
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

export const getStatusPaymentBadgeVariant = (status: PaymentStatusEnums) => {
  switch (status) {
    case "Pending":
      return "default";
    case "Paid":
      return "secondary";
    case "Failed":
      return "secondary";
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

export const getQuestionStatusBadgeVariant = (
  type: "Pending" | "Answered" | "Closed"
) => {
  switch (type) {
    case "Pending":
      return "bg-blue-100 text-blue-800";
    case "Answered":
      return "bg-green-100 text-green-800";
    default:
      return "bg-red-100 text-red-800";
  }
};

export const getStatusPaymentBadgeColors = (status: PaymentStatusEnums) => {
  switch (status) {
    case "Pending":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900";
    case "Paid":
      return "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900";
    case "Failed":
      return "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900";
  }
};

export const getResultStatusBadgeColors = (status: StatusTypeEnums) => {
  switch (status) {
    case "Confirmed":
      return "bg-teal-100 text-teal-800 hover:bg-teal-200 hover:text-teal-900";
    case "SampleCollected":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900";
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900";
    case "Cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900";
    case "Pending":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900";
  }
};
