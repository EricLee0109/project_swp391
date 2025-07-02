// types/appointment.ts

export interface AppointmentDetailResponse {
  appointment: {
    appointment_id: string;
    user_id: string;
    consultant_id: string | null;
    type: string;
    start_time: string;
    end_time: string;
    status: string;
    location: string | null;
    payment_status: string;
    is_free_consultation: boolean;
    consultation_notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    service_id: string;
    schedule_id: string | null;
    related_appointment_id: string | null;
    free_consultation_valid_until: string | null;
    payment_refunded: boolean;
    sample_collected_date: string | null;
    mode: string;
    test_result: {
      result_id: string;
      test_code: string;
      appointment_id: string;
      service_id: string;
      result_data: string;
      is_abnormal: boolean;
      status: string;
      notes: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      viewed_at: string | null;
    } | null;
  };
  appointmentStatusHistory: Array<{
    status: string;
    notes: string;
    changed_at: string;
    changed_by_user: { full_name: string };
  }>;
  message: string;
}
