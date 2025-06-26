// Service Mode Enums
export enum AvailableModeEnums {
  AT_HOME = "AT_HOME",
  AT_CLINIC = "AT_CLINIC",
}
export type AvailableMode = "AT_HOME" | "AT_CLINIC";

// Service Enums
export enum ServiceTypeEnums {
  Consultation = "Consultation",
  Testing = "Testing",
}
export type ServiceType = "Consultation" | "Testing";

// Sessesion Enums
export type SessionTypeEnums = "morning" | "afternoon";

// Role Enums
export enum RoleTypeEnums {
  Customer = "Customer",
  Consultant = "Consultant",
  Staff = "Staff",
  Admin = "Admin",
}

export type RoleTypeEnum = keyof typeof RoleTypeEnums;

//Status Enums
export type StatusTypeEnums =
  | "Pending"
  | "Confirmed"
  | "SampleCollected"
  | "Completed"
  | "Cancelled";

//Payment Status Enums
export type PaymentStatusEnums = "Pending" | "Paid" | "Failed";

//Shipping Status Enums
export type ShippingStatusEnums =
  | "Pending" // Đang chờ gửi hàng
  | "Shipped" // Đã gửi đi
  | "DeliveredToCustomer" // Khách nhận kit
  | "PickupRequested" // Khách yêu cầu lấy mẫu
  | "SampleInTransit" // Mẫu đang trên đường về
  | "SampleCollected" // Đã nhận mẫu tại phòng xét nghiệm
  | "ReturnedToLab" // Trả về phòng xét nghiệm (xử lý hoàn thành)
  | "Failed"; // Lỗi vận chuyển (nếu có);
