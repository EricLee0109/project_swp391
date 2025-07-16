// Thống kê lịch hẹn
export interface AppointmentItem {
  status: string;
  type: string;
  created_at: string;
}
export interface AppointmentStats {
  total: number;
  appointments: AppointmentItem[];
  message: string;
}

// Thống kê kết quả xét nghiệm
export interface TestResultItem {
  is_abnormal: boolean;
  service_id: string;
  created_at: string;
}
export interface TestResultStats {
  total: number;
  testResults: TestResultItem[];
  message: string;
}

// Thống kê sử dụng dịch vụ
export interface ServiceItem {
  service_id: string;
  created_at: string;
}
export interface ServiceStats {
  total: number;
  appointments: ServiceItem[];
  message: string;
}

// Thống kê chu kỳ kinh nguyệt
export interface CycleItem {
  start_date: string;
  cycle_length: number;
  period_length: number;
  symptoms: string[];
}
export interface CycleStats {
  total: number;
  averageCycleLength: number;
  averagePeriodLength: number;
  irregularCycles: number;
  commonSymptoms: string[];
  cycles: CycleItem[];
  message: string;
}

// Thống kê người dùng
export interface UserItem {
  role: string;
  is_active: boolean;
  created_at: string;
}
export interface UserStats {
  total: number;
  users: UserItem[];
  message: string;
}

// Thống kê câu hỏi
export interface QuestionItem {
  status: string;
  category: string;
  consultant_id: string;
  created_at: string;
}
export interface QuestionStats {
  total: number;
  questions: QuestionItem[];
  message: string;
}

// Thống kê doanh thu
export interface RevenueItem {
  amount: string;
  created_at: string;
  appointment_id: string;
}
export interface RevenueStats {
  total: string;
  payments: RevenueItem[];
  message: string;
}

// Thống kê khách hàng sử dụng dịch vụ
export interface CustomerServiceUsageItem {
  user_id: string;
  service_id: string;
  created_at: string;
}
export interface CustomerServiceUsageStats {
  total: number;
  appointments: CustomerServiceUsageItem[];
  message: string;
}
