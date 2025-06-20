import { AvailableMode, ServiceType } from "@/types/enums/HealthServiceEnums";

export interface Service {
  service_id: string;
  name: string;
  description: string;
  price: number; // Changed from string to number as per schema
  category: string;
  is_active: boolean;
  type: ServiceType;
  testing_hours?: string | null; // Optional field from original data
  daily_capacity?: number; // Optional field from original data
  return_address: string | null;
  return_phone: string | null;
  available_modes: AvailableMode[];
}

interface User {
  user_id: string;
  email: string;
  full_name?: string | null;
  phone_number?: string | null;
  // Avatar is not in the User schema, but added here for UI display purposes.
  // In a real app, this might come from a separate profile table or a CDN URL.
  avatar?: string;
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
  type: ServiceType;
  location: string;
  related_appointment_id?: string | null;
}
