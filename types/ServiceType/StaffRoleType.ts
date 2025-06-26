import {
  AvailableMode,
  AvailableModeEnums,
  PaymentStatusEnums,
  ServiceType,
  StatusTypeEnums,
} from "@/types/enums/HealthServiceEnums";

export interface AppointmentListType {
  appointment_id: string;
  user_id: string;
  consultant_id?: string | null;
  type: "Consultation" | "Testing";
  start_time: string;
  end_time: string;
  status: StatusTypeEnums;
  location: string;
  payment_status: PaymentStatusEnums;
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
  sample_collected_date: null;
  mode: AvailableModeEnums;
  user: {
    user_id: string;
    full_name: string;
    email: string;
  };
  service: {
    service_id: string;
    name: string;
    category: string;
  };
  schedule: {
    schedule_id: string;
    start_time: string;
    end_time: string;
  } | null;
}

export interface ServicesListType {
  service_id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  is_active: boolean;
  type: ServiceType;
  testing_hours: {
    morning: {
      end: string; //11:00
      start: string; //07:00
    };
    afternoon: {
      end: string;
      start: string;
    };
  } | null;
  daily_capacity: number | null;
  return_address: string | null;
  return_phone: string | null;
  available_modes: AvailableMode[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
