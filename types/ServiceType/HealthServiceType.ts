
import {
  AvailableModeEnums,
  RoleTypeEnum,
  ServiceTypeEnums,
} from "@/types/enums/HealthServiceEnums";

export interface TestingHours {
  morning?: { start: string; end: string };
  afternoon?: { start: string; end: string };
}

export interface Service {
  service_id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  is_active: boolean;
  type: ServiceTypeEnums;
  testing_hours: TestingHours | null;
  daily_capacity: number | null;
  return_address: string | null;
  return_phone: string | null;
  available_modes: AvailableModeEnums[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface StiService {
  serviceId: string;
  date: string; // YYYY-MM-DD
  session: "morning" | "afternoon";
  location?: string; //required for AT_CLINIC
  category: string | "STI";
  selected_mode: "AT_HOME" | "AT_CLINIC";
  contact_name?: string; //required for AT_HOME
  contact_phone?: string; //required for AT_HOME
  shipping_address?: string; //required for AT_HOME
  province?: string; //required for AT_HOME
  district?: string; //required for AT_HOME
  ward?: string; //required for AT_HOME
}

export interface User {
  user_id: string;
  email: string;
  exp?: number; // JWT expiration time
  fullName?: string | null; // Alias for full_name
  full_name?: string | null;
  name?: string | null;
  iat?: number; // JWT issued at time
  phone_number?: string | null;
  isActive?: boolean; // Indicates if the user is active
  isVerified?: boolean; // Indicates if the user is verified
  is_active?: boolean; // Alias for isActive
  is_verified?: boolean; // Alias for isVerifie
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  sub?: string; // JWT subject, typically the user ID
  avatar?: string;
  role?: RoleTypeEnum;
}

export interface Consultant {
  consultant_id: string;
  user_id: string;
  user: User;
  qualifications?: string;
  experience?: string;
  specialization?: string;
  is_verified: boolean;
  average_rating?: number;
}

export interface Schedule {
  schedule_id: string;
  consultant_id: string;
  date: string; // YYYY-MM-DD
  time_slots: string[]; // HH:mm
}

export interface CreateAppointmentDto {
  consultant_id: string;
  schedule_id: string;
  service_id: string;
  type: ServiceTypeEnums;
  location: string;
  related_appointment_id?: string | null;
}

export interface CreateStiAppoinment {
  appointment: {
    appointment_id: string;
    user_id: string;
    consultant_id?: string | null;
    type: "Testing";
    start_time: string;
    end_time: string;
    status: "Pending";
    location: string;
    payment_status: "Pending";
    is_free_consultation: boolean;
    consultation_notes?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: null;
    service_id: string;
    schedule_id?: string | null;
    related_appointment_id?: string | null;
    free_consultation_valid_until: null;
    payment_refunded: boolean;
    sample_collected_date?: string | null;
    mode: "AT_CLINIC";
  };
  paymentLink: {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: 62376206;
    currency: "VND";
    paymentLinkId: string;
    status: "PENDING";
    checkoutUrl: string;
    qrCode: string;
  };
  testCode: string;
  message: string;
  return_address: string;
  return_phone: string;
}

export interface UserAuth {
  user: {
    sub: string;
    email: string;
    role: "Staff" | "Consultant" | "Admin" | "Customer";
    fullName: string;
    isVerified: boolean;
    isActive: boolean;
    iat: number;
    exp: number;
    user_id: string;
    full_name: string;
    phone_number?: string;
    address?: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
  } | null;
}

export { ServiceTypeEnums, AvailableModeEnums };

export interface GetService {
  service_id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  is_active: boolean;
  type: ServiceTypeEnums;
  testing_hours: TestingHours | null;
  daily_capacity: number | null;
  return_address: string | null;
  return_phone: string | null;
  available_modes: AvailableModeEnums[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
