// types/user/RawUser.ts (hoặc ngay tại file normalizeUser.ts nếu nhỏ)
export interface RawUser {
  id?: string;
  user_id?: string;
  full_name?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  image?: string;
  role?: string;
  is_verified?: boolean;
  is_active?: boolean;
  customerProfile?: any;
  consultantProfile?: any;
}
