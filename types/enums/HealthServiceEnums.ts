// Service Mode Enums
export type AvailableModeEnums = "AT_HOME" | "AT_CLINIC";

// Service Enums
export type ServiceTypeEnums = "Testing" | "Consultation";

// Sessesion Enums
export type SessionTypeEnums = "morning" | "afternoon";

// Role Enums
export enum RoleTypeEnums {
  Customer = "Customer",
  Consultant = "Consultant",
  Staff = "Staff",
  Admin = "Admin",
}

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
