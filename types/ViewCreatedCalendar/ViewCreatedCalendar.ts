export interface ViewCreatedCalendarService {
  name: string;
}

export interface ViewCreatedCalendar {
  schedule_id: string;
  consultant_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  created_at: string;
  deleted_at: string | null;
  max_appointments_per_day: number;
  service: ViewCreatedCalendarService;
}

export type ViewCreatedCalendarResponse = ViewCreatedCalendar[];
