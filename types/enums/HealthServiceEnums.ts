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
