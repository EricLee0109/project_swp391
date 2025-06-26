export interface User {
  user_id: string;
  email: string;
  role: "Admin" | "Staff" | "Customer" | string;
  full_name: string;
  phone_number: string;
  address: string;
  is_active: boolean;
  created_at: string; // dạng ISO string
  updated_at: string; // dạng ISO string
}
