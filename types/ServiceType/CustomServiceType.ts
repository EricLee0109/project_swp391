export interface CustomService {
  service_id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  is_active: boolean;
  type: string;
  available_modes: ("AT_HOME" | "AT_CLINIC")[];
  testing_hours: { morning?: { start: string; end: string }; afternoon?: { start: string; end: string } } | null;
  daily_capacity: number | null; // Đổi thành number | null
  return_address: string | null;
  return_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Consultant {
  consultant_id: string;
  full_name: string;
  specialization: string;
  average_rating: number;
  schedules: Array<{
    schedule_id: string;
    start_time: string;
    end_time: string;
  }>;
}

export interface Schedule {
  schedule_id: string;
  start_time: string;
  end_time: string;
}

export interface CreateAppointmentDto {
  consultant_id?: string;
  schedule_id?: string;
  service_id: string;
  type: string;
  location: string;
  related_appointment_id?: string | null;
  test_code?: string | null;
  contact_name?: string;
  contact_phone?: string;
  shipping_address?: string;
  mode: string;
}

export interface CreateStiAppointmentDto {
  serviceId: string;
  date: string;
  session: "morning" | "afternoon";
  location: string;
  category: string;
  selected_mode: "AT_HOME" | "AT_CLINIC";
  contact_name?: string;
  contact_phone?: string;
  shipping_address?: string;
  province?: string;
  district?: string;
  ward?: string;
}
