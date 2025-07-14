// types/user/User.ts
export type Gender = "Male" | "Female" | "Other" | null;
export type Role = "Admin" | "Staff" | "Manager" | "Consultant" | "Customer";

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  image: string | null;
  role: "Admin" | "Staff" | "Manager" | "Consultant" | "Customer" | string;
  is_verified: boolean;
  is_active: boolean;
  customerProfile?: CustomerProfile | null;
  consultantProfile?: ConsultantProfile | null;
}

export interface CustomerProfile {
  profile_id: string;
  user_id: string;
  date_of_birth: string; 
  gender: "Nam" | "Female" | "Other" | string;
  medical_history: string;
  privacy_settings: {
    showFullName: boolean;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: User;
}

export interface CustomerDetailResponse {
  user: User;
  customerProfile: CustomerProfile | null;
  consultantProfile: any | null; // có thể định nghĩa sau nếu có schema
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
}

// ✅ Xuất thêm type Consultant
export * from "./CustomServiceType";
