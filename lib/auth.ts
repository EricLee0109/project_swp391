import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authJWT() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      user_id: string;
      email: string;
      full_name: string;
      role: string;
      phone_number?: string;
      address?: string;
      is_verified: boolean;
      is_active: boolean;
      created_at: string;
      updated_at: string;
      deleted_at?: string;
    };

    return { user: decoded };
  } catch (err) {
    console.error("❌ Invalid token:", err);
    return null;
  }
}
