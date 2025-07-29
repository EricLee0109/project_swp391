import {
  // AvailableMode,
  AvailableModeEnums,
  PaymentStatusEnums,
  // ServiceType,
  StatusTypeEnums,
} from "@/types/enums/HealthServiceEnums";

export interface AppointmentListType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shippingInfo: any;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter(arg0: (s: any) => boolean): ServicesListType[];
    service_id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    is_active: boolean;
    type: "Consultation" | "Testing";
    testing_hours: {
      morning?: { start: string; end: string };
      afternoon?: { start: string; end: string };
    } | null;
    daily_capacity: number;
    return_address: string | null;
    return_phone: string | null;
    available_modes: ("AT_HOME" | "AT_CLINIC" | "ONLINE")[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }
