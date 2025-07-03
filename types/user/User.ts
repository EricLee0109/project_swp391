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
  customerProfile?: CustomerProfile | null; // Optional
  consultantProfile?: ConsultantProfile | null; // Optional
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

export interface ConsultantProfile {
  consultant_id: string;
  user_id: string;
  qualifications: string;
  experience: string;
  specialization: string;
  is_verified: boolean;
  average_rating: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: ConsultantUser;
}
export interface ConsultantUser {
  user_id: string;
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  role: Role;
  is_verified: boolean;
  is_active: boolean;
}
