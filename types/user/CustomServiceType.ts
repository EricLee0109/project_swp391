
export interface ConsultantGetAll {
  user_id: string;
  email: string;
  password_hash: string;
  role: "Consultant";
  full_name: string;
  image?: null;
  phone_number: string;
  address: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  consultant: {
    consultant_id: string;
    user_id: string;
    qualifications: string;
    experience: string;
    specialization: string;
    is_verified: boolean;
    average_rating: number;
    created_at: string;
    updated_at: string;
    deleted_at: null;
  };
}
