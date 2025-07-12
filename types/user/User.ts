// types/user/User.ts
export type Gender = "Male" | "Female" | "Other" | null;
export type Role = "Admin" | "Staff" | "Manager" | "Consultant" | "Customer";
export type PrivacySetting =
  | {
      showFullName: boolean;
    }
  | "PRIVATE";

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  address?: string;
  role: string;
  is_active: boolean;
  is_verified?: boolean; // Thêm dấu ? để optional
  created_at: string;
  updated_at: string;
 customerProfile?: any;
  consultantProfile?: any;
}

export interface CustomerProfile {
  profile_id: string;
  user_id: string;
  date_of_birth: string | null;
  gender: string | null;
  medical_history: string;
  privacy_settings: any;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ✅ Xuất thêm type Consultant
export * from "./CustomServiceType";
