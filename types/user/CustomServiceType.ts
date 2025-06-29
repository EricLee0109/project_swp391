import { ConsultantUser } from "@/types/user/User";

export interface Consultant {
  consultant_id: string;
  user_id: string; // ✅ thêm dòng này
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
